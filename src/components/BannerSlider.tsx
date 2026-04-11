"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  image_url: string;
  link_url: string;
  order: number;
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanners = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("hero_banners")
        .select("*")
        .order("order", { ascending: true });

      if (error) throw error;
      if (data) setBanners(data as Banner[]);
    } catch (err: any) {
      console.error("Error fetching banners:", err.message || JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Auto-play interval
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-warm-beige/10 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-warm-beige border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-warm-beige/20 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={banners[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {banners[currentIndex].link_url ? (
            <Link href={banners[currentIndex].link_url}>
              <img
                src={banners[currentIndex].image_url}
                alt="Nayoori Sale Banner"
                className="w-full h-full object-cover select-none"
              />
            </Link>
          ) : (
            <img
              src={banners[currentIndex].image_url}
              alt="Nayoori Sale Banner"
              className="w-full h-full object-cover select-none"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i === currentIndex 
                    ? "bg-white w-8" 
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
