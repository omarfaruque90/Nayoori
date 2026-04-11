import Link from "next/link";
import { Phone } from "lucide-react";

export default function Footer() {
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

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="font-serif text-lg text-gray-900 mb-6 uppercase tracking-widest">Customer Care</h3>
            <ul className="space-y-4 font-sans text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-gray-900 hover:underline transition-all">Return Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 hover:underline transition-all">Shipping Info</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 hover:underline transition-all">Size Guide</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 hover:underline transition-all">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="font-serif text-lg text-gray-900 mb-6 uppercase tracking-widest">Contact Us</h3>
            <div className="space-y-4 font-sans text-sm text-gray-600">
              <a href="tel:+8801700000000" className="flex items-center gap-3 hover:text-gray-900 transition-colors">
                <Phone className="w-4 h-4" />
                <span>+880 1700-000000</span>
              </a>
              <div className="flex gap-4 pt-2">
                <Link href="#" className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all font-sans font-bold text-xs uppercase tracking-widest">
                  Fb
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all font-sans font-bold text-xs uppercase tracking-widest">
                  Ig
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Elements */}
        <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-sans text-xs text-gray-500">
            © 2026 Nayoori. All rights reserved.
          </p>
          <p className="font-sans text-xs text-gray-500">
            Developed with ❤️ by Omar The Bhaijan.
          </p>
        </div>
      </div>
    </footer>
  );
}

