export const metadata = {
  title: "Refund Policy | Nayoori",
  description:
    "Learn about Nayoori's return and refund policy for all purchases.",
};

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 py-16 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="font-sans text-sm tracking-widest text-gray-500 uppercase mb-4">
            Policies
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-4">
            Refund Policy
          </h1>
          <div className="w-24 h-[1px] bg-gray-300 mx-auto mt-6" />
        </div>

        {/* Content */}
        <div className="prose-nayoori space-y-10">
          <section>
            <h2 className="font-serif text-2xl text-gray-900 mb-4">
              Our Commitment
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              At Nayoori, we take great pride in the quality and craftsmanship of
              every piece we offer. We want you to be completely satisfied with
              your purchase. If for any reason you are not happy with your order,
              please review our refund and return guidelines below.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-gray-900 mb-4">
              Return Eligibility
            </h2>
            <ul className="space-y-3 font-sans text-sm text-gray-600 leading-relaxed">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                Items must be returned within <strong>7 days</strong> of delivery.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                Products must be unworn, unwashed, and in their original
                condition with all tags attached.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                Sale items and customized orders are{" "}
                <strong>non-refundable</strong>.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                Items damaged due to customer handling are not eligible for
                return.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-gray-900 mb-4">
              How to Initiate a Return
            </h2>
            <ol className="space-y-3 font-sans text-sm text-gray-600 leading-relaxed list-decimal pl-5">
              <li>
                Contact our support team via WhatsApp or email with your order ID
                and reason for return.
              </li>
              <li>
                Our team will review your request and, if approved, provide a
                return shipping address.
              </li>
              <li>
                Ship the product back in its original packaging. Return shipping
                costs are borne by the customer unless the item was defective.
              </li>
              <li>
                Once we receive and inspect the item, your refund will be
                processed within <strong>5–7 business days</strong>.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-gray-900 mb-4">
              Exchange Policy
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              We offer a one-time exchange for a different size or color within 7
              days of delivery. The exchange is subject to product availability.
              Please reach out to us via WhatsApp to arrange the exchange.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-gray-900 mb-4">
              Damaged or Defective Items
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              If you receive a damaged or defective item, please contact us
              within <strong>48 hours</strong> of delivery with photos of the
              damage. We will arrange a free replacement or full refund at no
              additional cost.
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
