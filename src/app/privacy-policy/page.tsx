import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Introduction",
      content: "At Nayoori, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you."
    },
    {
      title: "Data We Collect",
      content: "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data (name, username), Contact Data (billing address, delivery address, email address, and telephone numbers), and Transaction Data (details about payments to and from you and other details of products you have purchased from us)."
    },
    {
      title: "How We Use Your Data",
      content: "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to perform the contract we are about to enter into or have entered into with you (e.g., delivering your order), or where it is necessary for our legitimate interests."
    },
    {
      title: "Payment Security",
      content: "All payments made on Nayoori are processed through secure, encrypted gateways (such as SSLCommerz, bKash, or Nagad). We do not store your credit card or sensitive financial information on our servers. Your transactions are protected by industry-standard 128-bit SSL encryption."
    },
    {
      title: "Data Retention",
      content: "We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements."
    },
    {
      title: "Your Rights",
      content: "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access to your personal data, request correction of your personal data, or request erasure of your personal data."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col pt-24">
      <main className="flex-grow container mx-auto px-6 py-16 max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="font-sans text-gray-500 uppercase tracking-widest text-xs">
            Last Updated: April 2026
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
            Questions about our Privacy Policy? Contact us at hello@nayoori.com
          </p>
        </div>
      </main>
    </div>
  );
}
