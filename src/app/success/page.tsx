"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// ─── Confetti Particle ────────────────────────────────
function ConfettiParticle({ delay, index }: { delay: number; index: number }) {
  const colors = [
    "#eee5d8", // warm beige
    "#f4d3d8", // blush pink
    "#d4c5b3", // gold beige
    "#c9b8a3", // deep sand
    "#171717", // noir
    "#e8ddd0", // cream
  ];

  const color = colors[index % colors.length];
  const startX = Math.random() * 100; // vw position
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;
  const drift = (Math.random() - 0.5) * 200;
  const isCircle = Math.random() > 0.5;

  return (
    <motion.div
      initial={{
        opacity: 1,
        y: -20,
        x: 0,
        rotate: 0,
        scale: 1,
      }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, 400, 800],
        x: [0, drift * 0.5, drift],
        rotate: [0, rotation, rotation * 2],
        scale: [1, 1, 0.5],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        ease: "easeOut",
      }}
      className="fixed pointer-events-none z-50"
      style={{
        left: `${startX}%`,
        top: -10,
        width: size,
        height: isCircle ? size : size * 2.5,
        backgroundColor: color,
        borderRadius: isCircle ? "50%" : "2px",
      }}
    />
  );
}

// ─── Success Content (needs useSearchParams) ──────────
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] px-6 relative overflow-hidden">
      {/* Confetti burst */}
      {showConfetti &&
        Array.from({ length: 40 }).map((_, i) => (
          <ConfettiParticle
            key={i}
            index={i}
            delay={i * 0.06}
          />
        ))}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.2 }}
        className="w-full max-w-lg text-center relative z-10"
      >
        <div className="bg-white border border-warm-beige rounded-3xl p-12 shadow-2xl shadow-warm-beige/40">
          {/* Animated check icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 200,
              delay: 0.5,
            }}
            className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="font-serif text-4xl md:text-5xl text-gray-900 mb-3"
          >
            Thank You
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <p className="font-sans text-gray-500 text-lg mb-8">
              Your order has been elegantly placed.
            </p>

            {/* Divider */}
            <div className="w-16 h-[1px] bg-warm-beige mx-auto mb-8" />

            {/* Order details */}
            <div className="space-y-4 mb-10">
              {orderId && (
                <div className="bg-warm-beige/15 p-5 rounded-2xl border border-warm-beige/40">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1.5">
                    Order ID
                  </p>
                  <p className="font-mono text-sm font-medium text-gray-900 break-all">
                    {orderId}
                  </p>
                </div>
              )}

              {total && (
                <div className="bg-warm-beige/15 p-5 rounded-2xl border border-warm-beige/40">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1.5">
                    Total Amount
                  </p>
                  <p className="font-serif text-2xl text-gray-900">
                    ৳{Number(total).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Info note */}
            <p className="font-sans text-xs text-gray-400 leading-relaxed mb-10 max-w-sm mx-auto">
              We'll contact you shortly to confirm your order. You can also
              reach us on WhatsApp for any questions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <button className="w-full py-4 px-6 bg-gray-900 text-white font-sans uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors rounded-lg flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </button>
              </Link>
              <Link href="/contact" className="flex-1">
                <button className="w-full py-4 px-6 bg-transparent text-gray-700 border border-gray-200 font-sans uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors rounded-lg flex items-center justify-center gap-2">
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center min-h-[80vh]">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
