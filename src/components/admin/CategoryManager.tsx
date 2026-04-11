"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { Plus, Trash2, Library, RefreshCw } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Fetch Categories ─────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data as Category[]);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ─── Add Category ─────────────────────────────────────
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dashes
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsAdding(true);
    const slug = generateSlug(newCategoryName);

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name: newCategoryName.trim(), slug }])
        .select()
        .single();

      if (error) throw error;
      
      setCategories((prev) => [...prev, data as Category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategoryName("");
    } catch (err: any) {
      console.error("Failed to add category:", err);
      alert(`Error adding category: ${err.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  // ─── Delete Category ──────────────────────────────────
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      alert(`Error deleting category: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Add New Category ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-warm-beige rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-warm-beige/20 rounded-xl flex items-center justify-center">
            <Library className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="font-serif text-xl text-gray-900">Manage Categories</h2>
            <p className="font-sans text-xs text-gray-500">
              Create and manage product categories dynamically.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block font-sans text-[11px] tracking-widest uppercase text-gray-500 mb-2">
              New Category Name
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g., Summer Collection"
              className="w-full p-3.5 bg-gray-50/50 border border-warm-beige/60 rounded-xl outline-none focus:border-gray-900 focus:bg-white font-sans text-sm transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!newCategoryName.trim() || isAdding}
            className="px-6 py-3.5 bg-gray-900 text-white font-sans text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[46px] flex items-center gap-2"
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add Category
          </button>
        </form>
      </motion.div>

      {/* ── Category List ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white border border-warm-beige rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-warm-beige flex justify-between items-center bg-gray-50/30">
          <h3 className="font-serif text-lg text-gray-900">Active Categories</h3>
          <button
            onClick={fetchCategories}
            className="p-2 hover:bg-warm-beige/50 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500 font-sans text-sm">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-sans text-sm">
            No categories found. Create one above!
          </div>
        ) : (
          <div className="divide-y divide-warm-beige/30">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-5 hover:bg-warm-beige/10 transition-colors"
              >
                <div>
                  <p className="font-sans text-sm font-medium text-gray-900">
                    {category.name}
                  </p>
                  <p className="font-mono text-xs text-gray-400 mt-1">
                    Slug: {category.slug}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={deletingId === category.id}
                  className="p-2.5 hover:bg-red-50 rounded-xl transition-colors group disabled:opacity-50"
                  title="Delete category"
                >
                  {deletingId === category.id ? (
                    <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
