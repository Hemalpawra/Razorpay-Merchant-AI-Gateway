/**
 * Shared Razorpay Checkout.js loader + opener for client components.
 * Keeps the script-loading and Razorpay instantiation logic DRY between
 * the in-store AI drawer and the agent-to-agent modal.
 */

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface OpenRazorpayArgs {
  key_id: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  db_order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  name?: string;
  description?: string;
  onSuccess?: (response: any) => void;
  onError?: (message: string) => void;
  onDismiss?: () => void;
}

export async function openRazorpay(args: OpenRazorpayArgs): Promise<void> {
  const ok = await loadRazorpayScript();
  if (!ok || !(window as any).Razorpay) {
    args.onError?.("Could not load Razorpay checkout");
    return;
  }

  const options: any = {
    key: args.key_id,
    amount: args.amount,
    currency: args.currency,
    name: args.name || "ElectroStore",
    description: args.description || "Razorpay AI Gateway Checkout",
    order_id: args.razorpay_order_id,
    prefill: args.prefill || { name: "", email: "", contact: "" },
    theme: { color: "#0066FF" },
    handler: (response: any) => {
      args.onSuccess?.(response);
    },
    modal: {
      ondismiss: () => {
        args.onDismiss?.();
      },
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.on("payment.failed", (response: any) => {
    args.onError?.(response?.error?.description || "Payment failed. Please try again.");
  });
  rzp.open();
}
