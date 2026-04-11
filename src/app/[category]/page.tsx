import { notFound } from "next/navigation";
import CategoryView from "@/components/CategoryView";
import { fetchProducts, type MappedProduct } from "@/lib/supabase/products";

export const dynamic = "force-dynamic"; // Always fetch fresh data from Supabase

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  
  // Valid categories
  const validCategories = ["saree", "kurti", "western"];
  if (!validCategories.includes(category.toLowerCase())) {
    notFound();
  }

  // Fetch products from Supabase filtered by category
  let products: MappedProduct[];
  try {
    products = await fetchProducts(category.toLowerCase());
  } catch (err) {
    console.error("Failed to fetch products:", err);
    products = [];
  }

  // Dynamic Backgrounds for Brand Flow
  const categoryBackgrounds: Record<string, string> = {
    saree: "bg-[#fdfbf7]", // Warm beige off-white
    kurti: "bg-[#fdf5f2]", // Soft blush
    western: "bg-[#ffffff]", // Crisp white
  };

  const currentBg = categoryBackgrounds[category.toLowerCase()] || "bg-[#fdfbf7]";

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-1000 ${currentBg}`}>
      <main className="flex-grow container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <p className="font-sans text-sm tracking-widest text-gray-500 uppercase mb-4">Collection</p>
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 capitalize">
            {category}
          </h1>
          <div className="w-24 h-[1px] bg-gray-300 mx-auto mt-8"></div>
        </div>

        {/* Dynamic Client-Side Filtering View connected to the filtered products server payload */}
        <CategoryView products={products} />
      </main>
    </div>
  );
}
