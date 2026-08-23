'use client';

import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Badge,
  // Icons
  ShoppingBagIcon,
  SearchIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';
import { AIChatWidget } from './components/AIChatWidget';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box minHeight="100vh" backgroundColor="surface.background.gray.subtle" display="flex" flexDirection="column">
      {/* Top Black Razorpay Header */}
      <Box
        height="56px"
        backgroundColor="surface.background.gray.intense"
        borderBottomWidth="thin"
        borderBottomColor="surface.border.gray.muted"
        paddingX="spacing.8"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        zIndex={100}
      >
        <Box display="flex" alignItems="center" gap="spacing.4">
          <Link href="/store" style={{ textDecoration: 'none' }}>
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Heading size="small" weight="semibold" color="interactive.text.primary.normal">
                Acme Electronics
              </Heading>
              <Badge color="information" size="small">AI Enabled Store</Badge>
            </Box>
          </Link>
          <Text size="xsmall" color="surface.text.gray.muted">|</Text>
          <Text size="xsmall" color="surface.text.gray.subtle">Powered by Razorpay Buildathon</Text>
        </Box>

        <Box display="flex" alignItems="center" gap="spacing.4">
          <Link href="/store/products" style={{ textDecoration: 'none' }}>
            <Text size="small" weight="semibold" color="surface.text.gray.normal">Products Catalog</Text>
          </Link>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="small">Merchant Dashboard</Button>
          </Link>
          <Link href="/store/cart" style={{ textDecoration: 'none' }}>
            <Button variant="tertiary" size="small" icon={ShoppingBagIcon} iconPosition="left">
              Cart (1)
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Store Body */}
      <Box flex={1}>
        {children}
      </Box>

      {/* Floating AI Chat Assistant Drawer */}
      <AIChatWidget />

      {/* Store Footer */}
      <Box
        padding="spacing.6"
        backgroundColor="surface.background.gray.intense"
        borderTopWidth="thin"
        borderTopColor="surface.border.gray.muted"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text size="xsmall" color="surface.text.gray.muted">
          © 2025 Acme Electronics • Razorpay Agentic Commerce Track 01 Demo
        </Text>
        <Box display="flex" gap="spacing.3">
          <Link href="/dashboard/orders" style={{ textDecoration: 'none' }}>
            <Text size="xsmall" color="interactive.text.primary.normal">View Orders (Merchant View)</Text>
          </Link>
          <Text size="xsmall" color="surface.text.gray.muted">•</Text>
          <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
            <Text size="xsmall" color="interactive.text.primary.normal">View Audit Log</Text>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
