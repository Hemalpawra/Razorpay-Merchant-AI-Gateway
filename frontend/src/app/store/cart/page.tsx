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
  IconButton,
  // Icons
  ShoppingBagIcon,
  PackageIcon,
  ArrowRightIcon,
  TrashIcon,
  ShieldIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function CartPage() {
  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6">

      <Heading size="2xlarge" weight="semibold">Shopping Cart</Heading>

      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '2fr 1fr' }} gap="spacing.6">

        {/* Cart Item */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap="spacing.4">
                <Box
                  width="64px" height="64px" borderRadius="small"
                  backgroundColor="surface.background.gray.subtle"
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <PackageIcon size="large" color="surface.icon.gray.subtle" />
                </Box>
                <Box display="flex" flexDirection="column" gap="spacing.1">
                  <Heading size="small" weight="semibold">Asus TUF F15 Gaming Laptop</Heading>
                  <Text size="xsmall" color="surface.text.gray.muted">SKU: ASUS-TUF-F15 • Core i5 / 16GB / RTX 3050</Text>
                  <Badge color="positive" size="small">In Stock • AI Price Lock</Badge>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap="spacing.4">
                <Heading size="medium" weight="semibold" color="interactive.text.primary.normal">₹54,999</Heading>
                <IconButton icon={TrashIcon} accessibilityLabel="Remove item" size="small" onClick={() => {}} />
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Summary Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Heading size="medium" weight="semibold">Order Summary</Heading>

              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Subtotal</Text>
                  <Text size="small" weight="semibold">₹54,999</Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Shipping</Text>
                  <Text size="small" weight="semibold" color="interactive.text.positive.normal">FREE</Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Taxes (GST 18%)</Text>
                  <Text size="small" weight="semibold">Included</Text>
                </Box>
              </Box>

              <Box borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3" display="flex" justifyContent="space-between">
                <Heading size="small" weight="semibold">Total Amount</Heading>
                <Heading size="medium" weight="semibold" color="interactive.text.primary.normal">₹54,999</Heading>
              </Box>

              <Link href="/store/checkout?orderId=ORD-10231" style={{ textDecoration: 'none' }}>
                <Button variant="primary" isFullWidth icon={ArrowRightIcon} iconPosition="right">
                  Proceed to Razorpay Checkout
                </Button>
              </Link>
            </Box>
          </CardBody>
        </Card>

      </Box>

    </Box>
  );
}
