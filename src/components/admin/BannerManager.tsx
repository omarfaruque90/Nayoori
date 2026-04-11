"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Hash, RefreshCw, Upload } from "lucide-react";
import { uploadImage } from "@/lib/supabase/storage";

export interface Banner {
  id: string;
  image_url: string;
  link_url: string;
  order: number;
}

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newBanner, setNewBanner] = useState({
    image_url: "",
    link_url: "",
    order: 0
  });

  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("hero_banners")
        .select("*")
        .order("order", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (err: any) {
      console.error("Failed to fetch banners:", err.message || JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file, "banners");
      setNewBanner(prev => ({ ...prev, image_url: url }));
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.image_url.trim()) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("hero_banners")
        .insert([newBanner])
        .select()
        .single();

      if (error) throw error;
      
      setBanners(prev => [...prev, data as Banner].sort((a, b) => a.order - b.order));
      setNewBanner({ image_url: "", link_url: "", order: banners.length + 1 });
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Remove this banner?")) return;
    try {
      const { error } = await supabase.from("hero_banners").delete().eq("id", id);
      if (error) throw error;
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Add Banner ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-warm-beige rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-warm-beige/20 rounded-xl flex items-center justify-center text-gray-600">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl text-gray-900">Add New Banner</h2>
            <p className="font-sans text-xs text-gray-500">Recommended ratio: 16:9 (e.g., 1920x1080)</p>
          </div>
        </div>

        <form onSubmit={handleAddBanner} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direct Image Upload */}
            <div>
              <label className="block font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-2">Banner Image</label>
              <div className="relative group">
                {newBanner.image_url ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-warm-beige group-hover:border-gray-900 transition-colors">
                    <img src={newBanner.image_url} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => setNewBanner(p => ({ ...p, image_url: "" }))}
                      className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-sans text-xs uppercase tracking-widest"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-warm-beige rounded-xl cursor-pointer hover:bg-white hover:border-gray-900 transition-all p-6 text-center">
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                        <span className="font-sans text-xs text-gray-500">Uploading to Storage...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-3" />
                        <span className="font-sans text-sm font-medium text-gray-900">Choose Image or Drag & Drop</span>
                        <span className="font-sans text-xs text-gray-500 mt-1">PNG, JPG, HEIC up to 5MB</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Banner Details */}
            <div className="space-y-4">
              <div>
                <label className="block font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-2">Link URL (Optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={newBanner.link_url}
                    onChange={e => setNewBanner(p => ({ ...p, link_url: e.target.value }))}
                    placeholder="/collection/saree"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-warm-beige/60 rounded-xl font-sans text-sm focus:bg-white focus:border-gray-900 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-2">Sort Order</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={newBanner.order}
                      onChange={e => setNewBanner(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-warm-beige/60 rounded-xl font-sans text-sm focus:bg-white focus:border-gray-900 transition-all text-center"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSaving || isUploading || !newBanner.image_url}
                  className="mt-6 w-full py-3 bg-gray-900 text-white font-sans text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Banner
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* ── Banner List ────────────────────────────────── */}
      <div className="bg-white border border-warm-beige rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-warm-beige flex justify-between items-center bg-gray-50/30">
          <h3 className="font-serif text-lg text-gray-900">Active Banners</h3>
          <button onClick={fetchBanners} className="p-2 hover:bg-warm-beige/50 rounded-lg transition-all">
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400 font-sans text-sm">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-sans text-sm">No banners uploaded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-warm-beige/30">
            {banners.map((banner) => (
              <div key={banner.id} className="p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-48 aspect-video bg-gray-100 rounded-lg overflow-hidden border border-warm-beige/50 shrink-0">
                  <img src={banner.image_url} className="w-full h-full object-cover" alt="Banner Preview" />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">#{banner.order}</span>
                    <p className="font-mono text-[10px] text-gray-400 uppercase truncate max-w-[200px]">{banner.id}</p>
                  </div>
                  <p className="font-sans text-sm text-gray-500 truncate max-w-md">Link: {banner.link_url || "None"}</p>
                </div>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
