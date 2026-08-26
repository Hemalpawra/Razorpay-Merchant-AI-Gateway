'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Amount,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  LockIcon,
  PackageIcon,
  Radio,
  RadioGroup,
  ShieldIcon,
  Text,
  TextInput,
  ZapIcon,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { useStoreCart } from "./StoreCartProvider";
import { useAiChat } from "./StoreAiProvider";

type Address = {
  name: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
};

const emptyAddress: Address = {
  name: "",
  phone: "",
  email: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
};

const isAddressComplete = (a: Address) =>
  Boolean(a.name.trim() && a.phone.trim() && a.email.trim() && a.line1.trim() && a.city.trim() && a.state.trim() && a.pincode.trim());

const shippingMethods = [
  {
    id: "standard",
    icon: PackageIcon,
    title: "Standard Delivery",
    description: "Reliable and cost-effective delivery",
    eta: "Delivered by 24 - 27 May",
    price: 0,
  },
  {
    id: "express",
    icon: ZapIcon,
    title: "Express Delivery",
    description: "Faster delivery for urgent orders",
    eta: "Delivered by 21 - 22 May",
    price: 149,
  },
];

export default function CheckoutBlade() {
  const router = useRouter();
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [shipping, setShipping] = useState("standard");
  const [payMethod, setPayMethod] = useState("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { lines: cartItems } = useStoreCart();
  const { sessionId } = useAiChat();

  const setField = (key: keyof Address) => (value: string) => setAddress((prev) => ({ ...prev, [key]: value }));

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const selectedShip = shippingMethods.find((s) => s.id === shipping);
  const shippingFee = selectedShip?.price ?? 0;
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shippingFee + tax;

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async () => {
    setErrorMessage(null);

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Add a product before checking out.");
      return;
    }
    if (!isAddressComplete(address)) {
      setErrorMessage("Please fill in your full name, contact details and delivery address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: "INR",
          shipping_method: shipping,
          session_id: sessionId,
          customer: {
            full_name: address.name,
            email: address.email,
            phone: address.phone,
            line1: address.line1,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            payment_mode: payMethod,
          },
          items: cartItems.map((i) => ({ sku: (i.product as any).sku || i.product.slug, qty: i.qty })),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || "Could not create order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        setErrorMessage("Could not load the Razorpay checkout. Please check your connection and try again.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "ElectroStore",
        description: "Razorpay AI Gateway Checkout",
        order_id: data.razorpay_order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                db_order_id: data.db_order_id,
                customer: address,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || verifyData.error) {
              setErrorMessage(verifyData.error || "Payment verification failed. Please contact support before retrying.");
              setIsSubmitting(false);
              return;
            }
            setIsSubmitting(false);
            router.push(`/store/order-success/${data.db_order_id || data.razorpay_order_id}`);
          } catch (err: any) {
            setErrorMessage(err.message || "Payment verification failed.");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: "#0066FF" },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMessage(response?.error?.description || "Payment failed. Please try again with a different payment method.");
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Place order failed:", err);
      setErrorMessage(err.message || "Checkout failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <BladeRoot>
      <Box backgroundColor="surface.background.gray.subtle" paddingX="spacing.7" paddingY="spacing.7">
        <Box maxWidth="1200px" margin="auto" display="flex" flexDirection="column" gap="spacing.6">
          <Heading size="large" as="h1">
            Checkout
          </Heading>

          <Box display="flex" flexDirection="row" gap="spacing.7" flexWrap="wrap" alignItems="flex-start">
            {/* Left Main Section */}
            <Box flex="2" minWidth="320px" display="flex" flexDirection="column" gap="spacing.5">
              {/* Delivery Address Card */}
              <Card elevation="lowRaised" padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5">
                    <Heading size="small" as="h2">
                      1. Delivery Address
                    </Heading>

                    <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
                      <Box flex="1" minWidth="240px">
                        <TextInput
                          label="Full name"
                          value={address.name}
                          onChange={({ value }) => setField("name")(value ?? "")}
                          necessityIndicator="required"
                        />
                      </Box>
                      <Box flex="1" minWidth="240px">
                        <TextInput
                          label="Phone number"
                          value={address.phone}
                          onChange={({ value }) => setField("phone")(value ?? "")}
                          necessityIndicator="required"
                        />
                      </Box>
                    </Box>

                    <TextInput
                      label="Email"
                      type="email"
                      value={address.email}
                      onChange={({ value }) => setField("email")(value ?? "")}
                      necessityIndicator="required"
                    />

                    <TextInput
                      label="Address line"
                      placeholder="House no., street, area"
                      value={address.line1}
                      onChange={({ value }) => setField("line1")(value ?? "")}
                      necessityIndicator="required"
                    />

                    <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
                      <Box flex="1" minWidth="180px">
                        <TextInput
                          label="City"
                          value={address.city}
                          onChange={({ value }) => setField("city")(value ?? "")}
                          necessityIndicator="required"
                        />
                      </Box>
                      <Box flex="1" minWidth="180px">
                        <TextInput
                          label="State"
                          value={address.state}
                          onChange={({ value }) => setField("state")(value ?? "")}
                          necessityIndicator="required"
                        />
                      </Box>
                      <Box flex="1" minWidth="140px">
                        <TextInput
                          label="Pincode"
                          value={address.pincode}
                          onChange={({ value }) => setField("pincode")(value ?? "")}
                          necessityIndicator="required"
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardBody>
              </Card>

              {/* Shipping Method Card */}
              <Card elevation="lowRaised" padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5">
                    <Heading size="small" as="h2">
                      2. Shipping Method
                    </Heading>

                    <RadioGroup
                      label="Choose shipping option"
                      value={shipping}
                      onChange={({ value }) => setShipping(value)}
                    >
                      <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
                        {shippingMethods.map((method) => (
                          <Box
                            key={method.id}
                            flex="1"
                            minWidth="260px"
                            borderWidth="thin"
                            borderColor={shipping === method.id ? "interactive.border.primary.default" : "surface.border.gray.muted"}
                            borderRadius="medium"
                            padding="spacing.4"
                            backgroundColor="surface.background.gray.intense"
                          >
                            <Radio value={method.id}>
                              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                <Box display="flex" flexDirection="column" gap="spacing.1">
                                  <Text size="small" weight="semibold">
                                    {method.title}
                                  </Text>
                                  <Text size="xsmall" color="surface.text.gray.muted">
                                    {`${method.description} · ${method.eta}`}
                                  </Text>
                                </Box>
                                <Amount value={method.price} size="small" type="body" suffix="none" />
                              </Box>
                            </Radio>
                          </Box>
                        ))}
                      </Box>
                    </RadioGroup>
                  </Box>
                </CardBody>
              </Card>

              {/* Payment Method Card */}
              <Card elevation="lowRaised" padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5">
                    <Heading size="small" as="h2">
                      3. Payment Method
                    </Heading>

                    <RadioGroup
                      label="Select payment mode"
                      value={payMethod}
                      onChange={({ value }) => setPayMethod(value)}
                    >
                      <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
                        {[
                          { id: "upi", title: "UPI / QR Code", sub: "Google Pay, PhonePe, Paytm, BHIM" },
                          { id: "card", title: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                          { id: "netbanking", title: "Net Banking", sub: "HDFC, ICICI, SBI, Axis & all major banks" },
                          { id: "cod", title: "Cash on Delivery", sub: "Pay cash upon arrival" },
                        ].map((mode) => (
                          <Box
                            key={mode.id}
                            flex="1"
                            minWidth="240px"
                            borderWidth="thin"
                            borderColor={payMethod === mode.id ? "interactive.border.primary.default" : "surface.border.gray.muted"}
                            borderRadius="medium"
                            padding="spacing.4"
                            backgroundColor="surface.background.gray.intense"
                          >
                            <Radio value={mode.id}>
                              <Box display="flex" flexDirection="column" gap="spacing.1">
                                <Text size="small" weight="semibold">
                                  {mode.title}
                                </Text>
                                <Text size="xsmall" color="surface.text.gray.muted">
                                  {mode.sub}
                                </Text>
                              </Box>
                            </Radio>
                          </Box>
                        ))}
                      </Box>
                    </RadioGroup>
                  </Box>
                </CardBody>
              </Card>
            </Box>

            {/* Right Summary Section */}
            <Box flex="1" minWidth="300px" display="flex" flexDirection="column" gap="spacing.5">
              <Card elevation="lowRaised" padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.4">
                    <Heading size="small" as="h2">
                      Order Summary
                    </Heading>

                    {cartItems.map(({ product, qty }) => (
                      <Box key={product.slug} display="flex" justifyContent="space-between" gap="spacing.3">
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {`${product.name} (x${qty})`}
                        </Text>
                        <Amount value={product.price * qty} size="xsmall" type="body" suffix="none" />
                      </Box>
                    ))}

                    <Divider />

                    <Box display="flex" justifyContent="space-between">
                      <Text size="small" color="surface.text.gray.muted">
                        Subtotal
                      </Text>
                      <Amount value={subtotal} size="small" suffix="none" />
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Text size="small" color="surface.text.gray.muted">
                        Shipping
                      </Text>
                      <Amount value={shippingFee} size="small" suffix="none" />
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Text size="small" color="surface.text.gray.muted">
                        Tax (18% GST)
                      </Text>
                      <Amount value={tax} size="small" suffix="none" />
                    </Box>

                    <Divider />

                    <Box display="flex" justifyContent="space-between">
                      <Text size="medium" weight="semibold">
                        Total Amount
                      </Text>
                      <Amount value={grandTotal} size="medium" type="heading" suffix="none" />
                    </Box>

                    {errorMessage && (
                      <Alert
                        color="negative"
                        isFullWidth
                        title="Checkout error"
                        description={errorMessage}
                      />
                    )}

                    <Button
                      variant="primary"
                      size="large"
                      icon={LockIcon}
                      isFullWidth
                      isLoading={isSubmitting}
                      isDisabled={cartItems.length === 0}
                      onClick={handlePlaceOrder}
                    >
                      Pay &amp; Place Order
                    </Button>

                    <Box display="flex" alignItems="center" justifyContent="center" gap="spacing.2">
                      <ShieldIcon size="small" color="surface.icon.gray.muted" />
                      <Text size="xsmall" color="surface.text.gray.muted">
                        256-Bit SSL Encrypted Razorpay Checkout
                      </Text>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </BladeRoot>
  );
}
