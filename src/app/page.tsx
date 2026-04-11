"use client";

import FloatingCard from "@/components/FloatingCard";
import CheckoutForm from "@/components/CheckoutForm";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Demo product for the Antigravity card
  const demoProduct = {
    id: "s1",
    title: "Blush Silk Saree",
    price: 12500,
    mainImageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&q=80&w=600&h=800", // Placeholder image 
    hoverImageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600&h=800", // Alternate angle placeholder
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 py-16 flex flex-col gap-24">
        {/* Antigravity Product Showcase Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className="flex-1 space-y-6">
            <h2 className="font-serif text-5xl md:text-7xl leading-tight text-gray-900">
              Floating <br /> Elegance.
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-md">
              Experience our latest collection inspired by zero gravity. Lightweight materials, flowing designs, and a modern aesthetic.
            </p>
            <Link href="/saree">
              <button className="px-8 py-4 bg-gray-900 text-white font-sans uppercase tracking-widest text-sm rounded hover:bg-gray-800 transition-colors">
                Explore Collection
              </button>
            </Link>
          </div>
          <div className="flex-1 flex justify-center py-10 bg-warm-beige/20 rounded-3xl relative">
            {/* The Antigravity Card */}
            <FloatingCard product={demoProduct} />
          </div>
        </motion.section>

        {/* Guest Checkout Demo Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="py-20 border-t border-warm-beige"
        >
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-gray-900 mb-4">Swift Checkout</h2>
            <p className="font-sans text-gray-600">Experience our seamless guest checkout flow.</p>
          </div>
          <CheckoutForm cartItems={[{ productId: "1", quantity: 1, price: 12500 }]} totalAmount={12500} />
        </motion.section>
      </main>
    </div>
  );
}
