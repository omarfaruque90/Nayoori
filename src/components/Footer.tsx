"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/supabase/settings";

// Inline SVG icons (lucide-react doesn't export Facebook/Instagram in all versions)
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      // Use .limit(1) to cleanly grab the first row regardless of if its ID is 1 or "default"
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .single();
        
      if (!error && data) {
        console.log("Footer Data Loaded Successfully from Supabase:", data);
        // Merge with DEFAULT_SETTINGS so that if Facebook is literally returning 'null', it safely falls back to ""
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      } else {
        console.error("Footer fetch failed. Using fallbacks.", error);
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  console.log('FOOTER DEBUG:', settings, 'Loading:', isLoading);

  return (
    <footer className="bg-[#e9ded1] pt-16 pb-8 border-t border-warm-beige mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Story */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold tracking-widest text-gray-900 uppercase">
              Nayoori
            </h2>
            <p className="font-sans text-gray-600 text-sm leading-relaxed max-w-sm">
              Celebrating the timeless elegance of Bangladeshi women's fashion. Designed for the modern silhouette with a zero-gravity feel.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-lg text-gray-900 mb-6 uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-4 font-sans text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-gray-900 hover:underline transition-all">Home</Link>
              </li>
              <li>
                <Link href="/saree" className="hover:text-gray-900 hover:underline transition-all">Saree Collection</Link>
              </li>
              <li>
                <Link href="/kurti" className="hover:text-gray-900 hover:underline transition-all">Kurti Collection</Link>
              </li>
              <li>
                <Link href="/western" className="hover:text-gray-900 hover:underline transition-all">Western Wear</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policy & Support */}
          <div>
            <h3 className="font-serif text-lg text-gray-900 mb-6 uppercase tracking-widest">Support & Legal</h3>
            <ul className="space-y-4 font-sans text-sm text-gray-600">
              <li>
                <Link href="/privacy-policy" className="hover:text-gray-900 hover:underline transition-all">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-gray-900 hover:underline transition-all">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-gray-900 hover:underline transition-all">Refund Policy</Link>
              </li>
              <li>
                <Link href="/shipping-info" className="hover:text-gray-900 hover:underline transition-all">Shipping Info</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 hover:underline transition-all">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info — Dynamic from Supabase */}
          <div>
            <h3 className="font-serif text-lg text-gray-900 mb-6 uppercase tracking-widest">Get in Touch</h3>
            <div className="space-y-4 font-sans text-sm text-gray-600">
              {settings.contact_phone && (
                <a href={`tel:${settings.contact_phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-gray-900 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>{settings.contact_phone}</span>
                </a>
              )}
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`} className="block hover:text-gray-900 transition-colors">
                  {settings.contact_email}
                </a>
              )}
              {settings.contact_address && (
                <p className="text-gray-500">{settings.contact_address}</p>
              )}
              <div className="flex gap-4 pt-2">
                {settings.facebook_url ? (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full border-2 border-[#1877F2]/30 text-[#1877F2] flex items-center justify-center hover:scale-110 hover:border-[#1877F2] hover:shadow-lg hover:shadow-[#1877F2]/25 transition-all duration-300"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                ) : (
                  <span className="w-11 h-11 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 opacity-30">
                    <FacebookIcon className="w-5 h-5" />
                  </span>
                )}
                {settings.instagram_url ? (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full border-2 border-[#E4405F]/30 text-[#E4405F] flex items-center justify-center hover:scale-110 hover:border-[#E4405F] hover:shadow-lg hover:shadow-[#E4405F]/25 transition-all duration-300"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                ) : (
                  <span className="w-11 h-11 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 opacity-30">
                    <InstagramIcon className="w-5 h-5" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-sans text-xs text-gray-500">
            © 2026 Nayoori. All rights reserved.
          </p>
          <p className="font-sans text-xs text-gray-500">
            Architected by{" "}
            <a 
              href="https://mdomarfaruque.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gray-400 transition-colors font-medium"
            >
              Omar The Bhaijan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
