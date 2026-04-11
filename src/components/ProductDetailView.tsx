"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

interface ProductDetailViewProps {
  product: {
    id: string;
    title: string;
    price: number;
    color: string;
    description: string;
    sizes: string[];
    mainImageUrl: string;
    hoverImageUrl: string;
  };
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.color);
  const { addToCart, closeCart } = useCart();
  const router = useRouter();

  // We are simulating color options being available
  // In a real database, products would have multiple color variants mapped
  const availableColors = [product.color]; 

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      mainImageUrl: product.mainImageUrl,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart(); // Push to cart
    closeCart(); // Attempt to close cart drawer instantly if openCart was triggered
    router.push("/checkout"); // Redirect immediately
  };

  return (
    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
      {/* Left Column: Floating Antigravity Image */}
      <div className="flex-1 w-full flex items-center justify-center p-10 bg-warm-beige/10 rounded-3xl relative min-h-[600px] overflow-hidden">
        <motion.div
          animate={{
            y: ["-3%", "3%", "-3%"], // Slow, continuous floating
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full max-w-[500px] aspect-[3/4]"
        >
          <Image
            src={product.mainImageUrl}
            alt={product.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-xl drop-shadow-2xl"
            priority
          />
        </motion.div>
      </div>

      {/* Right Column: Product Details */}
      <div className="flex-1 w-full py-8 flex flex-col justify-center">
        <p className="font-sans text-sm tracking-widest text-gray-500 uppercase mb-4">Nayoori Studio</p>
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">{product.title}</h1>
        <p className="font-sans text-2xl text-gray-600 mb-8">৳{product.price.toLocaleString()}</p>

        <p className="font-sans text-lg text-gray-600 leading-relaxed mb-10 max-w-lg">
          {product.description}
        </p>

        {/* Color Selection */}
        <div className="mb-8">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-gray-900 mb-4">Color</h3>
          <div className="flex gap-4">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                  selectedColor === color ? "border-gray-900 scale-110" : "border-gray-300 hover:border-gray-500"
                }`}
                style={{ backgroundColor: color === 'white' ? '#fff' : color, 
                         borderColor: color === 'white' && selectedColor !== color ? '#e5e7eb' : undefined }}
                aria-label={`Select ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        {product.sizes.length > 0 && (
          <div className="mb-12">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-gray-900 mb-4">Size</h3>
            <div className="flex flex-wrap gap-4">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-3 font-sans text-sm uppercase tracking-widest border transition-colors ${
                    selectedSize === size
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-transparent text-gray-700 border-gray-300 hover:border-gray-900"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions - Fixed Bottom Bar on Mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white p-4 border-t border-warm-beige shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:static md:bg-transparent md:p-0 md:border-0 md:shadow-none flex flex-row gap-4 mt-auto">
          <button 
            onClick={handleAddToCart}
            className="flex-1 py-4 md:py-5 px-4 md:px-8 bg-transparent text-gray-900 border border-gray-900 font-sans uppercase tracking-widest text-[11px] md:text-sm hover:bg-gray-50 transition-colors"
          >
            Add to Cart
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-1 py-4 md:py-5 px-4 md:px-8 bg-gray-900 text-white font-sans uppercase tracking-widest text-[11px] md:text-sm hover:bg-gray-800 transition-colors md:shadow-xl shadow-gray-900/20"
          >
            Buy Now
          </button>
        </div>
        
        {/* Spacer for mobile fixed bar */}
        <div className="h-24 md:hidden"></div>
      </div>
    </div>
  );
}
