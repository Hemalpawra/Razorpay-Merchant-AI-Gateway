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
  TextInput,
  Alert,
  // Icons
  ShieldIcon,
  CheckCircleIcon,
  ZapIcon,
  CopyIcon,
  ArrowRightIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState('Hemal');
  const [email, setEmail] = useState('hemal@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('123 Tech Park, Indiranagar, Bengaluru, KA 560038');

  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6" maxWidth="1000px" marginX="auto">

      {/* Test Mode Banner */}
      <Alert
        color="information"
        title="Razorpay Test Mode Checkout Simulation"
        description="This checkout is running in Razorpay Test Mode. Completing this purchase will generate an authentic Razorpay Order ID, emit payment events, and create dummy shipment tracking."
      />

      <Heading size="2xlarge" weight="semibold">Razorpay Secure Checkout</Heading>

      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '1.4fr 1fr' }} gap="spacing.6">

        {/* Form Details */}
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Heading size="medium" weight="semibold">Shipping & Customer Information</Heading>

                <TextInput
                  label="Full Name"
                  value={name}
                  onChange={({ value }) => setName(value || '')}
                />

                <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.4">
                  <TextInput
                    label="Email Address"
                    value={email}
                    onChange={({ value }) => setEmail(value || '')}
                  />

                  <TextInput
                    label="Phone Number"
                    value={phone}
                    onChange={({ value }) => setPhone(value || '')}
                  />
                </Box>

                <TextInput
                  label="Delivery Shipping Address"
                  value={address}
                  onChange={({ value }) => setAddress(value || '')}
                />
              </Box>
            </CardBody>
          </Card>

          {/* Payment Method Selector */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.3">
                <Heading size="medium" weight="semibold">Payment Gateway (Razorpay)</Heading>

                <Box
                  padding="spacing.4"
                  borderRadius="small"
                  backgroundColor="surface.background.primary.subtle"
                  borderWidth="thin"
                  borderColor="surface.border.primary.normal"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center" gap="spacing.3">
                    <ShieldIcon size="medium" color="interactive.icon.primary.normal" />
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Razorpay UPI & Cards Checkout</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Instant authorization via Razorpay Test SDK</Text>
                    </Box>
                  </Box>
                  <Badge color="positive" size="small">Selected</Badge>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Summary Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Heading size="medium" weight="semibold">Order Summary</Heading>

              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Razorpay Order ID</Text>
                  <Text size="xsmall" weight="semibold" color="interactive.text.primary.normal">ORD-10231</Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Product</Text>
                  <Text size="small" weight="semibold">Asus TUF F15</Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Source</Text>
                  <Badge color="positive" size="small">Merchant AI</Badge>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Amount</Text>
                  <Text size="small" weight="semibold">₹54,999</Text>
                </Box>
              </Box>

              <Box borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3" display="flex" justifyContent="space-between">
                <Heading size="small" weight="semibold">Total Payable</Heading>
                <Heading size="medium" weight="semibold" color="interactive.text.primary.normal">₹54,999</Heading>
              </Box>

              <Link href="/store/order-success/ORD-10231" style={{ textDecoration: 'none' }}>
                <Button variant="primary" isFullWidth icon={CheckCircleIcon} iconPosition="left">
                  Pay ₹54,999 via Razorpay
                </Button>
              </Link>

              <Text size="xsmall" color="surface.text.gray.subtle" textAlign="center">
                By clicking pay, you authorize Razorpay to process this test transaction.
              </Text>
            </Box>
          </CardBody>
        </Card>

      </Box>

    </Box>
  );
}
