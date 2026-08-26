'use client';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Amount,
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  Divider,
  Spinner,
  CheckCircleIcon,
  DownloadIcon,
  PackageIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type OrderItem = {
  id: string;
  sku: string;
  name: string;
  image_url: string | null;
  unit_price: number;
  qty: number;
  line_total: number;
};

type Invoice = {
  invoice_number: string;
  grand_total: number;
};

type OrderRecord = {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  currency: string;
  status: string;
  order_items: OrderItem[];
  invoices: Invoice[];
};

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || '';

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }
    fetch(`/api/orders?order_id=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.orders || data.orders.length === 0) {
          throw new Error(data.error || 'Order not found');
        }
        setOrder(data.orders[0]);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [orderId]);

  if (status === 'loading') {
    return (
      <Box padding="spacing.8" display="flex" justifyContent="center">
        <Spinner accessibilityLabel="Loading order" />
      </Box>
    );
  }

  if (status === 'error' || !order) {
    return (
      <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.4" maxWidth="700px" marginX="auto">
        <Alert
          color="negative"
          isFullWidth
          title="Order not found"
          description="We couldn't find this order. If you just completed a payment, please check your email for a confirmation, or contact support."
        />
        <Link href="/store" style={{ textDecoration: 'none' }}>
          <Button variant="secondary">Back to Store</Button>
        </Link>
      </Box>
    );
  }

  const invoice = order.invoices?.[0];
  const items = order.order_items ?? [];
  const isPaid = order.status === 'paid';

  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6" maxWidth="800px" marginX="auto">
      {/* Success / Pending Hero */}
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

            <Heading size="2xlarge" weight="semibold">
              {isPaid ? 'Payment Successful!' : 'Order Received'}
            </Heading>
            <Text size="medium" color="surface.text.gray.muted">
              {isPaid
                ? 'Thank you! Your payment has been verified and your order is confirmed.'
                : 'Your order is being processed. We will confirm once payment is verified.'}
            </Text>

            <Badge color={isPaid ? 'positive' : 'information'} size="medium">
              {isPaid ? 'Razorpay Payment Verified' : order.status}
            </Badge>
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
                <Text size="small" weight="semibold">{order.id}</Text>
              </Box>

              <Divider />

              {items.map((item) => (
                <Box key={item.id} display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">{`${item.name} x${item.qty}`}</Text>
                  <Amount value={item.line_total} size="small" suffix="none" />
                </Box>
              ))}

              <Divider />

              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Subtotal</Text>
                <Amount value={order.subtotal} size="small" suffix="none" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Shipping</Text>
                <Amount value={order.shipping_amount} size="small" suffix="none" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Tax (GST)</Text>
                <Amount value={order.tax_amount} size="small" suffix="none" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" weight="semibold">Amount Paid</Text>
                <Amount value={order.amount} size="small" weight="semibold" color="interactive.text.primary.normal" suffix="none" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Payment Method</Text>
                <Text size="small" weight="semibold">Razorpay</Text>
              </Box>

              {invoice && (
                <Box borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3" display="flex" gap="spacing.2">
                  <Button variant="secondary" isFullWidth icon={DownloadIcon} iconPosition="left" isDisabled>
                    {`Tax Invoice (${invoice.invoice_number})`}
                  </Button>
                </Box>
              )}
            </Box>
          </CardBody>
        </Card>

        {/* Shipment Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Heading size="medium" weight="semibold">Shipment</Heading>
              <Text size="xsmall" color="surface.text.gray.muted">
                {isPaid
                  ? 'Your order has been confirmed and is being prepared for dispatch.'
                  : 'Shipment tracking will be available once payment is confirmed.'}
              </Text>

              <Link href={`/store/track/${order.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" isFullWidth icon={PackageIcon} iconPosition="left">
                  Track Shipment
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
