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

const p = (
  slug: string,
  name: string,
  subtitle: string,
  brand: string,
  category: string,
  img: string,
  price: number,
  mrp: number | undefined,
  rating: number,
  reviews: number,
  stock: Product["stock"],
  badge: Product["badge"],
  popularity: number
): Product => ({
  slug,
  name,
  subtitle,
  brand,
  category,
  img,
  price,
  mrp,
  rating,
  reviews,
  stock,
  badge,
  popularity,
  description: `The ${name} from ${brand} delivers dependable everyday performance with a premium build. Sourced directly from the brand, it ships with a full manufacturer warranty and is covered by our 7-day easy return policy.`,
  highlights: [
    "100% original, brand-sourced product",
    "1 year manufacturer warranty",
    "7 days easy returns",
    "Free delivery on orders above ₹1,499",
  ],
  specs: [
    { label: "Brand", value: brand },
    { label: "Category", value: categoryName(category) },
    { label: "Model", value: name },
    { label: "Warranty", value: "1 Year" },
    { label: "In the box", value: `${name}, user manual, warranty card` },
  ],
});

export const products: Product[] = [
  p("sony-wh-1000xm5", "Sony WH-1000XM5", "Wireless Noise Cancelling Headphones", "Sony", "headphones-earbuds", "/store/p-headphones.jpg", 29990, 34990, 4.5, 980, "In stock", "Bestseller", 98),
  p("boat-rockerz-450", "boAt Rockerz 450", "Wireless Headphones", "boAt", "headphones-earbuds", "/store/p-headphones.jpg", 1599, 1799, 4.4, 1200, "In stock", undefined, 92),
  p("apple-airpods-pro-2", "Apple AirPods Pro (2nd Gen)", "True Wireless Earbuds", "Apple", "headphones-earbuds", "/store/p-earbuds.jpg", 24900, undefined, 4.6, 2100, "In stock", "Bestseller", 99),
  p("sony-wh-ch720n", "Sony WH-CH720N", "Wireless Headphones", "Sony", "headphones-earbuds", "/store/p-headphones.jpg", 7990, undefined, 4.3, 860, "In stock", "New", 78),
  p("jbl-tune-770nc", "JBL Tune 770NC", "Noise Cancelling Headphones", "JBL", "headphones-earbuds", "/store/p-headphones.jpg", 5999, 6999, 4.4, 760, "In stock", undefined, 81),
  p("boat-airdopes-131-pro", "boAt Airdopes 131 Pro", "True Wireless Earbuds", "boAt", "headphones-earbuds", "/store/p-earbuds.jpg", 999, 1499, 4.2, 1500, "In stock", "Bestseller", 88),
  p("sennheiser-hd-450bt", "Sennheiser HD 450BT", "Wireless Headphones", "Sennheiser", "headphones-earbuds", "/store/p-headphones.jpg", 8799, 9999, 4.6, 540, "In stock", undefined, 74),
  p("noise-flair-n1", "Noise Flair N1", "Wireless Neckband", "Noise", "headphones-earbuds", "/store/p-earbuds.jpg", 1199, undefined, 4.1, 620, "Low stock", "New", 66),

  p("macbook-air-m2", "MacBook Air M2 (13-inch)", "8GB RAM · 256GB SSD", "Apple", "laptops", "/store/p-laptop.jpg", 89900, 99900, 4.7, 1200, "In stock", "Bestseller", 97),
  p("dell-15-laptop", "Dell 15 Laptop", "Intel Core i5 · 512GB SSD", "Dell", "laptops", "/store/p-laptop.jpg", 45990, 52990, 4.5, 640, "In stock", undefined, 84),
  p("hp-pavilion-14", "HP Pavilion 14", "Ryzen 5 · 16GB RAM", "HP", "laptops", "/store/p-laptop.jpg", 58990, undefined, 4.3, 420, "Low stock", undefined, 71),
  p("lenovo-ideapad-slim-3", "Lenovo IdeaPad Slim 3", "Intel Core i3 · 8GB RAM", "Lenovo", "laptops", "/store/p-laptop.jpg", 34990, 39990, 4.2, 910, "In stock", undefined, 76),

  p("iphone-15", "iPhone 15 (128GB)", "6.1-inch Super Retina XDR", "Apple", "mobile", "/store/p-phone.jpg", 69900, undefined, 4.7, 3200, "Low stock", "Bestseller", 99),
  p("samsung-galaxy-s24", "Samsung Galaxy S24", "8GB RAM · 256GB", "Samsung", "mobile", "/store/p-phone.jpg", 59999, 74999, 4.6, 1800, "In stock", undefined, 95),
  p("oneplus-12r", "OnePlus 12R", "12GB RAM · 256GB", "OnePlus", "mobile", "/store/p-phone.jpg", 39999, 45999, 4.5, 1100, "In stock", "New", 89),
  p("google-pixel-8a", "Google Pixel 8a", "8GB RAM · 128GB", "Google", "mobile", "/store/p-phone.jpg", 44999, undefined, 4.4, 520, "In stock", undefined, 80),

  p("boat-wave-prime-47", "boAt Wave Prime 47", "1.69-inch HD Smartwatch", "boAt", "wearables", "/store/p-watch.jpg", 2199, 2599, 4.4, 3100, "In stock", undefined, 86),
  p("noise-colorfit-pro-5", "Noise ColorFit Pro 5", "AMOLED Smartwatch", "Noise", "wearables", "/store/p-watch.jpg", 3499, 4499, 4.3, 2400, "In stock", "Bestseller", 87),
  p("apple-watch-se", "Apple Watch SE (2nd Gen)", "40mm GPS", "Apple", "wearables", "/store/p-watch.jpg", 24900, undefined, 4.7, 780, "In stock", undefined, 90),
  p("fire-boltt-ninja-call", "Fire-Boltt Ninja Call Pro", "Bluetooth Calling Smartwatch", "Fire-Boltt", "wearables", "/store/p-watch.jpg", 1799, 2299, 4.0, 1900, "Low stock", undefined, 62),

  p("jbl-flip-6", "JBL Flip 6", "Portable Bluetooth Speaker", "JBL", "speakers", "/store/p-speaker.jpg", 9999, 11999, 4.6, 870, "In stock", "Bestseller", 91),
  p("boat-stone-352", "boAt Stone 352", "Bluetooth Speaker 10W", "boAt", "speakers", "/store/p-speaker.jpg", 1499, 2490, 4.3, 2600, "In stock", undefined, 79),
  p("sony-srs-xb100", "Sony SRS-XB100", "Compact Wireless Speaker", "Sony", "speakers", "/store/p-speaker.jpg", 3490, undefined, 4.5, 430, "In stock", "New", 73),
  p("marshall-emberton-ii", "Marshall Emberton II", "Portable Speaker", "Marshall", "speakers", "/store/p-speaker.jpg", 14999, 16999, 4.7, 310, "Low stock", undefined, 70),

  p("anker-65w-charger", "Anker 65W GaN Charger", "3-Port Fast Charger", "Anker", "accessories", "/store/p-earbuds.jpg", 3299, 3999, 4.6, 540, "In stock", undefined, 68),
  p("apple-20w-adapter", "Apple 20W USB-C Adapter", "Fast Charging Adapter", "Apple", "accessories", "/store/p-earbuds.jpg", 1900, undefined, 4.5, 1400, "In stock", undefined, 72),
  p("boat-type-c-cable", "boAt Type-C Braided Cable", "1.5m · 3A Fast Charging", "boAt", "accessories", "/store/p-earbuds.jpg", 349, 699, 4.2, 5200, "In stock", "Bestseller", 65),
  p("spigen-phone-case", "Spigen Rugged Armor Case", "Shock Absorbing Case", "Spigen", "accessories", "/store/p-earbuds.jpg", 1299, 1799, 4.4, 890, "In stock", undefined, 60),
];

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

export const brands = Array.from(new Set(products.map((x) => x.brand))).sort();

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

export function filterProducts(f: CatalogFilters, source: Product[] = products) {
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

export const getProduct = (slug: string) => products.find((x) => x.slug === slug);

export const relatedProducts = (product: Product) =>
  products.filter((x) => x.category === product.category && x.slug !== product.slug).slice(0, 4);

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
