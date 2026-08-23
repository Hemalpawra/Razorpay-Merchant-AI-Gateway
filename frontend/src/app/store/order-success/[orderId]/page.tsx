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
  // Icons
  CheckCircleIcon,
  DownloadIcon,
  PackageIcon,
  FileTextIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const orderId = params?.orderId || 'ORD-10231';

  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6" maxWidth="800px" marginX="auto">

      {/* Success Hero */}
      <Card elevation="none" backgroundColor={"surface.background.primary.subtle" as any}>
        <CardBody>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" padding="spacing.6" gap="spacing.3">
            <Box
              width="48px" height="48px" borderRadius="round"
              backgroundColor="surface.background.sea.subtle"
              display="flex" alignItems="center" justifyContent="center"
            >
              <CheckCircleIcon size="large" color="interactive.icon.positive.normal" />
            </Box>

            <Heading size="2xlarge" weight="semibold">Payment Successful!</Heading>
            <Text size="medium" color="surface.text.gray.muted">
              Thank you! Your order <Text as="span" size="medium" weight="semibold">{orderId}</Text> has been created & authorized via Razorpay.
            </Text>

            <Badge color="positive" size="medium">Razorpay Order Verified • Invoice Generated</Badge>
          </Box>
        </CardBody>
      </Card>

      {/* Details Grid */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.6">

        {/* Order Details */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Heading size="medium" weight="semibold">Order Summary</Heading>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Order ID</Text>
                <Text size="small" weight="semibold">{orderId}</Text>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Product</Text>
                <Text size="small" weight="semibold">Asus TUF F15</Text>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Amount Paid</Text>
                <Text size="small" weight="semibold" color="interactive.text.primary.normal">₹54,999</Text>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Payment Method</Text>
                <Text size="small" weight="semibold">Razorpay UPI</Text>
              </Box>

              <Box borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3" display="flex" gap="spacing.2">
                <Button variant="secondary" isFullWidth icon={DownloadIcon} iconPosition="left">
                  Download Tax Invoice (INV-22991)
                </Button>
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Dummy Shipping Tracker Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Heading size="medium" weight="semibold">Shipping Simulation Status</Heading>
              <Text size="xsmall" color="surface.text.gray.muted">Live status updates generated for Buildathon demonstration:</Text>

              <Box display="flex" flexDirection="column" gap="spacing.2" paddingLeft="spacing.2" borderLeftWidth="thick" borderLeftColor="surface.border.primary.normal">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Box width="10px" height="10px" borderRadius="round" backgroundColor="surface.background.sea.intense" />
                  <Text size="xsmall" weight="semibold">Preparing Order</Text>
                </Box>
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Box width="10px" height="10px" borderRadius="round" backgroundColor="surface.background.sea.intense" />
                  <Text size="xsmall" weight="semibold">Packed at Hub</Text>
                </Box>
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Box width="10px" height="10px" borderRadius="round" backgroundColor="surface.background.gray.subtle" />
                  <Text size="xsmall" color="surface.text.gray.muted">Shipped</Text>
                </Box>
              </Box>

              <Link href={`/store/track/${orderId}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" isFullWidth icon={PackageIcon} iconPosition="left">
                  Track Live Shipment
                </Button>
              </Link>
            </Box>
          </CardBody>
        </Card>

      </Box>

      {/* Navigation Buttons */}
      <Box display="flex" justifyContent="center" gap="spacing.4">
        <Link href="/store" style={{ textDecoration: 'none' }}>
          <Button variant="tertiary">Continue Shopping</Button>
        </Link>
        <Link href="/dashboard/orders" style={{ textDecoration: 'none' }}>
          <Button variant="secondary">View Merchant Dashboard</Button>
        </Link>
      </Box>

    </Box>
  );
}
