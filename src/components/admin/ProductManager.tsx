"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/lib/supabase/products";
import type { Category } from "@/components/admin/CategoryManager";
import ProductForm from "./ProductForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  RefreshCw,
} from "lucide-react";

// ─── Removed Hardcoded Categories ───────────────────────
// We now dynamically generate pills or fallback to a standard badge style if colors are missing
const STOCK_COLORS: Record<string, string> = {
  "In Stock": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Out of Stock": "bg-red-50 text-red-600 border-red-200",
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete dialog
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch both products and active categories concurrently
      const [productsData, categoriesData] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name", { ascending: true })
      ]);

      if (productsData.error) throw productsData.error;
      if (categoriesData.error) throw categoriesData.error;
      
      setProducts((productsData.data as Product[]) || []);
      setCategories((categoriesData.data as Category[]) || []);
    } catch (err) {
      console.error("Failed to fetch products or categories:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Realtime subscription ──────────────────────────
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProducts((prev) => [payload.new as Product, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === (payload.new as Product).id
                  ? (payload.new as Product)
                  : p
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProducts((prev) =>
              prev.filter((p) => p.id !== (payload.old as Product).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  // ─── Add Product ────────────────────────────────────
  const handleAddProduct = async (
    data: Omit<Product, "id" | "created_at">
  ) => {
    const { error } = await supabase.from("products").insert(data);
    if (error) throw error;
  };

  // ─── Update Product ─────────────────────────────────
  const handleUpdateProduct = async (
    data: Omit<Product, "id" | "created_at">
  ) => {
    if (!editingProduct) return;
    const { error } = await supabase
      .from("products")
      .update(data)
      .eq("id", editingProduct.id);
    if (error) throw error;
  };

  // ─── Delete Product ─────────────────────────────────
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deletingProduct.id);
      if (error) throw error;
      setDeletingProduct(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Open Edit ──────────────────────────────────────
  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // ─── Open Add ───────────────────────────────────────
  const openAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // ─── Filtered products ─────────────────────────────
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Stats ──────────────────────────────────────────
  const totalProducts = products.length;
  const inStockCount = products.filter(
    (p) => p.stock_status === "In Stock"
  ).length;

  // Dynamic category counts
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat.slug] = products.filter((p) => p.category === cat.slug).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {/* ── Stats Row ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white border border-warm-beige rounded-2xl p-5">
          <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1">
            Total Products
          </p>
          <p className="font-serif text-2xl text-gray-900">{totalProducts}</p>
        </div>
        <div className="bg-white border border-warm-beige rounded-2xl p-5">
          <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1">
            In Stock
          </p>
          <p className="font-serif text-2xl text-emerald-700">{inStockCount}</p>
        </div>
        <div className="bg-white border border-warm-beige rounded-2xl p-5">
          <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1">
            Total Categories
          </p>
          <p className="font-serif text-2xl text-gray-900">
            {categories.length}
          </p>
        </div>
      </motion.div>

      {/* ── Products Table ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white border border-warm-beige rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-warm-beige flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
            <h2 className="font-serif text-xl text-gray-900 flex-shrink-0">
              Products
            </h2>
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-10 pr-4 py-2 bg-warm-beige/20 border border-warm-beige/50 rounded-full focus:border-gray-400 focus:ring-0 outline-none transition-colors font-sans text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="p-2.5 hover:bg-warm-beige/30 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-sans text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            <p className="font-sans text-sm text-gray-500 mt-4">
              Loading products…
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-serif text-xl text-gray-900 mb-2">
              {searchQuery ? "No products match your search" : "No products yet"}
            </p>
            <p className="font-sans text-sm text-gray-500 mb-6">
              {searchQuery
                ? "Try a different search term."
                : "Add your first product to get started."}
            </p>
            {!searchQuery && (
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-sans text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-lg"
              >
                <Plus className="w-4 h-4" />
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-warm-beige/50">
                  <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500 hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500 hidden lg:table-cell">
                    Stock
                  </th>
                  <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500 hidden lg:table-cell">
                    Sizes
                  </th>
                  <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-warm-beige/30 hover:bg-warm-beige/10 transition-colors"
                  >
                    {/* Product: thumbnail + title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-[72px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          {product.main_image_url ? (
                            <img
                              src={product.main_image_url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-sans text-sm text-gray-900 font-medium truncate max-w-[200px]">
                            {product.title}
                          </p>
                          <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                            {product.id.slice(0, 8)}…
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category badge */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-sans font-medium rounded-full border capitalize bg-gray-50 text-gray-700 border-gray-200`}
                      >
                        {categories.find(c => c.slug === product.category)?.name || product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-sans text-sm text-gray-900 font-medium">
                      ৳{Number(product.price).toLocaleString()}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-sans font-medium rounded-full border ${
                          STOCK_COLORS[product.stock_status] ||
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {product.stock_status}
                      </span>
                    </td>

                    {/* Sizes */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="font-sans text-xs text-gray-500 max-w-[120px] truncate">
                        {(product.sizes || []).join(", ") || "—"}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2.5 hover:bg-warm-beige/40 rounded-lg transition-colors group"
                          title="Edit product"
                        >
                          <Pencil className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="p-2.5 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Product Form Modal ─────────────────────── */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        initialData={editingProduct}
        categories={categories}
      />

      {/* ── Delete Confirm Dialog ──────────────────── */}
      <DeleteConfirmDialog
        isOpen={Boolean(deletingProduct)}
        productName={deletingProduct?.title || ""}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeletingProduct(null)}
        isDeleting={isDeleting}
      />
    </>
  );
}
