'use client';

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  IconButton,
  TextInput,
  Tabs,
  TabList,
  TabItem,
  // Icons
  SparklesIcon,
  CloseIcon,
  SendIcon,
  PackageIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ZapIcon,
  InfoIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

type ProductOption = { name: string; price: string; sku: string; desc: string };

type ChatMsg = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  products?: ProductOption[];
  orderCreated?: { orderId: string; amount: string; product: string };
};

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your Merchant AI assistant. I can help you find products, answer questions, compare models, and create your order directly!',
      time: 'Just now',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const userText = inputMsg.trim();
    if (!userText || isLoading) return;

    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: userText,
      time: 'Just now',
    };
    const history = messages.map((message) => ({ sender: message.sender, text: message.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history, mode: 'customer' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to reach the store assistant');

      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: result.reply,
        time: 'Just now',
        products: (result.matched_products || []).map((product: any) => ({
          name: product.name,
          price: `₹${Number(product.price).toLocaleString('en-IN')}`,
          sku: product.sku,
          desc: product.description || `${product.category} · ${product.stock} in stock`,
        })),
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: error instanceof Error ? error.message : 'The store assistant is temporarily unavailable.',
        time: 'Just now',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Box position="fixed" bottom="spacing.6" right="spacing.6" zIndex={999}>
          <Button
            variant="primary"
            size="large"
            icon={SparklesIcon}
            iconPosition="left"
            onClick={() => setIsOpen(true)}
          >
            Chat with Merchant AI
          </Button>
        </Box>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <Box
          position="fixed"
          bottom="spacing.6"
          right="spacing.6"
          width={{ base: '90%', m: '420px' }}
          height="580px"
          backgroundColor="surface.background.gray.intense"
          borderRadius="medium"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          display="flex"
          flexDirection="column"
          zIndex={1000}
        >
          {/* Header */}
          <Box
            padding="spacing.4"
            backgroundColor="surface.background.gray.subtle"
            borderBottomWidth="thin"
            borderBottomColor="surface.border.gray.muted"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Box
                width="28px" height="28px" borderRadius="round"
                backgroundColor="surface.background.primary.subtle"
                display="flex" alignItems="center" justifyContent="center"
              >
                <SparklesIcon size="small" color="interactive.icon.primary.normal" />
              </Box>
              <Box display="flex" flexDirection="column">
                <Text size="small" weight="semibold">Merchant AI Store Assistant</Text>
                <Text size="xsmall" color="interactive.text.positive.normal">● Online • Powered by Razorpay</Text>
              </Box>
            </Box>
            <IconButton icon={CloseIcon} accessibilityLabel="Close chat" size="small" onClick={() => setIsOpen(false)} />
          </Box>

          {/* Messages Body */}
          <Box flex={1} padding="spacing.4" overflow="auto" display="flex" flexDirection="column" gap="spacing.3">
            {messages.map((m) => (
              <Box key={m.id}>
                {m.sender === 'user' ? (
                  <Box display="flex" justifyContent="flex-end">
                    <Box
                      backgroundColor="surface.background.primary.intense"
                      padding="spacing.3"
                      borderRadius="medium"
                      maxWidth="80%"
                    >
                      <Text size="small" color="surface.text.staticWhite.normal">{m.text}</Text>
                    </Box>
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Box display="flex" gap="spacing.2" alignItems="flex-start">
                      <Box
                        width="24px" height="24px" borderRadius="round"
                        backgroundColor="surface.background.primary.subtle"
                        display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                      >
                        <SparklesIcon size="xsmall" color="interactive.icon.primary.normal" />
                      </Box>
                      <Card elevation="none" backgroundColor="surface.background.gray.subtle">
                        <CardBody>
                          <Text size="small">{m.text}</Text>
                        </CardBody>
                      </Card>
                    </Box>

                    {/* Inline Products */}
                    {m.products && (
                      <Box display="flex" flexDirection="column" gap="spacing.2" marginLeft="spacing.6">
                        {m.products.map((p) => (
                          <Card key={p.sku} elevation="none" backgroundColor="surface.background.gray.subtle">
                            <CardBody>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" flexDirection="column">
                                  <Text size="small" weight="semibold">{p.name}</Text>
                                  <Text size="xsmall" color="surface.text.gray.muted">{p.desc}</Text>
                                  <Text size="small" weight="semibold" color="interactive.text.primary.normal" marginTop="spacing.1">{p.price}</Text>
                                </Box>
                                <Button
                                  variant="secondary"
                                  size="small"
                                  onClick={() => {
                                    setInputMsg(`I want to buy ${p.name}`);
                                  }}
                                >
                                  Buy Now
                                </Button>
                              </Box>
                            </CardBody>
                          </Card>
                        ))}
                      </Box>
                    )}

                    {/* Order Created CTA */}
                    {m.orderCreated && (
                      <Box marginLeft="spacing.6" marginTop="spacing.1">
                        <Card elevation="none" backgroundColor={"surface.background.primary.subtle" as any}>
                          <CardBody>
                            <Box display="flex" flexDirection="column" gap="spacing.2">
                              <Box display="flex" alignItems="center" gap="spacing.2">
                                <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
                                <Text size="small" weight="semibold">Razorpay Order Ready</Text>
                              </Box>
                              <Text size="xsmall" color="surface.text.gray.muted">
                                Order {m.orderCreated.orderId} created for {m.orderCreated.product} ({m.orderCreated.amount}).
                              </Text>
                              <Link href={`/store/checkout?orderId=${m.orderCreated.orderId}`} style={{ textDecoration: 'none' }}>
                                <Button variant="primary" isFullWidth icon={ArrowRightIcon} iconPosition="right">
                                  Proceed to Razorpay Checkout
                                </Button>
                              </Link>
                            </Box>
                          </CardBody>
                        </Card>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* Footer Input */}
          <Box
            padding="spacing.3"
            backgroundColor="surface.background.gray.subtle"
            borderTopWidth="thin"
            borderTopColor="surface.border.gray.muted"
            display="flex"
            alignItems="center"
            gap="spacing.2"
          >
            <Box flex={1}>
              <TextInput
                label=""
                accessibilityLabel="Chat input"
                placeholder="Ask about products, gaming laptops, or prices..."
                value={inputMsg}
                onChange={({ value }) => setInputMsg(value || '')}
              />
            </Box>
            <IconButton icon={SendIcon} accessibilityLabel="Send message" size="medium" onClick={handleSend} />
          </Box>
        </Box>
      )}
    </>
  );
}
