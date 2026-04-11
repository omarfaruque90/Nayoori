import { Truck, Package, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Shipping Info | Nayoori",
  description:
    "Learn about Nayoori's shipping zones, delivery times, and charges across Bangladesh.",
};

export default function ShippingInfoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 py-16 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm tracking-widest text-gray-500 uppercase mb-4">
            Delivery
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-4">
            Shipping Info
          </h1>
          <div className="w-24 h-[1px] bg-gray-300 mx-auto mt-6" />
        </div>

        {/* Shipping zones table */}
        <div className="bg-white border border-warm-beige rounded-2xl overflow-hidden mb-12">
          <div className="p-6 border-b border-warm-beige">
            <h2 className="font-serif text-xl text-gray-900">
              Delivery Zones & Charges
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-warm-beige/50">
                  <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                    Zone
                  </th>
                  <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                    Delivery Time
                  </th>
                  <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                    Charge
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-warm-beige/30">
                  <td className="px-6 py-5 font-sans text-sm text-gray-900 font-medium">
                    Inside Dhaka
                  </td>
                  <td className="px-6 py-5 font-sans text-sm text-gray-600">
                    1–2 business days
                  </td>
                  <td className="px-6 py-5 font-sans text-sm text-gray-900 font-medium">
                    ৳80
                  </td>
                </tr>
                <tr className="border-b border-warm-beige/30">
                  <td className="px-6 py-5 font-sans text-sm text-gray-900 font-medium">
                    Outside Dhaka
                  </td>
                  <td className="px-6 py-5 font-sans text-sm text-gray-600">
                    3–5 business days
                  </td>
                  <td className="px-6 py-5 font-sans text-sm text-gray-900 font-medium">
                    ৳150
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border border-warm-beige rounded-2xl p-7 space-y-3">
            <div className="w-10 h-10 bg-warm-beige/20 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-serif text-lg text-gray-900">
              Delivery Partner
            </h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed">
              We use trusted courier services to ensure your order arrives
              safely and on time. Currently we ship via Steadfast, Pathao, and
              RedX across Bangladesh.
            </p>
          </div>

          <div className="bg-white border border-warm-beige rounded-2xl p-7 space-y-3">
            <div className="w-10 h-10 bg-warm-beige/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-serif text-lg text-gray-900">Packaging</h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed">
              Every Nayoori order is carefully wrapped in our signature
              eco-friendly packaging. Each piece comes with a branded dust bag
              to preserve its quality.
            </p>
          </div>

          <div className="bg-white border border-warm-beige rounded-2xl p-7 space-y-3">
            <div className="w-10 h-10 bg-warm-beige/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-serif text-lg text-gray-900">
              Order Tracking
            </h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed">
              Once your order is shipped, you will receive a tracking number via
              SMS or WhatsApp. You can use this to track your delivery in
              real-time.
            </p>
          </div>

          <div className="bg-white border border-warm-beige rounded-2xl p-7 space-y-3">
            <div className="w-10 h-10 bg-warm-beige/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-serif text-lg text-gray-900">
              Processing Time
            </h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed">
              Orders are processed within 24 hours on business days. Orders
              placed after 5 PM or on Fridays will be processed on the next
              business day.
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-gray-900 mb-4">
              Cash on Delivery
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              We currently accept <strong>Cash on Delivery (COD)</strong> for
              all orders across Bangladesh. Please ensure someone is available at
              the delivery address to receive the package and complete the
              payment.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-gray-900 mb-4">
              Delivery Issues
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              If your order is delayed beyond the estimated delivery window, or
              if you experience any issues with your shipment, please contact us
              immediately via WhatsApp or email. We will coordinate with our
              courier partner to resolve the issue promptly.
            </p>
          </section>

          {/* Divider */}
          <div className="pt-8 border-t border-warm-beige text-center">
            <p className="font-sans text-xs text-gray-400">
              Last updated: April 2026. For questions, contact us at{" "}
              <a
                href="mailto:hello@nayoori.com"
                className="text-gray-600 hover:underline"
              >
                hello@nayoori.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
