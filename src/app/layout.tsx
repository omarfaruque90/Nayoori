import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nayoori | Elegant Women's Clothing",
  description: "Experience the Antigravity Collection by Nayoori",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-[#fdfbf7] custom-cursor-enabled">
        <CustomCursor />
        <CartProvider>
          <Header />
          <div className="flex-grow flex flex-col">
            {children}
          </div>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}


