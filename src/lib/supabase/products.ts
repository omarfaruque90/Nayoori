import { supabase } from "./client";

// ─── Product Type (matches Supabase schema) ────────────
export interface Product {
  id: string;
  title: string;
  price: number;
  category: "saree" | "kurti" | "western";
  color: string;
  description: string;
  sizes: string[];
  colors: string[];
  main_image_url: string;
  hover_image_url: string;
  stock_status: "In Stock" | "Out of Stock";
  created_at: string;
}

// ─── Mapped product for frontend components ────────────
export interface MappedProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  color: string;
  description: string;
  sizes: string[];
  colors: string[];
  mainImageUrl: string;
  hoverImageUrl: string;
  stockStatus: string;
}

// ─── Map Supabase row → frontend shape ─────────────────
export function mapProduct(p: Product): MappedProduct {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    category: p.category,
    color: p.color,
    description: p.description,
    sizes: p.sizes || [],
    colors: p.colors || [],
    mainImageUrl: p.main_image_url,
    hoverImageUrl: p.hover_image_url,
    stockStatus: p.stock_status,
  };
}

// ─── Fetch products (optionally by category/limit) ───
export async function fetchProducts(category?: string, limit?: number) {
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Product[]).map(mapProduct);
}

// ─── Fetch single product by ID ────────────────────────
export async function fetchProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapProduct(data as Product);
}
