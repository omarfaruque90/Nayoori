"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function CartDrawer() {
  const { isDrawerOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-warm-beige">
              <h2 className="font-serif text-2xl text-gray-900">Your Bag</h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-warm-beige/30 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-warm-beige/20 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-gray-900 mb-2">Your bag is empty</h3>
                    <p className="font-sans text-gray-500">Looks like you haven't added any elegant pieces yet.</p>
                  </div>
                  <button 
                    onClick={closeCart}
                    className="px-8 py-4 bg-gray-900 text-white font-sans uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
                  >
                    Shop Our Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex gap-6">
                      {/* Floating Mini Image */}
                      <div className="relative w-24 h-32 bg-warm-beige/20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <motion.div
                          animate={{ y: ["-2%", "2%", "-2%"] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="relative w-[80%] h-[80%]"
                        >
                          <Image
                            src={item.mainImageUrl}
                            alt={item.title}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded drop-shadow-md"
                          />
                        </motion.div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-serif text-lg text-gray-900 leading-tight">{item.title}</h4>
                          <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="font-sans text-gray-600 text-sm mb-3">৳{item.price.toLocaleString()}</p>
                        
                        <div className="font-sans text-xs text-gray-500 tracking-wider uppercase mb-auto space-y-1">
                          <p>Color: <span className="font-medium text-gray-900">{item.color}</span></p>
                          {item.size && <p>Size: <span className="font-medium text-gray-900">{item.size}</span></p>}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-4 bg-gray-50 self-start rounded border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="p-2 hover:text-gray-900 text-gray-500 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-sans text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="p-2 hover:text-gray-900 text-gray-500 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & CTAs */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-warm-beige bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-gray-600 tracking-widest uppercase text-sm">Subtotal</span>
                  <span className="font-sans text-2xl font-medium text-gray-900">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href="/checkout" onClick={closeCart} className="w-full">
                    <button className="w-full py-4 bg-gray-900 text-white font-sans uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">
                      Checkout
                    </button>
                  </Link>
                  <button 
                    onClick={closeCart}
                    className="w-full py-4 bg-transparent text-gray-900 border border-gray-900 font-sans uppercase tracking-widest text-sm hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
