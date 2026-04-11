"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon, Upload, RefreshCw } from "lucide-react";
import type { Product } from "@/lib/supabase/products";
import type { Category } from "@/components/admin/CategoryManager";

// ─── Types ────────────────────────────────────────────
interface ProductFormData {
  title: string;
  price: string;
  category: string; // Dynamic string instead of strict union
  color: string;
  description: string;
  sizes: string[];
  colors: string;
  main_image_url: string;
  hover_image_url: string;
  stock_status: "In Stock" | "Out of Stock";
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id" | "created_at">) => Promise<void>;
  initialData?: Product | null;
  categories: Category[];
}

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Regular", "Free Size"];

const EMPTY_FORM: ProductFormData = {
  title: "",
  price: "",
  category: "saree",
  color: "",
  description: "",
  sizes: [],
  colors: "",
  main_image_url: "",
  hover_image_url: "",
  stock_status: "In Stock",
};

// ─── Component ────────────────────────────────────────
export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const isEditMode = Boolean(initialData);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        price: String(initialData.price),
        category: initialData.category,
        color: initialData.color || "",
        description: initialData.description || "",
        sizes: initialData.sizes || [],
        colors: (initialData.colors || []).join(", "),
        main_image_url: initialData.main_image_url,
        hover_image_url: initialData.hover_image_url || "",
        stock_status: initialData.stock_status,
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        // Default to the first available category if it exists, otherwise fallback to saree text for safety against empty DB states
        category: categories.length > 0 ? categories[0].slug : "saree",
      });
    }
    setErrors({});
  }, [initialData, isOpen, categories]);

  // ─── Validation ─────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = "Product name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!form.main_image_url.trim())
      newErrors.main_image_url = "Main image URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Size toggle ───────────────────────────────────
  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // ─── Submit ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        price: Number(form.price),
        category: form.category,
        color: form.color.trim() || form.colors.split(",")[0]?.trim() || "",
        description: form.description.trim(),
        sizes: form.sizes,
        colors: form.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        main_image_url: form.main_image_url.trim(),
        hover_image_url: form.hover_image_url.trim(),
        stock_status: form.stock_status,
      });
      setForm(EMPTY_FORM);
      onClose();
    } catch (err) {
      console.error("Failed to save product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Field helper ──────────────────────────────────
  const inputClass = (field: keyof ProductFormData) =>
    `w-full p-3.5 bg-white border ${
      errors[field] ? "border-red-300" : "border-gray-200"
    } rounded-lg shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans text-sm`;

  const labelClass =
    "block font-sans text-[11px] tracking-widest uppercase text-gray-500 mb-2";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="px-8 py-6 border-b border-warm-beige flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-serif text-2xl text-gray-900">
                  {isEditMode ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="font-sans text-xs text-gray-500 mt-1">
                  {isEditMode
                    ? "Update the details below and save changes."
                    : "Fill in the details to add a new product to Nayoori."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-warm-beige/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* ── Form Body ── */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-8 space-y-6"
            >
              {/* Row: Title + Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="e.g. Blush Silk Saree"
                    className={inputClass("title")}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1 font-sans">
                      {errors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Price (৳) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="12500"
                    min="0"
                    step="1"
                    className={inputClass("price")}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1 font-sans">
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Row: Category + Stock Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value,
                      }))
                    }
                    className={inputClass("category")}
                  >
                    {categories.length === 0 && (
                      <option value="saree">Saree</option>
                    )}
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Stock Status</label>
                  <select
                    value={form.stock_status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        stock_status: e.target
                          .value as ProductFormData["stock_status"],
                      }))
                    }
                    className={inputClass("stock_status")}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Row: Main Image + Hover Image Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Main Image */}
                <div>
                  <label className={labelClass}>Main Product Image *</label>
                  <div className="relative group">
                    {form.main_image_url ? (
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-warm-beige group-hover:border-gray-900 transition-colors">
                        <img src={form.main_image_url} className="w-full h-full object-cover" alt="Main Preview" />
                        <button 
                          type="button"
                          onClick={() => setForm(f => ({ ...f, main_image_url: "" }))}
                          className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-sans text-xs uppercase tracking-widest"
                        >
                          Change Main Image
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-[3/4] bg-gray-50 border-2 border-dashed border-warm-beige rounded-xl cursor-pointer hover:bg-white hover:border-gray-900 transition-all p-4 text-center">
                        {uploadingFields.main_image_url ? (
                          <div className="flex flex-col items-center gap-2">
                            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                            <span className="font-sans text-[10px] text-gray-500 uppercase tracking-tighter">Uploading…</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="font-sans text-xs font-medium text-gray-900">Upload Main Image</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "main_image_url")} />
                          </>
                        )}
                      </label>
                    )}
                  </div>
                  {errors.main_image_url && (
                    <p className="text-red-500 text-[10px] mt-2 font-sans uppercase tracking-widest">{errors.main_image_url}</p>
                  )}
                </div>

                {/* Hover Image */}
                <div>
                  <label className={labelClass}>Hover Image (Optional)</label>
                  <div className="relative group">
                    {form.hover_image_url ? (
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-warm-beige group-hover:border-gray-900 transition-colors">
                        <img src={form.hover_image_url} className="w-full h-full object-cover" alt="Hover Preview" />
                        <button 
                          type="button"
                          onClick={() => setForm(f => ({ ...f, hover_image_url: "" }))}
                          className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-sans text-xs uppercase tracking-widest"
                        >
                          Change Hover Image
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-[3/4] bg-gray-50 border-2 border-dashed border-warm-beige rounded-xl cursor-pointer hover:bg-white hover:border-gray-900 transition-all p-4 text-center">
                        {uploadingFields.hover_image_url ? (
                          <div className="flex flex-col items-center gap-2">
                            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                            <span className="font-sans text-[10px] text-gray-500 uppercase tracking-tighter">Uploading…</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="font-sans text-xs font-medium text-gray-900">Upload Hover Image</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "hover_image_url")} />
                          </>
                        )}
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe the elegance of this piece..."
                  rows={3}
                  className={`${inputClass("description")} resize-none`}
                />
              </div>

              {/* Sizes Multi-Select */}
              <div>
                <label className={labelClass}>Available Sizes</label>
                <div className="flex flex-wrap gap-2.5">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 font-sans text-xs uppercase tracking-widest border rounded-lg transition-colors ${
                        form.sizes.includes(size)
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors input */}
              <div>
                <label className={labelClass}>
                  Available Colors{" "}
                  <span className="normal-case tracking-normal text-gray-400">
                    (comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, colors: e.target.value }))
                  }
                  placeholder="e.g. pink, red, ivory"
                  className={inputClass("colors")}
                />
              </div>

              {/* Primary Color */}
              <div>
                <label className={labelClass}>
                  Primary Color{" "}
                  <span className="normal-case tracking-normal text-gray-400">
                    (used for filtering)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, color: e.target.value }))
                  }
                  placeholder="e.g. pink"
                  className={inputClass("color")}
                />
              </div>

              {/* ── Submit Button ── */}
              <div className="pt-4 border-t border-warm-beige">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gray-900 text-white font-sans uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isEditMode ? "Saving…" : "Adding…"}
                    </>
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
