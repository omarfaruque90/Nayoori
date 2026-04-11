import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchProductById, type MappedProduct } from "@/lib/supabase/products";
import ProductDetailView from "@/components/ProductDetailView";
import ReviewSection from "@/components/ReviewSection";

export const dynamic = "force-dynamic"; // Always fetch fresh data from Supabase

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch the product from Supabase
  let product: MappedProduct | null;
  try {
    product = await fetchProductById(id);
  } catch {
    // Product not found or Supabase error
    product = null;
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-6 py-16 text-center">
          <h2 className="font-serif text-5xl text-gray-900 mb-6">Product Not Found</h2>
          <p className="font-sans text-gray-600 mb-10 max-w-md mx-auto">
            The floating elegance you are looking for seems to have drifted away. 
            Please check the URL or explore our collections.
          </p>
          <Link href="/">
            <button className="px-8 py-4 bg-gray-900 text-white font-sans uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
              Go Back to Shop
            </button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 py-12">
        <Link href={`/${product.category}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-sans text-sm tracking-widest uppercase mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to {product.category}
        </Link>
        
        {/* Render the interactive detail view */}
        <ProductDetailView product={product} />

        {/* Customer Reviews */}
        <ReviewSection productId={product.id} />
      </main>
    </div>
  );
}
