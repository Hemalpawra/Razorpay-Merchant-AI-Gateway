import { createClient } from "@/utils/supabase/server";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  RAZORPAY_KEY_ID,
} from "@/lib/razorpay";
import { MerchantAuditService } from "@/utils/audit";

export interface CreateOrderParams {
  currency?: string;
  merchant_id?: string;
  session_id?: string;
  customer?: any;
  items?: Array<{ sku: string; qty: number }>;
  shipping_method?: "standard" | "express";
}

const SHIPPING_METHODS: Record<string, number> = {
  standard: 0,
  express: 149,
};

const TAX_RATE = 0.18;
const MAX_QTY_PER_LINE = 10;
const MAX_LINES_PER_ORDER = 50;

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  db_order_id?: string;
  customer?: any;
}

export class OrderCheckoutEngine {
  /**
   * Create a new Razorpay checkout order and record it in Supabase DB
   */
  static async createCheckoutSession(params: CreateOrderParams) {
    const {
      currency = "INR",
      merchant_id,
      session_id,
      customer,
      items = [],
      shipping_method = "standard",
    } = params;

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Cart is empty");
    }
    if (items.length > MAX_LINES_PER_ORDER) {
      throw new Error("Too many distinct items in this order");
    }
    if (!(shipping_method in SHIPPING_METHODS)) {
      throw new Error("Invalid shipping method");
    }

    // Normalize and validate quantities before trusting anything from the client.
    const requestedQtyBySku = new Map<string, number>();
    for (const raw of items) {
      const sku = String(raw?.sku ?? "").trim();
      const qty = Number(raw?.qty);
      if (!sku) throw new Error("Every cart line must reference a product SKU");
      if (!Number.isInteger(qty) || qty <= 0 || qty > MAX_QTY_PER_LINE) {
        throw new Error(`Invalid quantity for ${sku}`);
      }
      requestedQtyBySku.set(sku, (requestedQtyBySku.get(sku) ?? 0) + qty);
    }

    const supabase = await createClient();

    let finalMerchantId: string = merchant_id || "";
    if (!finalMerchantId) {
      const { data: m } = await supabase
        .from("merchants")
        .select("id")
        .limit(1)
        .single();
      finalMerchantId = m?.id || "";
    }
    if (!finalMerchantId) {
      throw new Error("No merchant is configured for this store");
    }

    // Recompute the total from live, server-side product prices — never trust client-submitted prices.
    const skus = Array.from(requestedQtyBySku.keys());
    const { data: dbProducts, error: productsErr } = await supabase
      .from("products")
      .select("id, sku, name, image_url, price, status, stock_qty")
      .eq("merchant_id", finalMerchantId)
      .in("sku", skus);

    if (productsErr) {
      throw new Error(`Could not verify cart items: ${productsErr.message}`);
    }

    type DbProductRow = {
      id: string;
      sku: string;
      name: string;
      image_url: string | null;
      price: number;
      status: string;
      stock_qty: number;
    };
    const productRows = (dbProducts ?? []) as unknown as DbProductRow[];
    const productBySku = new Map<string, DbProductRow>(
      productRows.map((p) => [p.sku, p]),
    );
    let subtotal = 0;
    const orderLineItems: Array<{
      product_id: string;
      sku: string;
      name: string;
      image_url: string | null;
      unit_price: number;
      qty: number;
      line_total: number;
    }> = [];
    for (const [sku, qty] of requestedQtyBySku.entries()) {
      const product = productBySku.get(sku);
      if (!product || product.status !== "active") {
        throw new Error(`Product ${sku} is no longer available`);
      }
      if (Number(product.stock_qty ?? 0) < qty) {
        throw new Error(`Not enough stock for ${sku}`);
      }
      const lineTotal = Number(product.price) * qty;
      subtotal += lineTotal;
      orderLineItems.push({
        product_id: product.id,
        sku: product.sku,
        name: product.name,
        image_url: product.image_url,
        unit_price: Number(product.price),
        qty,
        line_total: lineTotal,
      });
    }

    const shippingFee = SHIPPING_METHODS[shipping_method];
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const amount = Math.round((subtotal + shippingFee + tax) * 100) / 100;

    if (amount <= 0) {
      throw new Error("Valid checkout amount is required");
    }

    const amountInPaise = Math.round(amount * 100);

    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        merchant_id: finalMerchantId,
        session_id: session_id || "",
        item_count: String(items.length),
      },
    });

    const { data: dbOrder, error: orderInsertError } = await supabase
      .from("orders")
      .insert({
        merchant_id: finalMerchantId,
        session_id: session_id || null,
        razorpay_order_id: razorpayOrder.id,
        amount,
        subtotal,
        tax_amount: tax,
        shipping_amount: shippingFee,
        currency,
        status: "draft",
        checkout_url: "/store/checkout",
      })
      .select("*")
      .single();

    if (orderInsertError || !dbOrder) {
      throw new Error(
        `Could not persist order: ${orderInsertError?.message || "unknown database error"}`,
      );
    }

    {
      const { error: itemInsertError } = await supabase
        .from("order_items")
        .insert(
          orderLineItems.map((item) => ({
            order_id: dbOrder.id,
            product_id: item.product_id,
            sku: item.sku,
            name: item.name,
            image_url: item.image_url,
            unit_price: item.unit_price,
            qty: item.qty,
            line_total: item.line_total,
          })),
        );
      if (itemInsertError) {
        await supabase.from("orders").delete().eq("id", dbOrder.id);
        throw new Error(
          `Could not persist order items: ${itemInsertError.message}`,
        );
      }
    }

    if (customer) {
      const { error: customerError } = await supabase
        .from("customer_details")
        .insert({
          order_id: dbOrder.id,
          session_id: session_id || null,
          full_name: customer.full_name || customer.name || "Customer",
          email: customer.email,
          phone: customer.phone,
          shipping_address_line1: customer.line1 || customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          country: customer.country || "India",
          payment_mode: customer.payment_mode || "UPI",
        });
      if (customerError) {
        await supabase.from("order_items").delete().eq("order_id", dbOrder.id);
        await supabase.from("orders").delete().eq("id", dbOrder.id);
        throw new Error(`Could not persist customer details: ${customerError.message}`);
      }
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: finalMerchantId,
        session_id: session_id || undefined,
        order_id: dbOrder.id,
        actor_type: "customer",
        event_type: "shipping_details_collected",
        title: "Shipping Details Collected",
        description: `Delivery details collected for ${customer.full_name || customer.name || "Customer"} (${customer.city || ""}, ${customer.state || ""})`,
        result: "success",
      });
    }

    if (finalMerchantId) {
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: finalMerchantId,
        session_id: session_id || undefined,
        order_id: dbOrder?.id || undefined,
        actor_type: "system",
        event_type: "razorpay_order_created",
        title: "Razorpay Order Created",
        description: `Razorpay order ${razorpayOrder.id} created for ₹${amount}`,
        result: "success",
        meta_json: { razorpay_order_id: razorpayOrder.id, amount, currency },
      });
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: finalMerchantId,
        session_id: session_id || undefined,
        order_id: dbOrder?.id || undefined,
        actor_type: "customer",
        event_type: "checkout_initiated",
        title: "Razorpay Checkout Initiated",
        description: `Order created for ₹${amount} (Razorpay ID: ${razorpayOrder.id})`,
        result: "success",
        meta_json: { razorpay_order_id: razorpayOrder.id, amount, currency },
      });
      if (session_id) {
        await supabase
          .from("buyer_sessions")
          .update({ status: "checkout_ready", updated_at: new Date().toISOString() })
          .eq("id", session_id);
      }
    }

    return {
      success: true,
      key_id: RAZORPAY_KEY_ID,
      razorpay_order_id: razorpayOrder.id,
      db_order_id: dbOrder?.id,
      amount: amountInPaise,
      currency,
    };
  }

  /**
   * Verify Razorpay payment signature, mark order as paid, and issue an official Invoice
   */
  static async verifyPaymentSession(params: VerifyPaymentParams) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      db_order_id,
      customer,
    } = params;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing required Razorpay payment verification fields");
    }

    const isValid = verifyRazorpaySignature({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      const supabase = await createClient();
      const { data: failedOrder } = await supabase
        .from("orders")
        .select("id, merchant_id, session_id")
        .eq(db_order_id ? "id" : "razorpay_order_id", db_order_id || razorpay_order_id)
        .maybeSingle();
      if (failedOrder) {
        await MerchantAuditService.logEvent({
          supabase,
          merchant_id: failedOrder.merchant_id,
          session_id: failedOrder.session_id || undefined,
          order_id: failedOrder.id,
          actor_type: "system",
          event_type: "payment_failed",
          title: "Payment Verification Failed",
          description: `Signature verification failed for Razorpay order ${razorpay_order_id}. Customer can safely retry with another payment method.`,
          result: "failure",
          meta_json: { razorpay_order_id, razorpay_payment_id },
        });
      }
      throw new Error("Invalid Razorpay payment signature");
    }

    const supabase = await createClient();

    // Fetch the existing order first so we can detect an already-processed payment
    // and avoid double-decrementing stock or issuing a duplicate invoice.
    let existingQuery = supabase.from("orders").select("*");
    existingQuery = db_order_id
      ? existingQuery.eq("id", db_order_id)
      : existingQuery.eq("razorpay_order_id", razorpay_order_id);
    const { data: existingOrder, error: existingOrderError } = await existingQuery.single();

    if (existingOrderError || !existingOrder) {
      throw new Error(`Order not found for Razorpay order ${razorpay_order_id}`);
    }
    if (existingOrder.razorpay_order_id !== razorpay_order_id) {
      throw new Error("Payment does not belong to this order");
    }

    if (existingOrder.status === "paid") {
      const { data: existingInvoice } = await supabase
        .from("invoices")
        .select("*")
        .eq("order_id", existingOrder.id)
        .maybeSingle();
      return {
        success: true,
        message: "Payment already verified for this order.",
        order: existingOrder,
        invoice: existingInvoice ?? null,
      };
    }

    let query = supabase.from("orders").update({
      status: "paid",
      razorpay_payment_id,
      razorpay_payment_signature: razorpay_signature,
      razorpay_payment_json: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      updated_at: new Date().toISOString(),
    });

    if (db_order_id) {
      query = query.eq("id", db_order_id);
    } else {
      query = query.eq("razorpay_order_id", razorpay_order_id);
    }

    const { data: updatedOrder, error: orderErr } = await query
      .select("*")
      .single();
    if (orderErr || !updatedOrder) {
      throw new Error(`Could not mark order as paid: ${orderErr?.message || "order update returned no row"}`);
    }

    if (customer) {
      const { error: customerError } = await supabase
        .from("customer_details")
        .upsert({
          order_id: updatedOrder.id,
          session_id: updatedOrder.session_id,
          full_name: customer.full_name || customer.name || "Customer",
          email: customer.email,
          phone: customer.phone,
          shipping_address_line1: customer.line1 || customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          payment_mode: customer.payment_mode || "UPI",
          updated_at: new Date().toISOString(),
        }, { onConflict: "order_id" });
      if (customerError) {
        throw new Error(`Could not update customer details: ${customerError.message}`);
      }
    }

    // Decrement stock for purchased items now that payment is confirmed.
    if (updatedOrder) {
      const { data: purchasedItems } = await supabase
        .from("order_items")
        .select("product_id, qty")
        .eq("order_id", updatedOrder.id);

      for (const item of purchasedItems ?? []) {
        if (!item.product_id) continue;
        const { data: product } = await supabase
          .from("products")
          .select("stock_qty")
          .eq("id", item.product_id)
          .single();
        if (product) {
          await supabase
            .from("products")
            .update({
              stock_qty: Math.max(
                0,
                Number(product.stock_qty) - Number(item.qty),
              ),
            })
            .eq("id", item.product_id);
        }
      }
    }

    // Generate Official Attached Invoice using the totals recorded at order creation time.
    let invoiceData = null;
    if (updatedOrder) {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(updatedOrder.id).replaceAll("-", "").slice(0, 12).toUpperCase()}`;
      const subtotal = Number(updatedOrder.subtotal) || 0;
      const taxAmount = Number(updatedOrder.tax_amount) || 0;
      const shippingAmount = Number(updatedOrder.shipping_amount) || 0;
      const grandTotal =
        Number(updatedOrder.amount) ||
        Math.round((subtotal + taxAmount + shippingAmount) * 100) / 100;

      const generatedInvoice = {
        invoice_number: invoiceNumber,
        order_id: updatedOrder.id,
        merchant_id: updatedOrder.merchant_id,
        customer_name: customer?.full_name || customer?.name || "Customer",
        customer_email: customer?.email || "customer@example.com",
        subtotal,
        tax_amount: taxAmount,
        discount_amount: 0,
        grand_total: grandTotal,
        currency: updatedOrder.currency || "INR",
        status: "issued",
      };

      try {
        const { data: newInv, error: invErr } = await supabase
          .from("invoices")
          .upsert(generatedInvoice, { onConflict: "order_id" })
          .select("*")
          .single();

        if (invErr || !newInv) {
          throw new Error(`Could not persist invoice: ${invErr?.message || "unknown database error"}`);
        }
        invoiceData = newInv;
      } catch (invoiceError) {
        throw invoiceError instanceof Error
          ? invoiceError
          : new Error("Could not persist invoice");
      }
    }

    if (updatedOrder?.merchant_id) {
      await MerchantAuditService.logPaymentVerified(
        supabase,
        updatedOrder.merchant_id,
        updatedOrder.id,
        razorpay_payment_id,
      );
      if (invoiceData) {
        await MerchantAuditService.logEvent({
          supabase,
          merchant_id: updatedOrder.merchant_id,
          session_id: updatedOrder.session_id || undefined,
          order_id: updatedOrder.id,
          actor_type: "system",
          event_type: "invoice_generated",
          title: "Invoice Generated",
          description: `Invoice ${invoiceData.invoice_number} issued for ₹${invoiceData.grand_total}`,
          result: "success",
          meta_json: { invoice_number: invoiceData.invoice_number },
        });
      }
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: updatedOrder.merchant_id,
        session_id: updatedOrder.session_id || undefined,
        order_id: updatedOrder.id,
        actor_type: "system",
        event_type: "tracking_started",
        title: "Shipment Tracking Started",
        description: `Dummy shipment tracking initialised for order ${updatedOrder.id.slice(0, 8).toUpperCase()}`,
        result: "success",
      });
      if (updatedOrder.session_id) {
        await supabase
          .from("buyer_sessions")
          .update({ status: "paid", updated_at: new Date().toISOString() })
          .eq("id", updatedOrder.session_id);
      }
    }

    return {
      success: true,
      message: "Payment verified and official order invoice generated!",
      order: updatedOrder,
      invoice: invoiceData,
    };
  }
}
