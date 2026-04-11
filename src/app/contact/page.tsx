"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/supabase/settings";

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .single();
        
      if (!error && data) {
        console.log("Contact Page Data Loaded Successfully:", data);
        setSettings(data as SiteSettings);
      }
    }
    loadSettings();
  }, []);

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number || "8801700000000"}?text=${encodeURIComponent("Hello Nayoori! I have a question.")}`;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 py-16 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm tracking-widest text-gray-500 uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-4">
            Contact Us
          </h1>
          <div className="w-24 h-[1px] bg-gray-300 mx-auto mt-6" />
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <div className="bg-white border border-warm-beige rounded-2xl p-8 space-y-3">
            <div className="w-12 h-12 bg-warm-beige/20 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-serif text-lg text-gray-900">Call Us</h3>
            <p className="font-sans text-sm text-gray-500">
              Available during business hours for order inquiries and styling
              assistance.
            </p>
            <a
              href={`tel:${(settings.contact_phone || "").replace(/\s/g, "")}`}
              className="font-sans text-sm font-medium text-gray-900 hover:underline"
            >
              {settings.contact_phone || "Phone not available"}
            </a>
          </div>

          <div className="bg-white border border-warm-beige rounded-2xl p-8 space-y-3">
            <div className="w-12 h-12 bg-warm-beige/20 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-serif text-lg text-gray-900">Email</h3>
            <p className="font-sans text-sm text-gray-500">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <a
              href={`mailto:${settings.contact_email}`}
              className="font-sans text-sm font-medium text-gray-900 hover:underline"
            >
              {settings.contact_email}
            </a>
          </div>

          <div className="bg-white border border-warm-beige rounded-2xl p-8 space-y-3">
            <div className="w-12 h-12 bg-warm-beige/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-serif text-lg text-gray-900">Visit Us</h3>
            <p className="font-sans text-sm text-gray-500">
              Our studio is open for appointments. Walk-ins are also welcome
              during business hours.
            </p>
            <p className="font-sans text-sm font-medium text-gray-900">
              {settings.contact_address}
            </p>
          </div>

          <div className="bg-white border border-warm-beige rounded-2xl p-8 space-y-3">
            <div className="w-12 h-12 bg-warm-beige/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-serif text-lg text-gray-900">Business Hours</h3>
            <p className="font-sans text-sm text-gray-500">
              We're here to help during these hours. WhatsApp inquiries are
              welcome anytime.
            </p>
            <div className="font-sans text-sm text-gray-900 space-y-1">
              <p>Saturday – Thursday: 10 AM – 8 PM</p>
              <p>Friday: Closed</p>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="text-center bg-warm-beige/15 border border-warm-beige/40 rounded-2xl p-10">
          <h2 className="font-serif text-2xl text-gray-900 mb-3">
            Prefer WhatsApp?
          </h2>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto mb-6">
            Tap the green WhatsApp button on the bottom-right corner of any page
            to start a conversation with us instantly.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-[#25D366] text-white font-sans uppercase tracking-widest text-xs hover:bg-[#20bd5a] transition-colors rounded-lg"
          >
            Open WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
