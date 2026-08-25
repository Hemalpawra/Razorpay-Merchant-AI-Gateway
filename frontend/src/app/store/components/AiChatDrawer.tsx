'use client';

import React, { useEffect, useRef, useState } from "react";
import {
  Amount,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  ChatInput,
  ChatMessage as BladeChatMessage,
  Chip,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  EmptyState,
  Heading,
  Indicator,
  ShoppingCartIcon,
  SparklesIcon,
  Text
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { type Product } from "@/lib/store/catalog";
import { AgentToAgentModal } from "@/components/AgentToAgentModal";

type ChatMessageItem = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  matched_products?: any[];
  model_used?: string;
};

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  product?: Product | undefined;
};

function getCurrentTimeString() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function GenUIProductCard({
  item,
  onAddToCart,
}: {
  item: any;
  onAddToCart: (item: any) => void;
}) {
  return (
    <Card elevation="none" backgroundColor="surface.background.gray.intense">
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Badge color="positive" size="small">AI Catalog Match</Badge>
            <Text size="xsmall" color="surface.text.gray.muted">In Stock</Text>
          </Box>

          <Text size="medium" weight="semibold">{item.name}</Text>
          <Text size="xsmall" color="surface.text.gray.subtle" truncateAfterLines={2}>
            {item.description || 'High performance item ready for instant order.'}
          </Text>

          <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="spacing.2">
            <Amount value={item.price} currency="INR" size="medium" />
            <Button
              variant="primary"
              size="small"
              icon={ShoppingCartIcon}
              iconPosition="left"
              onClick={() => onAddToCart(item)}
            >
              Add &amp; Checkout
            </Button>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}

export default function AiChatDrawer({ isOpen, onDismiss, product }: Props) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showA2AModal, setShowA2AModal] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessageItem = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: getCurrentTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          session_id: sessionId,
          history: messages,
          merchant_id: 'm_demo_101'
        })
      });

      const data = await response.json();
      if (data.session_id) setSessionId(data.session_id);

      const aiMsg: ChatMessageItem = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I found matching products in our catalog.',
        timestamp: getCurrentTimeString(),
        matched_products: data.matched_products || [],
        model_used: data.model_used || 'openrouter/free'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      const fallbackMsg: ChatMessageItem = {
        id: `ai_err_${Date.now()}`,
        sender: 'assistant',
        text: 'Connected to Razorpay Merchant AI Gateway. Showing available catalog options.',
        timestamp: getCurrentTimeString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddToCartAndCheckout = (item: any) => {
    alert(`Added ${item.name} (₹${item.price}) to checkout! Razorpay Order ready.`);
    onDismiss();
  };

  return (
    <BladeRoot>
      <Drawer isOpen={isOpen} onDismiss={onDismiss}>
        <DrawerHeader
          title="Merchant AI Shopping Assistant"
          subtitle="Powered by OpenRouter Free Models &amp; Razorpay AI Gateway"
        />
        <DrawerBody>
          <Box display="flex" flexDirection="column" height="100%" gap="spacing.4">
            
            {/* Header Banner */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Indicator color="positive" size="medium" />
                <Text size="xsmall" weight="semibold">AI Gateway Active</Text>
              </Box>
              <Button
                variant="tertiary"
                size="small"
                icon={SparklesIcon}
                iconPosition="left"
                onClick={() => setShowA2AModal(true)}
              >
                A2A Gateway Simulator
              </Button>
            </Box>

            <Divider />

            {/* Scrollable Message List */}
            <Box flex={1} overflow="auto" display="flex" flexDirection="column" gap="spacing.4" ref={scrollRef}>
              
              {messages.length === 0 ? (
                <EmptyState
                  title="Ask your AI Assistant"
                  description="Ask for noise-cancelling headphones, gaming laptops, specs comparisons, or instant Razorpay checkout links."
                />
              ) : (
                messages.map((msg) => (
                  <Box key={msg.id} display="flex" flexDirection="column" gap="spacing.2">
                    <BladeChatMessage
                      senderType={msg.sender === 'user' ? 'self' : 'other'}
                    >
                      <Text size="small">{msg.text}</Text>
                    </BladeChatMessage>

                    {/* Render Blade GenUI Cards if AI returned matched catalog products */}
                    {msg.sender === 'assistant' && msg.matched_products && msg.matched_products.length > 0 && (
                      <Box display="flex" flexDirection="column" gap="spacing.3" marginTop="spacing.2">
                        {msg.matched_products.map((prod: any) => (
                          <GenUIProductCard
                            key={prod.id || prod.sku}
                            item={prod}
                            onAddToCart={handleAddToCartAndCheckout}
                          />
                        ))}
                      </Box>
                    )}

                    {msg.sender === 'assistant' && msg.model_used && (
                      <Text size="xsmall" color="surface.text.gray.subtle">
                        Model: {msg.model_used}
                      </Text>
                    )}
                  </Box>
                ))
              )}

              {isTyping && (
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Indicator color="notice" size="small" />
                  <Text size="xsmall" color="surface.text.gray.muted">AI is thinking...</Text>
                </Box>
              )}
            </Box>

            {/* Quick Sample Action Chips */}
            <Box display="flex" gap="spacing.2" overflow="auto" paddingY="spacing.1">
              {['Headphones under ₹5,000', 'Compare Asus TUF vs Acer Nitro', 'Gaming Laptops'].map((promptText) => (
                <div key={promptText} onClick={() => handleSendMessage(promptText)} style={{ cursor: 'pointer' }}>
                  <Chip>{promptText}</Chip>
                </div>
              ))}
            </Box>

            {/* Blade ChatInput Component */}
            <Box borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <ChatInput
                  placeholder="Ask about products, specs, or instant checkout..."
                  value={inputValue}
                  onChange={({ value }: any) => setInputValue(value || '')}
                />
              </form>
            </Box>

          </Box>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="secondary" onClick={onDismiss} isFullWidth>Close Assistant</Button>
        </DrawerFooter>
      </Drawer>

      {/* Agent-to-Agent Simulator Modal */}
      <AgentToAgentModal
        isOpen={showA2AModal}
        onDismiss={() => setShowA2AModal(false)}
        onSelectProductForCheckout={handleAddToCartAndCheckout}
      />
    </BladeRoot>
  );
}
