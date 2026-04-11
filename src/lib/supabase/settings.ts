import { supabase } from "./client";
import { unstable_noStore as noStore } from "next/cache";

// ─── Site Settings Type ───────────────────────────────
export interface SiteSettings {
  id: string; // Changed to string to accept "default"
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  logo_url: string | null;
  favicon_url: string | null;
  updated_at: string;
}

// ─── Default fallback values ──────────────────────────
export const DEFAULT_SETTINGS: SiteSettings = {
  id: "default",
  contact_phone: "+880 1700-000000",
  contact_email: "hello@nayoori.com",
  contact_address: "Dhaka, Bangladesh",
  whatsapp_number: "8801700000000",
  facebook_url: "",
  instagram_url: "",
  logo_url: null,
  favicon_url: null,
  updated_at: new Date().toISOString(),
};

// ─── Fetch settings (single row) ───────────────
export async function fetchSiteSettings(): Promise<SiteSettings> {
  noStore(); // Prevents Next.js from aggressively caching the layout footer across page reloads
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (error) throw error;
    return data as SiteSettings;
  } catch {
    // Fallback to defaults if table doesn't exist yet or is empty
    return DEFAULT_SETTINGS;
  }
}

// ─── Update settings ─────────────────────────────────
export async function updateSiteSettings(
  settings: Partial<Omit<SiteSettings, "id" | "updated_at">>
) {
  const { error } = await supabase
    .from("site_settings")
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) throw error;
}
