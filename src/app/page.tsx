"use client";

import { useState, useEffect } from "react";
import FloatingCard from "@/components/FloatingCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { fetchProducts, MappedProduct } from "@/lib/supabase/products";
import BannerSlider from "@/components/BannerSlider";
import { ArrowRight, Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShowcaseSection {
  category: Category;
  products: MappedProduct[];
}

export default function Home() {
  const [showcaseData, setShowcaseData] = useState<ShowcaseSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setIsLoading(true);
      try {
        // 1. Fetch available categories
        const { data: catData, error: catError } = await supabase
          .from("categories")
          .select("id, name, slug")
          .order("name", { ascending: true });

        if (catError) throw catError;
        const categories = catData as Category[];

        // 2. Fetch top 4 products for each category in parallel
        const showcasePromise = categories.map(async (cat) => {
          const products = await fetchProducts(cat.slug, 4);
          return { category: cat, products };
        });

        const results = await Promise.all(showcasePromise);
        setShowcaseData(results.filter(r => r.products.length > 0)); // Only show categories with products
      } catch (err) {
        console.error("Failed to load home page data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 py-10 flex flex-col gap-32">
        {/* Dynamic Hero Banner Slider */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <BannerSlider />
        </motion.section>

        {/* Dynamic Category Showcase Grid */}
        {isLoading ? (
          <section className="py-20 text-center space-y-4">
            <div className="inline-block w-8 h-8 border-2 border-warm-beige border-t-gray-900 rounded-full animate-spin" />
            <p className="font-sans text-sm text-gray-400 tracking-widest uppercase">Curating your experience...</p>
          </section>
        ) : (
          <div className="flex flex-col gap-32">
            {showcaseData.map((section, sectionIdx) => (
              <motion.section 
                key={section.category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: sectionIdx * 0.1, ease: "easeOut" }}
                className="space-y-12"
              >
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-warm-beige pb-8 gap-6">
                  <div className="space-y-2">
                    <p className="font-sans text-xs text-gray-400 tracking-[0.4em] uppercase">Featured Collection</p>
                    <h2 className="font-serif text-4xl md:text-5xl text-gray-900">
                      The {section.category.name} <span className="italic font-normal">Edit</span>
                    </h2>
                  </div>
                  <Link href={`/${section.category.slug}`} className="group flex items-center gap-3 font-sans text-sm tracking-widest uppercase text-gray-900 font-medium">
                    <span>View All {section.category.name}</span>
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                      <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>

                {/* Product Triple/Quad Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-10">
                  {section.products.map((product, pIdx) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: pIdx * 0.1 }}
                      className="w-full flex justify-center"
                    >
                      <FloatingCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}

        {/* Brand Promise / Craftsmanship Quote */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="py-32 flex flex-col items-center text-center space-y-8 border-t border-warm-beige/30"
        >
          <p className="font-serif text-3xl md:text-4xl text-gray-400 max-w-4xl leading-relaxed">
            "We believe that <span className="text-gray-900">Elegance</span> is not just about what you wear, but how you feel when you wear it."
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-px bg-warm-beige" />
            <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-gray-400">Nayoori Studio</span>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
