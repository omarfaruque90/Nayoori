"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import FloatingCard from "@/components/FloatingCard";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  color: string;
  mainImageUrl: string;
  hoverImageUrl: string;
}

export default function CategoryView({ products }: { products: Product[] }) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(20000);

  const availableColors = Array.from(new Set(products.map((p) => p.color)));

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchColor = selectedColor ? p.color === selectedColor : true;
      const matchPrice = p.price <= maxPrice;
      return matchColor && matchPrice;
    });
  }, [products, selectedColor, maxPrice]);

  return (
    <div className="flex flex-col md:flex-row gap-12">
      {/* Sidebar Filtering */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-10">
        <div>
          <h3 className="font-serif text-xl text-gray-900 mb-4 border-b border-warm-beige pb-2">Filter by Price</h3>
          <div className="space-y-4 pt-2">
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gray-900"
            />
            <div className="flex justify-between font-sans text-sm text-gray-600">
              <span>৳1,000</span>
              <span>Up to ৳{maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl text-gray-900 mb-4 border-b border-warm-beige pb-2">Filter by Color</h3>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setSelectedColor(null)}
              className={`px-4 py-2 font-sans text-sm rounded-full border transition-colors ${
                selectedColor === null
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-transparent text-gray-600 border-gray-300 hover:border-gray-900"
              }`}
            >
              All Colors
            </button>
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 font-sans text-sm rounded-full border transition-colors capitalize ${
                  selectedColor === color
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-transparent text-gray-600 border-gray-300 hover:border-gray-900"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Grid area */}
      <div className="flex-1 w-full">
        <div className="mb-6 flex justify-between items-center text-sm font-sans text-gray-500">
          <span>Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-10 justify-items-center">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="w-full flex justify-center"
              >
                <FloatingCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-warm-beige/10 rounded-2xl border border-warm-beige/30">
            <p className="font-sans text-gray-600 text-lg">No products found for the selected filters.</p>
            <button 
              onClick={() => { setSelectedColor(null); setMaxPrice(20000); }}
              className="mt-4 px-6 py-2 border border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
