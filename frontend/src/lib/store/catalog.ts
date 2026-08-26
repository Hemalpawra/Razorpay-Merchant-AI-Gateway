export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  brand: string;
  category: string;
  img: string;
  price: number;
  mrp?: number | undefined;
  rating: number;
  reviews: number;
  stock: "In stock" | "Low stock";
  badge?: "Bestseller" | "New" | undefined;
  popularity: number;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
};

export const categories = [
  { slug: "headphones-earbuds", name: "Headphones & Earbuds", img: "/store/p-headphones.jpg" },
  { slug: "laptops", name: "Laptops", img: "/store/p-laptop.jpg" },
  { slug: "mobile", name: "Mobile", img: "/store/p-phone.jpg" },
  { slug: "wearables", name: "Wearables", img: "/store/p-watch.jpg" },
  { slug: "speakers", name: "Speakers", img: "/store/p-speaker.jpg" },
  { slug: "accessories", name: "Accessories", img: "/store/p-earbuds.jpg" },
];

export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? "All Products";

export function mapDbProduct(row: {
  id?: string;
  sku?: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price: number | string;
  stock_qty?: number | null;
  image_url?: string | null;
  status?: string | null;
  meta_json?: { brand?: string; subtitle?: string; rating?: number; reviews?: number; mrp?: number } | null;
}): Product {
  const meta = row.meta_json ?? {};
  const category = row.category ?? "accessories";
  const brand = meta.brand ?? row.name.split(" ")[0] ?? "General";
  const stock: Product["stock"] = Number(row.stock_qty ?? 0) > 10 ? "In stock" : "Low stock";
  return {
    slug: row.sku ?? row.id ?? row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name: row.name,
    subtitle: meta.subtitle ?? row.description?.split(".")[0] ?? "Premium electronics",
    brand,
    category,
    img: row.image_url ?? "/store/p-headphones.jpg",
    price: Number(row.price),
    mrp: meta.mrp,
    rating: meta.rating ?? 4.5,
    reviews: meta.reviews ?? 0,
    stock,
    badge: undefined,
    popularity: 0,
    description: row.description ?? "",
    highlights: ["100% original product", "Manufacturer warranty", "7 days easy returns"],
    specs: [
      { label: "Brand", value: brand },
      { label: "Category", value: categoryName(category) },
      { label: "SKU", value: row.sku ?? "—" },
    ],
  };
}

export const getBrands = (source: Product[]) => Array.from(new Set(source.map((x) => x.brand))).sort();

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const discountPct = (product: Product) =>
  product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

export type CatalogFilters = {
  q: string;
  category: string;
  brands: string[];
  maxPrice: number;
  inStock: boolean;
  onSale: boolean;
  minRating: number;
  sort: string;
};

export function filterProducts(f: CatalogFilters, source: Product[]) {
  const q = f.q.trim().toLowerCase();
  let list = source.filter((prod) => {
    if (f.category && prod.category !== f.category) return false;
    if (f.brands.length && !f.brands.includes(prod.brand)) return false;
    if (prod.price > f.maxPrice) return false;
    if (f.inStock && prod.stock !== "In stock") return false;
    if (f.onSale && !prod.mrp) return false;
    if (prod.rating < f.minRating) return false;
    if (
      q &&
      !`${prod.name} ${prod.brand} ${prod.subtitle} ${categoryName(prod.category)}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (f.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0) || b.popularity - a.popularity;
      default:
        return b.popularity - a.popularity;
    }
  });

  return list;
}

export const getProduct = (slug: string, source: Product[]) => source.find((x) => x.slug === slug);

export const relatedProducts = (product: Product, source: Product[]) =>
  source.filter((x) => x.category === product.category && x.slug !== product.slug).slice(0, 4);

export type ProductSearch = {
  q?: string | undefined;
  category?: string | undefined;
  brands?: string[] | undefined;
  maxPrice?: number | undefined;
  inStock?: boolean | undefined;
  onSale?: boolean | undefined;
  minRating?: number | undefined;
  sort?: string | undefined;
  view?: string | undefined;
  page?: number | undefined;
};
