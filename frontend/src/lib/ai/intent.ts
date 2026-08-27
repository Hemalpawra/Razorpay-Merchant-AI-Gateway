/**
 * Deterministic intent resolver for the Merchant AI storefront + agent-to-agent flows.
 *
 * The LLM stays conversational; this module is the ACTOR. It extracts entities
 * from the conversation with regex, drives a per-session state machine, and
 * (when complete) calls OrderCheckoutEngine to create a real Razorpay order.
 *
 * Two modes:
 *  - "customer": assistant collects details, creates the checkout, and the
 *    shopper completes the payment themselves (no extra gate).
 *  - "agent_to_agent": we create a DRAFT checkout, then wait for an explicit
 *    human permission grant before completing the purchase.
 */

import { createClient } from "@/utils/supabase/server";
import { OrderCheckoutEngine } from "@/lib/checkout/checkout-engine";
import { RAZORPAY_KEY_ID } from "@/lib/razorpay";

export type ChatMode = "customer" | "agent_to_agent";

export interface CustomerInfo {
  full_name?: string;
  email?: string;
  phone?: string;
}

export interface ShippingInfo {
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface IntentItem {
  sku: string;
  qty: number;
}

export interface IntentState {
  stage:
    | "browse"
    | "collect_contact"
    | "collect_shipping"
    | "ready"
    | "awaiting_permission"
    | "completed";
  items: IntentItem[];
  customer: CustomerInfo;
  shipping: ShippingInfo;
  db_order_id?: string;
  razorpay_order_id?: string;
  amount?: number;
  currency?: string;
}

export interface CheckoutPayload {
  key_id: string;
  razorpay_order_id: string;
  db_order_id: string;
  amount: number;
  currency: string;
  prefill: { name: string; email: string; contact: string };
}

export type IntentAction =
  | { type: "recommend"; products?: any[] }
  | { type: "collect_contact" }
  | { type: "collect_shipping" }
  | { type: "awaiting_permission"; summary: string }
  | { type: "checkout"; checkout: CheckoutPayload }
  | { type: "track"; order_id: string }
  | { type: "none" };

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(?:\+?91[-\s]?)?(\d{10})\b/;
const PINCODE_RE = /\b(\d{6})\b/;
const ORDER_ID_RE =
  /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i;

const BUY_RE =
  /\b(buy|purchase|order|checkout|pay|place order|get (this|it|these|them)|proceed to (buy|pay|checkout)|i want to buy|add to (cart|bag))\b/i;
const APPROVE_RE =
  /\b(approve|approval|confirm|proceed|go ahead|permission granted|authorized|complete (the )?(purchase|order))\b/i;
const TRACK_RE = /\b(track|status of (my )?order|where is my order)\b/i;

const CITY_STATE: Record<string, [string, string]> = {
  mumbai: ["Mumbai", "Maharashtra"],
  delhi: ["New Delhi", "Delhi"],
  bangalore: ["Bengaluru", "Karnataka"],
  bengaluru: ["Bengaluru", "Karnataka"],
  hyderabad: ["Hyderabad", "Telangana"],
  chennai: ["Chennai", "Tamil Nadu"],
  kolkata: ["Kolkata", "West Bengal"],
  pune: ["Pune", "Maharashtra"],
  ahmedabad: ["Ahmedabad", "Gujarat"],
};

export function extractEntities(text: string): {
  customer: CustomerInfo;
  shipping: ShippingInfo;
} {
  const customer: CustomerInfo = {};
  const shipping: ShippingInfo = {};
  const lower = text.toLowerCase();

  const email = text.match(EMAIL_RE);
  if (email) customer.email = email[0].toLowerCase();

  const phone = text.match(PHONE_RE);
  if (phone) customer.phone = phone[1];

  const pincode = text.match(PINCODE_RE);
  if (pincode) shipping.pincode = pincode[1];

  const nameMatch = text.match(
    /\b(?:my name is|i am|i'm|this is|name:?)\s+([a-z][a-z .]{1,30}?)(?:[,.]|$)/i,
  );
  if (nameMatch) customer.full_name = nameMatch[1].trim();

  const addrMatch = text.match(
    /\b(?:address|ship to|deliver to|my place|location):?\s*([^\n,.;]{4,80})/i,
  );
  if (addrMatch) shipping.line1 = addrMatch[1].trim();

  for (const [key, [city, state]] of Object.entries(CITY_STATE)) {
    if (lower.includes(key)) {
      shipping.city = city;
      shipping.state = state;
      break;
    }
  }
  const cityMatch = text.match(/\bcity:?\s*([a-z ]{2,30})/i);
  if (cityMatch && !shipping.city) shipping.city = cityMatch[1].trim();
  const stateMatch = text.match(/\bstate:?\s*([a-z ]{2,30})/i);
  if (stateMatch && !shipping.state) shipping.state = stateMatch[1].trim();

  return { customer, shipping };
}

export async function resolveIntent(params: {
  mode: ChatMode;
  message: string;
  sessionId: string | null;
  merchantId: string;
  currentState: IntentState | null;
  matchedProducts: any[];
}): Promise<{ action: IntentAction; nextState: IntentState }> {
  const { mode, message, sessionId, merchantId, matchedProducts } = params;
  const state: IntentState = params.currentState ?? {
    stage: "browse",
    items: [],
    customer: {},
    shipping: {},
  };

  const { customer, shipping } = extractEntities(message);
  state.customer = { ...state.customer, ...customer };
  state.shipping = { ...state.shipping, ...shipping };

  const lower = message.toLowerCase();

  // --- Track an existing order ---
  const trackMatch = message.match(ORDER_ID_RE);
  if (TRACK_RE.test(lower) && trackMatch) {
    return {
      action: { type: "track", order_id: trackMatch[1] },
      nextState: state,
    };
  }

  // --- Agent-to-agent: human granted permission to complete the purchase ---
  if (
    APPROVE_RE.test(lower) &&
    state.db_order_id &&
    mode === "agent_to_agent"
  ) {
    const supabase = await createClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id, razorpay_order_id, amount, currency")
      .eq("id", state.db_order_id)
      .maybeSingle();

    if (order?.razorpay_order_id) {
      const checkout: CheckoutPayload = {
        key_id: RAZORPAY_KEY_ID || "",
        razorpay_order_id: order.razorpay_order_id,
        db_order_id: order.id,
        amount: Math.round(Number(order.amount) * 100),
        currency: order.currency || "INR",
        prefill: {
          name: state.customer.full_name || "",
          email: state.customer.email || "",
          contact: state.customer.phone || "",
        },
      };
      state.stage = "completed";
      return { action: { type: "checkout", checkout }, nextState: state };
    }
  }

  // --- Decide which products the shopper wants ---
  const hasBuyIntent = BUY_RE.test(lower) || mode === "agent_to_agent";
  if (hasBuyIntent && matchedProducts.length > 0 && state.items.length === 0) {
    const takeAll = /\b(both|all|each|these|them)\b/.test(lower);
    const picks = takeAll ? matchedProducts : matchedProducts.slice(0, 1);
    state.items = picks
      .filter((p: any) => p?.sku)
      .map((p: any) => ({ sku: String(p.sku), qty: 1 }));
  }

  if (state.items.length === 0) {
    return {
      action: { type: "recommend", products: matchedProducts },
      nextState: state,
    };
  }

  // --- Agent-to-agent: default missing details so we can draft the checkout ---
  if (mode === "agent_to_agent") {
    state.customer.full_name = state.customer.full_name || "External Buyer Agent";
    state.customer.email = state.customer.email || "agent@buyer-demo.com";
    state.customer.phone = state.customer.phone || "9999999999";
    state.shipping.line1 = state.shipping.line1 || "Agent-provided Delivery Address";
    state.shipping.city = state.shipping.city || "Mumbai";
    state.shipping.state = state.shipping.state || "Maharashtra";
    state.shipping.pincode = state.shipping.pincode || "400001";
    state.shipping.country = state.shipping.country || "India";
  }

  const contactComplete = !!(state.customer.email && state.customer.phone);
  const shippingComplete = !!(state.shipping.line1 && state.shipping.pincode);

  if (!contactComplete) {
    state.stage = "collect_contact";
    return { action: { type: "collect_contact" }, nextState: state };
  }
  if (!shippingComplete) {
    state.stage = "collect_shipping";
    return { action: { type: "collect_shipping" }, nextState: state };
  }

  // --- Details complete: create the Razorpay order (once) ---
  if (!state.db_order_id) {
    const created = await OrderCheckoutEngine.createCheckoutSession({
      currency: "INR",
      merchant_id: merchantId,
      session_id: sessionId || undefined,
      customer: state.customer,
      items: state.items,
      shipping_method: "standard",
    });
    state.db_order_id = created.db_order_id;
    state.razorpay_order_id = created.razorpay_order_id;
    state.amount = created.amount; // returned in paise
    state.currency = created.currency;
  }

  if (mode === "agent_to_agent") {
    state.stage = "awaiting_permission";
    const summary = `Draft order ${state.db_order_id
      ?.slice(0, 8)
      .toUpperCase()} created for ₹${((state.amount || 0) / 100).toFixed(
      2,
    )} (${state.items.length} item(s)). Awaiting merchant approval to complete payment.`;
    return {
      action: { type: "awaiting_permission", summary },
      nextState: state,
    };
  }

  // --- Customer mode: open checkout immediately, shopper pays ---
  const checkout: CheckoutPayload = {
    key_id: RAZORPAY_KEY_ID || "",
    razorpay_order_id: state.razorpay_order_id || "",
    db_order_id: state.db_order_id || "",
    amount: state.amount || 0,
    currency: state.currency || "INR",
    prefill: {
      name: state.customer.full_name || "",
      email: state.customer.email || "",
      contact: state.customer.phone || "",
    },
  };
  state.stage = "completed";
  return { action: { type: "checkout", checkout }, nextState: state };
}
