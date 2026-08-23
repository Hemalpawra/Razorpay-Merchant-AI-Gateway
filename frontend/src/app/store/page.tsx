'use client';

import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  TextInput,
  // Icons
  SparklesIcon,
  ShoppingBagIcon,
  PackageIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SearchIcon,
  ZapIcon,
  ShieldIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function StoreHomePage() {
  const featuredProducts = [
    { id: '1', name: 'Asus TUF F15 Gaming Laptop', price: '₹54,999', category: 'Gaming', desc: 'Core i5 11th Gen, 16GB RAM, RTX 3050, 144Hz FHD', sku: 'ASUS-TUF-F15' },
    { id: '2', name: 'Lenovo IdeaPad Gaming 3', price: '₹56,990', category: 'Gaming', desc: 'AMD Ryzen 5 5600H, 8GB RAM, RTX 3050, 512GB SSD', sku: 'LEN-IPG3' },
    { id: '3', name: 'Wireless Mechanical Keyboard', price: '₹4,499', category: 'Accessories', desc: 'Hot-swappable RGB mechanical switches', sku: 'MK-100' },
    { id: '4', name: 'Wireless Noise Cancelling Earbuds', price: '₹1,999', category: 'Audio', desc: 'Active Noise Cancellation, 30h battery life', sku: 'WE-100' },
  ];

  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.8">

      {/* Hero Banner with AI Focus */}
      <Card elevation="none" backgroundColor={"surface.background.primary.subtle" as any}>
        <CardBody>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" padding="spacing.8" gap="spacing.4">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <SparklesIcon size="medium" color="interactive.icon.primary.normal" />
              <Badge color="information" size="medium">Agentic Commerce Enabled</Badge>
            </Box>

            <Heading size="2xlarge" weight="semibold">
              Buy directly with Human or AI Assistant
            </Heading>

            <Box maxWidth="640px">
              <Text size="medium" color="surface.text.gray.muted">
                Welcome to Acme Electronics! Talk to our Merchant AI to ask questions, compare specs, get price-locked quotes, or place orders instantly via Razorpay.
              </Text>
            </Box>

            <Box display="flex" gap="spacing.4" marginTop="spacing.2">
              <Link href="/store/products" style={{ textDecoration: 'none' }}>
                <Button variant="primary" icon={ShoppingBagIcon} iconPosition="left">
                  Browse Products
                </Button>
              </Link>
              <Link href="/store/checkout?orderId=ORD-10231" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" icon={ZapIcon} iconPosition="left">
                  Demo Quick Checkout
                </Button>
              </Link>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Categories Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="large" weight="semibold">Featured Products</Heading>
        <Link href="/store/products" style={{ textDecoration: 'none' }}>
          <Button variant="tertiary" icon={ArrowRightIcon} iconPosition="right">
            View All Products
          </Button>
        </Link>
      </Box>

      {/* Product Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(4,1fr)' }}
        gap="spacing.6"
      >
        {featuredProducts.map((p) => (
          <Card key={p.id} elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.3" height="100%">
                <Box
                  height="160px"
                  borderRadius="small"
                  backgroundColor="surface.background.gray.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <PackageIcon size="large" color="surface.icon.gray.subtle" />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Badge color="neutral" size="small">{p.category}</Badge>
                  <Text size="xsmall" color="surface.text.gray.muted">SKU: {p.sku}</Text>
                </Box>

                <Heading size="small" weight="semibold">{p.name}</Heading>
                <Text size="xsmall" color="surface.text.gray.subtle" truncateAfterLines={2}>{p.desc}</Text>

                <Box marginTop="auto" paddingTop="spacing.3" display="flex" justifyContent="space-between" alignItems="center">
                  <Heading size="medium" weight="semibold" color="interactive.text.primary.normal">{p.price}</Heading>
                  <Link href={`/store/checkout?product=${encodeURIComponent(p.name)}&price=${encodeURIComponent(p.price)}`} style={{ textDecoration: 'none' }}>
                    <Button variant="primary" size="small">
                      Buy Now
                    </Button>
                  </Link>
                </Box>
              </Box>
            </CardBody>
          </Card>
        ))}
      </Box>

      {/* Trust & Buildathon Journey Banner */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.6">
            <Box display="flex" alignItems="flex-start" gap="spacing.3">
              <ShieldIcon size="medium" color="interactive.icon.positive.normal" />
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="small" weight="semibold">Razorpay Checkout</Text>
                <Text size="xsmall" color="surface.text.gray.muted">100% secure payment gateway with instant verification.</Text>
              </Box>
            </Box>

            <Box display="flex" alignItems="flex-start" gap="spacing.3">
              <SparklesIcon size="medium" color="interactive.icon.primary.normal" />
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="small" weight="semibold">AI & Human Transactable</Text>
                <Text size="xsmall" color="surface.text.gray.muted">Supports buyer AI assistants (ChatGPT, Claude) & humans.</Text>
              </Box>
            </Box>

            <Box display="flex" alignItems="flex-start" gap="spacing.3">
              <CheckCircleIcon size="medium" color="interactive.icon.positive.normal" />
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="small" weight="semibold">Audit Logged & Tracked</Text>
                <Text size="xsmall" color="surface.text.gray.muted">Every event logged to Audit Trail with dummy shipping simulation.</Text>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>

    </Box>
  );
}
