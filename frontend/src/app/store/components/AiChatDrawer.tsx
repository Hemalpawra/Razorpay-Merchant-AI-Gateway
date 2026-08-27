"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Amount,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  ChatInput,
  ChatMessage as BladeChatMessage,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  Indicator,
  RayIcon,
  ShoppingCartIcon,
  Text,
  TextInput,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { useAiChat } from "./StoreAiProvider";
import { openRazorpay } from "@/lib/razorpay-client";
import { type Product } from "@/lib/store/catalog";

type MatchedProduct = {
  id?: string;
  sku?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string;
};

type ChatMessageItem = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  matched_products?: MatchedProduct[];
  model_used?: string;
  isError?: boolean;
  suggestions?: string[];
};

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  product?: Product | undefined;
};

const THINKING_STEPS = [
  "Reading your message...",
  "Searching the live product catalog...",
  "Ranking the best matches...",
];

const SUGGESTED_QUESTIONS = [
  "Headphones under ₹5,000",
  "Compare Asus TUF vs Acer Nitro",
  "Wireless Mouse",
];

function getCurrentTimeString() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function GenUIProductCard({
  item,
  onAddToCart,
}: {
  item: MatchedProduct;
  onAddToCart: (item: MatchedProduct) => void;
}) {
  const inStock = (item.stock ?? 0) > 0;
  const imageUrl = item.image_url ?? "/store/p-headphones.jpg";

  return (
    <Card elevation="none" backgroundColor="surface.background.gray.intense">
      <CardBody>
        <Box display="flex" gap="spacing.3" alignItems="center" padding="spacing.3">
          <Box
            width="64px"
            height="64px"
            borderRadius="small"
            backgroundColor="surface.background.gray.subtle"
            flexShrink={0}
            overflow="hidden"
          >
            <img
              src={imageUrl}
              alt={item.name}
              width="64"
              height="64"
              style={{ objectFit: "cover" }}
            />
          </Box>
          <Box flex={1} display="flex" flexDirection="column" gap="spacing.1">
            <Box display="flex" flexWrap="wrap" alignItems="center" gap="spacing.2">
              <Text size="small" weight="semibold" truncateAfterLines={1}>
                {item.name}
              </Text>
              <Badge color={inStock ? "positive" : "neutral"} size="xsmall">
                {inStock ? `In Stock · ${item.stock}` : "Out of Stock"}
              </Badge>
            </Box>
            {item.description && (
              <Text size="xsmall" color="surface.text.gray.subtle" truncateAfterLines={1}>
                {item.description}
              </Text>
            )}
            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="spacing.1">
              <Amount value={item.price} currency="INR" size="medium" />
              <Button
                variant="primary"
                size="xsmall"
                icon={ShoppingCartIcon}
                iconPosition="left"
                onClick={() => onAddToCart(item)}
                isDisabled={!inStock}
              >
                Add & Checkout
              </Button>
            </Box>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}

function SuggestedQuestionChips({
  questions,
  onSelect,
}: {
  questions: string[];
  onSelect: (question: string) => void;
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.2"
      marginTop="spacing.3"
    >
      {questions.map((question) => (
        <Button
          key={question}
          variant="tertiary"
          size="small"
          isFullWidth
          onClick={() => onSelect(question)}
        >
          {question}
        </Button>
      ))}
    </Box>
  );
}

const INITIAL_WELCOME_MESSAGE: ChatMessageItem = {
  id: "welcome_msg",
  sender: "assistant",
  text: "Hi there! I’m your ElectroStore shopping assistant. Tell me what you’re looking for, your budget, or the specs you care about, and I’ll narrow it down.",
  timestamp: getCurrentTimeString(),
  suggestions: SUGGESTED_QUESTIONS,
};

export default function AiChatDrawer({ isOpen, onDismiss, product }: Props) {
  const router = useRouter();
  const { sessionId, setSessionId } = useAiChat();
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    INITIAL_WELCOME_MESSAGE,
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeForm, setActiveForm] = useState<"contact" | "shipping" | null>(
    null,
  );
  const [pendingCheckoutItem, setPendingCheckoutItem] =
    useState<MatchedProduct | null>(null);
  const [trackOrderId, setTrackOrderId] = useState<string | null>(null);
  const [cf, setCf] = useState({ name: "", email: "", phone: "" });
  const [sf, setSf] = useState({
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    if (product) {
      handleSendMessage(`Tell me about ${product.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setActiveForm(null);
      setPendingCheckoutItem(null);
      setTrackOrderId(null);
      setCf({ name: "", email: "", phone: "" });
      setSf({ line1: "", city: "", state: "", pincode: "" });
    }
  }, [isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (
      customText !== undefined ? customText : inputValue
    ).trim();
    if (!textToSend || isSendingRef.current) return;

    isSendingRef.current = true;
    setIsTyping(true);

    const userMsgId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userMsg: ChatMessageItem = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: getCurrentTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          session_id: sessionId,
          history: messages.slice(-4),
          mode: "customer",
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.error || "The AI assistant is temporarily unavailable.",
        );
      }

      if (data.session_id) setSessionId(data.session_id);

      const aiMsg: ChatMessageItem = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: "assistant",
        text: data.reply || "I found matching products in our catalog.",
        timestamp: getCurrentTimeString(),
        matched_products: data.matched_products || [],
        model_used: data.model_used || "openai/gpt-5-mini-fast",
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.action === "checkout" && data.checkout) {
        openRazorpayWithPayload(data.checkout);
      } else if (data.action === "collect_contact") {
        setActiveForm("contact");
      } else if (data.action === "collect_shipping") {
        setActiveForm("shipping");
      } else if (data.action === "track" && data.order_id) {
        setTrackOrderId(data.order_id);
      }
    } catch (err) {
      console.error("AI Chat Error:", err);
      // Mark the user's own message as failed (Blade's error affordance is on senderType="self")
      // instead of fabricating an assistant reply, and let them retry the exact same message.
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, isError: true } : m)),
      );
    } finally {
      setIsTyping(false);
      isSendingRef.current = false;
    }
  };

  const handleRetry = (messageId: string, text: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    handleSendMessage(text);
  };

  const submitContact = () => {
    if (pendingCheckoutItem) {
      // Single-product checkout flow: advance to shipping collection.
      setActiveForm("shipping");
      return;
    }
    const text = `name: ${cf.name}, email: ${cf.email}, phone: ${cf.phone}`;
    setActiveForm(null);
    setCf({ name: "", email: "", phone: "" });
    handleSendMessage(text);
  };

  const submitShipping = () => {
    if (pendingCheckoutItem) {
      // Single-product checkout flow: create the order with collected details.
      const item = pendingCheckoutItem;
      setPendingCheckoutItem(null);
      setActiveForm(null);
      setSf({ line1: "", city: "", state: "", pincode: "" });
      createOrderAndPay(item, {
        full_name: cf.name,
        email: cf.email,
        phone: cf.phone,
        line1: sf.line1,
        city: sf.city,
        state: sf.state,
        pincode: sf.pincode,
        payment_mode: "upi",
      });
      return;
    }
    const text = `address: ${sf.line1}, city: ${sf.city}, state: ${sf.state}, pincode: ${sf.pincode}`;
    setActiveForm(null);
    setSf({ line1: "", city: "", state: "", pincode: "" });
    handleSendMessage(text);
  };

  const createOrderAndPay = (
    item: MatchedProduct,
    customer: {
      full_name: string;
      email: string;
      phone: string;
      line1: string;
      city: string;
      state: string;
      pincode: string;
      payment_mode: string;
    },
  ) => {
    if (!item.sku) {
      setErrorMessage("Missing product SKU. Please try again.");
      return;
    }
    setIsSubmitting(true);
    (async () => {
      try {
        const orderData = await fetch("/api/checkout/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currency: "INR",
            shipping_method: "standard",
            session_id: sessionId,
            customer,
            items: [{ sku: item.sku, qty: 1 }],
          }),
        }).then((r) => r.json());
        if (!orderData.key_id || !orderData.razorpay_order_id) {
          throw new Error("Order creation failed");
        }
        openRazorpayForOrder({
          key_id: orderData.key_id,
          razorpay_order_id: orderData.razorpay_order_id,
          amount: orderData.amount,
          db_order_id: orderData.db_order_id,
          currency: orderData.currency,
          prefill: {
            name: customer.full_name,
            email: customer.email,
            contact: customer.phone,
          },
        });
      } catch (err: any) {
        setErrorMessage(err.message || "Checkout failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const openRazorpayForOrder = (order: {
    key_id: string;
    razorpay_order_id: string;
    amount: number;
    db_order_id: string;
    currency?: string;
    prefill?: { name?: string; email?: string; contact?: string };
  }) => {
    openRazorpay({
      key_id: order.key_id,
      razorpay_order_id: order.razorpay_order_id,
      amount: order.amount,
      currency: order.currency || "INR",
      db_order_id: order.db_order_id,
      prefill: order.prefill,
      onSuccess: async (response: any) => {
        try {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              db_order_id: order.db_order_id,
              customer: {},
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || verifyData.error) {
            throw new Error(verifyData.error || "Payment verification failed");
          }
          setIsSubmitting(false);
          onDismiss();
          router.push(`/store/order-success/${order.db_order_id || response.razorpay_order_id}`);
        } catch (err: any) {
          setErrorMessage(err.message || "Payment verification failed");
          setIsSubmitting(false);
        }
      },
      onError: (msg: string) => setErrorMessage(msg),
      onDismiss: () => setIsSubmitting(false),
    });
  };

  const handleAddToCartAndCheckout = (item: MatchedProduct) => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "product_selected",
        session_id: sessionId,
        title: "Product Selected",
        description: `${item.name} added to cart from AI recommendation`,
        meta_json: { sku: item.sku, price: item.price },
      }),
    }).catch(() => {});
    // Collect customer + shipping details before creating the order.
    setPendingCheckoutItem(item);
    setActiveForm("contact");
  };

  const openRazorpayWithPayload = (payload: any) => {
    openRazorpayForOrder({
      key_id: payload?.key_id,
      razorpay_order_id: payload?.razorpay_order_id,
      amount: payload?.amount,
      db_order_id: payload?.db_order_id,
      currency: payload?.currency,
      prefill: payload?.prefill,
    });
  };
  return (
    <BladeRoot>
      <Drawer isOpen={isOpen} onDismiss={onDismiss}>
        <DrawerHeader
          title="Merchant AI Shopping Assistant"
          subtitle="Powered by Vercel AI Gateway &amp; Razorpay Blade"
        />
        <DrawerBody>
          <Box
            display="flex"
            flexDirection="column"
            height="100%"
            justifyContent="space-between"
          >
            {/* Header Status Bar */}
            <Box paddingBottom="spacing.3">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Indicator color="positive" size="small" />
                  <Text size="xsmall" weight="semibold">
                    AI Gateway Active &amp; Connected
                  </Text>
                </Box>
                <Badge color="neutral" size="small">
                  Live RAG Catalog
                </Badge>
              </Box>
              <Divider marginTop="spacing.3" />
            </Box>

            {/* Scrollable Message List Container */}
            <Box
              flex={1}
              overflowY="auto"
              display="flex"
              flexDirection="column"
              gap="spacing.4"
              paddingRight="spacing.2"
              ref={scrollRef}
            >
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  display="flex"
                  flexDirection="column"
                  gap="spacing.2"
                >
                  <BladeChatMessage
                    senderType={msg.sender === "user" ? "self" : "other"}
                    leading={
                      msg.sender === "assistant" ? (
                        <RayIcon
                          size="large"
                          color="surface.icon.onSea.onSubtle"
                        />
                      ) : undefined
                    }
                    validationState={msg.isError ? "error" : "none"}
                    errorText={
                      msg.isError
                        ? "Message not sent. Tap to retry."
                        : undefined
                    }
                    onClick={
                      msg.isError
                        ? () => handleRetry(msg.id, msg.text)
                        : undefined
                    }
                    footerActions={
                      msg.suggestions && msg.suggestions.length > 0 ? (
                        <SuggestedQuestionChips
                          questions={msg.suggestions}
                          onSelect={(q) => handleSendMessage(q)}
                        />
                      ) : undefined
                    }
                  >
                    <Text size="small">
                      {msg.text}
                    </Text>
                  </BladeChatMessage>

                  {/* Render Blade GenUI Cards if AI returned matched catalog products */}
                  {msg.sender === "assistant" &&
                    msg.matched_products &&
                    msg.matched_products.length > 0 && (
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap="spacing.3"
                        marginTop="spacing.2"
                        paddingLeft="spacing.3"
                      >
                        {msg.matched_products.slice(0, 3).map((prod) => (
                          <GenUIProductCard
                            key={prod.id || prod.sku || prod.name}
                            item={prod}
                            onAddToCart={handleAddToCartAndCheckout}
                          />
                        ))}
                      </Box>
                    )}

                  {msg.sender === "assistant" && msg.model_used && (
                    <Box paddingLeft="spacing.3">
                      <Text size="xsmall" color="surface.text.gray.subtle">
                        Live catalog · {msg.matched_products?.length || 0}{" "}
                        relevant{" "}
                        {msg.matched_products?.length === 1
                          ? "match"
                          : "matches"}
                      </Text>
                    </Box>
                  )}
                </Box>
              ))}

              {isTyping && (
                <BladeChatMessage
                  senderType="other"
                  isLoading
                  loadingText={THINKING_STEPS}
                  leading={
                    <RayIcon size="large" color="surface.icon.onSea.onSubtle" />
                  }
                  reasoningTraces={THINKING_STEPS.map((label) => ({ label }))}
                  reasoningStatus="loading"
                  reasoningTitle="Working on it"
                />
              )}
            </Box>

              {activeForm === "contact" && (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="spacing.3"
                  padding="spacing.3"
                  backgroundColor="surface.background.gray.intense"
                  borderRadius="medium"
                >
                  <Text size="small" weight="semibold">
                    Almost there — a few details to place your order
                  </Text>
                  <TextInput
                    label="Full name"
                    value={cf.name}
                    onChange={({ value }: any) => setCf((s) => ({ ...s, name: value || "" }))}
                  />
                  <TextInput
                    label="Email"
                    value={cf.email}
                    onChange={({ value }: any) => setCf((s) => ({ ...s, email: value || "" }))}
                  />
                  <TextInput
                    label="Phone"
                    value={cf.phone}
                    onChange={({ value }: any) => setCf((s) => ({ ...s, phone: value || "" }))}
                  />
                  <Button variant="primary" onClick={submitContact} isLoading={isTyping || isSubmitting}>
                    Continue to shipping
                  </Button>
                </Box>
              )}

              {activeForm === "shipping" && (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="spacing.3"
                  padding="spacing.3"
                  backgroundColor="surface.background.gray.intense"
                  borderRadius="medium"
                >
                  <Text size="small" weight="semibold">
                    Where should we deliver?
                  </Text>
                  <TextInput
                    label="Address"
                    value={sf.line1}
                    onChange={({ value }: any) => setSf((s) => ({ ...s, line1: value || "" }))}
                  />
                  <Box
                    display="grid"
                    gridTemplateColumns={{ base: "1fr", m: "1fr 1fr" }}
                    gap="spacing.3"
                  >
                    <TextInput
                      label="City"
                      value={sf.city}
                      onChange={({ value }: any) => setSf((s) => ({ ...s, city: value || "" }))}
                    />
                    <TextInput
                      label="State"
                      value={sf.state}
                      onChange={({ value }: any) => setSf((s) => ({ ...s, state: value || "" }))}
                    />
                  </Box>
                  <TextInput
                    label="Pincode"
                    value={sf.pincode}
                    onChange={({ value }: any) => setSf((s) => ({ ...s, pincode: value || "" }))}
                  />
                  <Button variant="primary" onClick={submitShipping} isLoading={isTyping || isSubmitting}>
                    Place order &amp; pay
                  </Button>
                </Box>
              )}

              {trackOrderId && (
                <Box display="flex" justifyContent="center" padding="spacing.2">
                  <Button
                    variant="primary"
                    icon={ShoppingCartIcon}
                    iconPosition="left"
                    onClick={() => router.push(`/store/track/${trackOrderId}`)}
                  >
                    Track order {trackOrderId.slice(0, 8).toUpperCase()}
                  </Button>
                </Box>
              )}

            {/* Bottom Composer */}
            <Box
              borderTopWidth="thin"
              borderTopColor="surface.border.gray.muted"
              paddingTop="spacing.3"
              marginTop="spacing.3"
            >
              <ChatInput
                placeholder="Ask about products, specs, or instant checkout..."
                value={inputValue}
                onChange={({ value }: any) => setInputValue(value || "")}
                onSubmit={({ value }: any) => {
                  handleSendMessage(value || inputValue);
                }}
                hideFileUpload={true}
                isGenerating={isTyping}
              />
            </Box>
          </Box>
        </DrawerBody>
      </Drawer>
    </BladeRoot>
  );
}
