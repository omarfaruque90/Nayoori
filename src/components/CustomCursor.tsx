"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorText, setCursorText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only run on desktop/devices with a mouse
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsDesktop(false);
      return;
    }

    const mouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over any element with data-cursor attribute
      const target = e.target as HTMLElement;
      const cursorElement = target.closest('[data-cursor]');
      
      if (cursorElement) {
        const text = cursorElement.getAttribute('data-cursor') || "";
        setCursorText(text);
        setIsHovering(true);
      } else {
        setIsHovering(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  if (!mounted) return null;
  if (!isDesktop) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center rounded-full border"
      animate={{
        x: position.x - (isHovering ? 40 : 8),
        y: position.y - (isHovering ? 40 : 8),
        width: isHovering ? 80 : 16,
        height: isHovering ? 80 : 16,
        backgroundColor: isHovering ? "rgba(212, 165, 116, 0.15)" : "rgba(212, 165, 116, 0.4)",
        borderColor: isHovering ? "rgba(212, 165, 116, 0.6)" : "rgba(212, 165, 116, 0.5)",
        borderWidth: isHovering ? 1.5 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      <AnimatePresence>
        {isHovering && cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-gray-800 font-sans text-[9px] font-bold uppercase tracking-widest pointer-events-none"
          >
            {cursorText}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
