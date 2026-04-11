import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  const sections = [
    {
      title: "Agreement to Terms",
      content: "By accessing and using the Nayoori website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations in Bangladesh. These terms govern your use of our site and the purchase of our artisanal clothing collection."
    },
    {
      title: "Ordering & Pricing",
      content: "All orders are subject to availability and confirmation of the order price. While we try and ensure that all details, descriptions and prices which appear on this Website are accurate, errors may occur. Prices are inclusive of VAT where applicable. Shipping costs will be charged in addition and clearly displayed during the checkout process."
    },
    {
      title: "Delivery Timelines",
      content: "Our standard delivery timeline within Bangladesh is 2-3 business days for orders inside Dhaka and 5-7 business days for orders outside Dhaka. Please note that these timelines are estimates and artisanal products may occasionally require additional time for quality assurance."
    },
    {
      title: "Return & Refund Policy",
      content: "We accept returns for items that are defective or incorrect upon delivery. Issues must be reported within 24 hours of receiving the shipment. Items must be returned in their original packaging and condition. Refunds, once approved, will be processed via the original payment method within 7-10 business days."
    },
    {
      title: "Product Accuracy",
      content: "Nayoori products are often handcrafted or involve artisanal techniques. As a result, subtle variations in colors, textures, and finishes are a signature of the collection's uniqueness and do not constitute a defect."
    },
    {
      title: "Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any disputes relating to these terms and conditions shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col pt-24">
      <main className="flex-grow container mx-auto px-6 py-16 max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-6 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="font-sans text-gray-500 uppercase tracking-widest text-xs">
            Effective Date: April 2026
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className="font-serif text-2xl text-gray-900 border-b border-warm-beige pb-2">
                {section.title}
              </h2>
              <p className="font-sans text-gray-600 leading-relaxed text-sm md:text-base">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-20 p-8 bg-warm-beige/10 rounded-2xl border border-warm-beige/30">
          <p className="font-sans text-sm text-gray-500 text-center italic">
            By placing an order, you acknowledge that you have read and agreed to these terms.
          </p>
        </div>
      </main>
    </div>
  );
}
