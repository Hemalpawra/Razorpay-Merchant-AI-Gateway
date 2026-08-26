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
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { type Product } from "@/lib/store/catalog";

type MatchedProduct = {
  id?: string;
  sku?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
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
  return (
    <Card elevation="none" backgroundColor="surface.background.gray.intense">
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Badge color="positive" size="small">
              AI Catalog Match
            </Badge>
            <Text
              size="xsmall"
              color={
                (item.stock ?? 0) > 0
                  ? "surface.text.gray.muted"
                  : "surface.text.gray.subtle"
              }
            >
              {(item.stock ?? 0) > 0
                ? `In stock · ${item.stock}`
                : "Currently unavailable"}
            </Text>
          </Box>

          <Text size="medium" weight="semibold">
            {item.name}
          </Text>
          {item.description && (
            <Text
              size="xsmall"
              color="surface.text.gray.subtle"
              truncateAfterLines={2}
            >
              {item.description}
            </Text>
          )}

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginTop="spacing.2"
          >
            <Amount value={item.price} currency="INR" size="medium" />
            <Button
              variant="primary"
              size="small"
              icon={ShoppingCartIcon}
              iconPosition="left"
              onClick={() => onAddToCart(item)}
              isDisabled={(item.stock ?? 0) <= 0}
            >
              Add &amp; Checkout
            </Button>
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
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    INITIAL_WELCOME_MESSAGE,
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

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

  const handleAddToCartAndCheckout = (item: MatchedProduct) => {
    onDismiss();
    router.push(
      `/store/checkout?sku=${encodeURIComponent(item.sku || item.name)}`,
    );
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
                    <Text size="small" whiteSpace="pre-line">
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
