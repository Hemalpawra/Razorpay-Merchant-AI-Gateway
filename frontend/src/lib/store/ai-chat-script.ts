import { products, type Product } from "./catalog";

export type ChatMessage = {
  id: string;
  sender: "self" | "other";
  text?: string;
  products?: Product[];
  compare?: Product[];
  chips?: string[];
};

const pick = (slugs: string[]) =>
  slugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));

const byCategory = (category: string, max = 3, underPrice?: number) =>
  products
    .filter((p) => p.category === category && (underPrice ? p.price <= underPrice : true))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, max);

const budgetFrom = (text: string) => {
  const match = text.replace(/[,₹]/g, "").match(/(\d{4,7})/);
  return match ? Number(match[1]) : undefined;
};

export const samplePrompts = [
  "I need wireless headphones under ₹5,000",
  "Compare these laptops",
  "Show me the best option for travel",
];

export const quickChips = [
  "Compare these",
  "Show cheaper options",
  "Best for office work",
  "Best battery life",
  "Add to cart",
];

export function getAssistantReply(input: string, lastSuggested: Product[]): ChatMessage {
  const q = input.toLowerCase();
  const budget = budgetFrom(q);
  const id = `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  if (q.includes("compare")) {
    const list = lastSuggested.length >= 2 ? lastSuggested.slice(0, 3) : byCategory("laptops", 3);
    return {
      id,
      sender: "other",
      text: "Here's a quick comparison. I've highlighted what each one is best at.",
      compare: list,
      chips: ["Best battery life", "Show cheaper options", "Add to cart"],
    };
  }

  if (q.includes("cart") || q.includes("checkout") || q.includes("buy")) {
    return {
      id,
      sender: "other",
      text: "Added to your cart. You can keep exploring or head straight to checkout — payments are secured by Razorpay.",
      chips: ["Continue to checkout", "Show cheaper options"],
    };
  }

  if (q.includes("cheaper") || q.includes("budget")) {
    const base = lastSuggested.length ? lastSuggested : byCategory("laptops", 3);
    const cheaper = products
      .filter((p) => p.category === base[0]?.category)
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);
    return {
      id,
      sender: "other",
      text: "These are the most affordable picks in this category without giving up on reliability.",
      products: cheaper,
      chips: ["Compare these", "Best for office work"],
    };
  }

  if (q.includes("headphone") || q.includes("earbud") || q.includes("audio")) {
    return {
      id,
      sender: "other",
      text: budget
        ? `Here are the best audio picks under ₹${budget.toLocaleString("en-IN")}.`
        : "Here are three audio picks customers love right now.",
      products: byCategory("headphones-earbuds", 3, budget),
      chips: ["Compare these", "Best battery life"],
    };
  }

  if (q.includes("travel")) {
    return {
      id,
      sender: "other",
      text: "For travel I'd prioritise weight, battery and noise cancellation. These three fit best.",
      products: pick(["sony-wh-1000xm5", "apple-airpods-pro-2", "macbook-air-m2"]),
      chips: ["Compare these", "Add to cart"],
    };
  }

  if (q.includes("office")) {
    return {
      id,
      sender: "other",
      text: "For everyday office work these balance performance, keyboard comfort and battery life.",
      products: byCategory("laptops", 3, budget),
      chips: ["Compare these", "Show cheaper options"],
    };
  }

  if (q.includes("laptop") || q.includes("macbook")) {
    return {
      id,
      sender: "other",
      text: budget
        ? `Here are three good laptops under ₹${budget.toLocaleString("en-IN")}. I can compare them by battery, speed and value.`
        : "Here are three good laptops. I can compare them by battery, speed and value.",
      products: byCategory("laptops", 3, budget),
      chips: ["Compare these", "Best for office work"],
    };
  }

  if (q.includes("phone") || q.includes("mobile")) {
    return {
      id,
      sender: "other",
      text: "These phones are the strongest value picks in the store right now.",
      products: byCategory("mobile", 3, budget),
      chips: ["Compare these", "Show cheaper options"],
    };
  }

  return {
    id,
    sender: "other",
    text: "I can help you pick a product, compare options, or answer questions about specs, delivery and returns. Tell me a category and a budget to start.",
    chips: samplePrompts,
  };
}

export const bestForLabel = (product: Product, all: Product[] = []): string => {
  if (all.length > 1) {
    const cheapest = [...all].sort((a, b) => a.price - b.price)[0];
    const topRated = [...all].sort((a, b) => b.rating - a.rating)[0];
    const premium = [...all].sort((a, b) => b.price - a.price)[0];
    if (product.slug === topRated?.slug) return "Overall quality";
    if (product.slug === cheapest?.slug) return "Tight budgets";
    if (product.slug === premium?.slug) return "Premium experience";
  }
  if (product.category === "laptops") return product.price > 80000 ? "Premium performance" : "Value for money";
  if (product.category === "headphones-earbuds")
    return product.rating >= 4.5 ? "Noise cancellation" : "Everyday listening";
  return product.badge === "Bestseller" ? "Most popular pick" : "Balanced choice";
};
