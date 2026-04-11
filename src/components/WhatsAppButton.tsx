"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Nayoori! I'm interested in one of your products. Can you help me?"
);

const DEFAULT_NUMBER = "8801700000000";

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_NUMBER);

  // Fetch WhatsApp number from site_settings
  useEffect(() => {
    async function loadNumber() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("whatsapp_number")
          .eq("id", "default")
          .single();

        if (!error && data?.whatsapp_number) {
          setWhatsappNumber(data.whatsapp_number);
        }
      } catch {
        // Fallback to default
      }
    }
    loadNumber();
  }, []);

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${WHATSAPP_MESSAGE}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 15, stiffness: 200, delay: 1.5 }}
      className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8 group"
      // On mobile, sit above the product detail "Add to Cart" bar (h-24 + margin)
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />

      {/* Soft glow */}
      <span className="absolute inset-[-4px] rounded-full bg-[#25D366]/10 animate-[pulse_2s_ease-in-out_infinite]" />

      {/* Main button */}
      <div className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-shadow duration-300 group-hover:scale-105 transition-transform">
        {/* WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white font-sans text-xs py-2 px-4 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
        Chat with us
        <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-gray-900" />
      </div>
    </motion.a>
  );
}
