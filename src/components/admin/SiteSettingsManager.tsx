"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import {
  type SiteSettings,
  DEFAULT_SETTINGS,
} from "@/lib/supabase/settings";
import {
  Save,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Globe,
  CheckCircle2,
  RefreshCw,
  Upload,
  Zap,
} from "lucide-react";
import { uploadImage } from "@/lib/supabase/storage";

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Connection testing
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "ok" | "error">("checking");
  const [connectionError, setConnectionError] = useState<string>("");

  // ─── Test Connection ────────────────────────────────
  const testConnection = useCallback(async () => {
    setConnectionStatus("checking");
    setConnectionError("");

    try {
      // Ping the table (using limit 1 to make it fast)
      const { error } = await supabase.from("site_settings").select("id").limit(1);
      if (error) throw error;
      setConnectionStatus("ok");
    } catch (err: any) {
      setConnectionStatus("error");
      setConnectionError(err.message || "Network Error: Failed to fetch (Check URL/Anon Key)");
    }
  }, []);

  // ─── Fetch settings ─────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    testConnection(); // Test connection whenever we fetch
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .single();
      if (error) throw error;
      if (data) setSettings(data as SiteSettings);
    } catch (err: any) {
      console.error("Failed to fetch site settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [testConnection]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ─── Save settings ──────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({
          id: "default", // Explicitly set ID for upsert
          contact_phone: settings.contact_phone,
          contact_email: settings.contact_email,
          contact_address: settings.contact_address,
          whatsapp_number: settings.whatsapp_number,
          facebook_url: settings.facebook_url,
          instagram_url: settings.instagram_url,
          logo_url: settings.logo_url,
          favicon_url: settings.favicon_url,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to save settings detail:", err);
      alert(`Failed to save settings: ${err?.message || "Unknown Error"}. Check console for details.`);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Field helper ───────────────────────────────────
  // ─── Branding upload ───────────────────────────────
  const handleBrandUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo_url" | "favicon_url") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [field]: true }));
    try {
      const url = await uploadImage(file, "brand");
      setSettings(prev => ({ ...prev, [field]: url }));
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass =
    "w-full p-3.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans text-sm";

  const labelClass =
    "block font-sans text-[11px] tracking-widest uppercase text-gray-500 mb-2";

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        <p className="font-sans text-sm text-gray-500 mt-4">
          Loading settings…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      {/* ── Connection Status Banner ──────────────────── */}
      {connectionStatus !== "ok" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
            connectionStatus === "checking"
              ? "bg-blue-50 border-blue-200 text-blue-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {connectionStatus === "checking" ? (
            <RefreshCw className="w-5 h-5 animate-spin flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            </div>
          )}
          <div>
            <h3 className="font-sans font-medium text-sm">
              {connectionStatus === "checking"
                ? "Testing Supabase Connection..."
                : "Supabase Connection Error"}
            </h3>
            <p className="font-sans text-xs mt-1 opacity-80 break-words mb-2">
              {connectionStatus === "error" && connectionError}
            </p>
            {connectionStatus === "error" && (
              <button
                type="button"
                onClick={testConnection}
                className="text-xs font-medium underline hover:text-red-900"
              >
                Retry Connection
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Contact Information ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-warm-beige rounded-2xl overflow-hidden mb-6"
      >
        <div className="p-6 border-b border-warm-beige flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-warm-beige/20 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-gray-900">
                Contact Information
              </h2>
              <p className="font-sans text-xs text-gray-500">
                Displayed in the footer and contact page
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchSettings}
            className="p-2 hover:bg-warm-beige/30 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>
                <Phone className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                Phone Number
              </label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => updateField("contact_phone", e.target.value)}
                placeholder="+880 1700-000000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                <Mail className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                Email Address
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => updateField("contact_email", e.target.value)}
                placeholder="hello@nayoori.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              <MapPin className="w-3 h-3 inline mr-1.5 -mt-0.5" />
              Business Address
            </label>
            <input
              type="text"
              value={settings.contact_address}
              onChange={(e) => updateField("contact_address", e.target.value)}
              placeholder="Dhaka, Bangladesh"
              className={inputClass}
            />
          </div>
        </div>
      </motion.div>

      {/* ── WhatsApp & Social Links ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white border border-warm-beige rounded-2xl overflow-hidden mb-6"
      >
        <div className="p-6 border-b border-warm-beige">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-gray-900">
                WhatsApp & Social Media
              </h2>
              <p className="font-sans text-xs text-gray-500">
                Used for the floating chat button and footer links
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className={labelClass}>
              WhatsApp Number{" "}
              <span className="normal-case tracking-normal text-gray-400">
                (without + sign, e.g. 8801XXXXXXXXX)
              </span>
            </label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => updateField("whatsapp_number", e.target.value)}
              placeholder="8801700000000"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>
                <Globe className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={(e) => updateField("facebook_url", e.target.value)}
                placeholder="https://facebook.com/nayoori"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                <Globe className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => updateField("instagram_url", e.target.value)}
                placeholder="https://instagram.com/nayoori"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Branding & Visuals ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white border border-warm-beige rounded-2xl overflow-hidden mb-6"
      >
        <div className="p-6 border-b border-warm-beige">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-gray-900">
                Branding & Visual Identity
              </h2>
              <p className="font-sans text-xs text-gray-500">
                Upload your custom identity assets
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo Upload */}
          <div className="space-y-4">
            <label className={labelClass}>Main Brand Logo</label>
            <div className="relative group">
              {settings.logo_url ? (
                <div className="relative p-6 bg-gray-50 rounded-xl border border-warm-beige flex items-center justify-center min-h-[160px]">
                  <img src={settings.logo_url} className="max-h-12 w-auto object-contain" alt="Logo Preview" />
                  <button 
                    type="button"
                    onClick={() => setSettings(p => ({ ...p, logo_url: null }))}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-sans text-[10px] uppercase tracking-widest rounded-xl"
                  >
                    Replace Logo
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center min-h-[160px] bg-gray-50 border-2 border-dashed border-warm-beige rounded-xl cursor-pointer hover:bg-white hover:border-gray-900 transition-all p-6 text-center">
                  {isUploading.logo_url ? (
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="font-sans text-xs font-medium text-gray-900 uppercase tracking-widest">Logo (PNG/SVG)</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBrandUpload(e, "logo_url")} />
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          {/* Favicon Upload */}
          <div className="space-y-4">
            <label className={labelClass}>Site Favicon</label>
            <div className="relative group">
              {settings.favicon_url ? (
                <div className="relative p-6 bg-gray-50 rounded-xl border border-warm-beige flex items-center justify-center min-h-[160px]">
                  <img src={settings.favicon_url} className="w-12 h-12 object-contain" alt="Favicon Preview" />
                  <button 
                    type="button"
                    onClick={() => setSettings(p => ({ ...p, favicon_url: null }))}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-sans text-[10px] uppercase tracking-widest rounded-xl"
                  >
                    Replace Favicon
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center min-h-[160px] bg-gray-50 border-2 border-dashed border-warm-beige rounded-xl cursor-pointer hover:bg-white hover:border-gray-900 transition-all p-6 text-center">
                  {isUploading.favicon_url ? (
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="font-sans text-xs font-medium text-gray-900 uppercase tracking-widest">Favicon (Square)</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBrandUpload(e, "favicon_url")} />
                    </>
                  )}
                </label>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Save Button ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-emerald-600 font-sans text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Settings saved successfully
          </motion.div>
        )}
        {!saveSuccess && <div />}

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-gray-900 text-white font-sans text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-lg disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </motion.div>

      {/* Last updated note */}
      {settings.updated_at && (
        <p className="font-sans text-xs text-gray-400 text-right mt-4">
          Last updated:{" "}
          {new Date(settings.updated_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}
    </form>
  );
}
