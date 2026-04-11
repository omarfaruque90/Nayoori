import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import WhatsAppButton from "@/components/WhatsAppButton";
import FaviconInjector from "@/components/FaviconInjector";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { fetchSiteSettings } from "@/lib/supabase/settings";

export const revalidate = 0; // Force dynamic updates for metadata

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  const iconUrl = settings.favicon_url || "/favicon.ico";
  
  return {
    title: "Nayoori | Elegant Women's Clothing",
    description: "Experience the Antigravity Collection by Nayoori",
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings for explicit head tags
  const settings = await fetchSiteSettings();
  console.log("CURRENT_FAVICON:", settings?.favicon_url);

  const faviconUrl = settings.favicon_url || "/favicon.ico";
  const cacheBuster = `?v=${Date.now()}`; // Force bypass all caches

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link id="dynamic-favicon" rel="icon" href={`${faviconUrl}${cacheBuster}`} />
        <link rel="shortcut icon" href={`${faviconUrl}${cacheBuster}`} />
      </head>
      <body className="font-sans min-h-full flex flex-col bg-[#fdfbf7] custom-cursor-enabled" suppressHydrationWarning>
        <FaviconInjector />
        <CustomCursor />
        <CartProvider>
          <Header />
          <div className="flex-grow flex flex-col" suppressHydrationWarning>
            {children}
          </div>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}


