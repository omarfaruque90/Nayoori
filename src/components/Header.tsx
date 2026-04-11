"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { openCart, cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <header className="w-full py-5 px-6 md:px-10 flex justify-between items-center border-b border-warm-beige bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        
        {/* Mobile Hamburger */}
        <button 
          className="md:hidden p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-colors"
          onClick={toggleMobileMenu}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="mx-auto md:mx-0 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <h1 className="font-serif text-3xl font-bold tracking-widest text-gray-900 uppercase hover:text-gray-600 transition-colors cursor-pointer">
            Nayoori
          </h1>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 font-sans text-sm tracking-widest text-gray-600 uppercase">
          <Link href="/saree" className="hover:text-gray-900 transition-colors">Saree</Link>
          <Link href="/kurti" className="hover:text-gray-900 transition-colors">Kurti</Link>
          <Link href="/western" className="hover:text-gray-900 transition-colors">Western</Link>
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center gap-4">
          <button 
            onClick={openCart} 
            className="relative p-3 -mr-3 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-gray-900 text-white rounded-full text-[10px] flex items-center justify-center font-sans font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[73px] bg-white z-30 flex flex-col items-center justify-start pt-12 space-y-8 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 font-serif text-2xl text-gray-900 uppercase tracking-widest">
              <Link href="/saree" onClick={toggleMobileMenu} className="hover:text-gray-500 transition-colors">Saree Collection</Link>
              <Link href="/kurti" onClick={toggleMobileMenu} className="hover:text-gray-500 transition-colors">Kurti Collection</Link>
              <Link href="/western" onClick={toggleMobileMenu} className="hover:text-gray-500 transition-colors">Western Wear</Link>
            </nav>
            <button 
              onClick={toggleMobileMenu}
              className="mt-8 p-4 bg-warm-beige/20 rounded-full text-gray-600 hover:bg-warm-beige hover:text-gray-900 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

