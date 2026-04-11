"use client";

import { useEffect } from "react";
import { fetchSiteSettings } from "@/lib/supabase/settings";

export default function FaviconInjector() {
  useEffect(() => {
    async function updateFavicon() {
      try {
        const settings = await fetchSiteSettings();
        const url = settings.favicon_url;

        // Diagnostic log in browser console
        console.log("--- BROWSER FAVICON DIAGNOSTIC ---");
        console.log("DB favicon_url:", url);
        console.log("---------------------------------");

        if (!url) return;

        // Force update the link tags
        const cacheBuster = `?t=${Date.now()}`;
        const finalUrl = `${url}${cacheBuster}`;

        // Find or create the icon link
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = finalUrl;

        // Also update shortcut icon
        let shortcutLink: HTMLLinkElement | null = document.querySelector("link[rel='shortcut icon']");
        if (!shortcutLink) {
          shortcutLink = document.createElement('link');
          shortcutLink.rel = 'shortcut icon';
          document.getElementsByTagName('head')[0].appendChild(shortcutLink);
        }
        shortcutLink.href = finalUrl;
        
      } catch (err) {
        console.error("Favicon Injector Error:", err);
      }
    }

    updateFavicon();
  }, []);

  return null; // This component doesn't render anything UI-wise
}
