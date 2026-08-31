'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  Divider,
  Spinner,
  Alert,
  PackageIcon,
  FileTextIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { TrackingTimeline } from '@/app/dashboard/components/TrackingTimeline';

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

type CustomerDetail = {
  full_name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
};

type OrderRecord = {
  id: string;
  created_at: string;
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
  customer_details: CustomerDetail[];
  refund_status?: string | null;
  refund_amount?: number | null;
  refunded_at?: string | null;
  tracking_stage?: string | null;
};

function Amount({ value, size }: { value: number; size: 'small' | 'xsmall' | 'medium' }) {
  return (
    <Text size={size} weight="semibold" color="interactive.text.primary.normal">
      {`₹${value.toLocaleString('en-IN')}`}
    </Text>
  );
}

export default function TrackShipmentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = (params?.orderId as string) || '';
  const verified = searchParams.get('verified') === 'true';

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [trackingStage, setTrackingStage] = useState<'preparing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered'>('preparing');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      setError('Order ID is required');
      return;
    }

    fetch(`/api/orders?order_id=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.orders || data.orders.length === 0) {
          throw new Error(data.error || 'Order not found');
        }

        const orderData = data.orders[0];
        setOrder(orderData);

        if (orderData.tracking_stage) {
          setTrackingStage(orderData.tracking_stage as any);
        } else {
          const now = new Date();
          const createdAt = new Date(orderData.created_at);
          const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

          if (hoursDiff > 72) setTrackingStage('delivered');
          else if (hoursDiff > 48) setTrackingStage('out_for_delivery');
          else if (hoursDiff > 24) setTrackingStage('shipped');
          else if (hoursDiff > 6) setTrackingStage('packed');
          else setTrackingStage('preparing');
        }

        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message || 'Failed to load order');
        setStatus('error');
      });
  }, [orderId, verified]);

  useEffect(() => {
    if (order && status === 'ready') {
      const interval = setInterval(() => {
        fetch(`/api/orders?order_id=${encodeURIComponent(orderId)}`)
          .then((res) => res.json())
          .then((data) => {
            if (!data.error && data.orders?.[0]?.tracking_stage) {
              setTrackingStage(data.orders[0].tracking_stage as any);
            }
          })
          .catch(console.error);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [order, status, orderId]);

  if (status === 'loading') {
    return (
      <Box padding="spacing.8" display="flex" justifyContent="center">
        <Spinner accessibilityLabel="Loading tracking" />
      </Box>
    );
  }

  if (status === 'error' || !order) {
    return (
      <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.4" maxWidth="700px" marginX="auto">
        <Alert
          color="negative"
          title="Order not found"
          description={error || "We couldn't find this order. Please check your order ID and contact information."}
        />
        <Link href="/store/track" style={{ textDecoration: 'none' }}>
          <Button variant="secondary">Back to Track Order</Button>
        </Link>
      </Box>
    );
  }

  const currentStageIndex = ['preparing', 'packed', 'shipped', 'out_for_delivery', 'delivered'].indexOf(trackingStage);

  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6" maxWidth="800px" marginX="auto">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Shipment Tracking</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Tracking order <Text as="span" size="small" weight="semibold">{order.id}</Text>
          </Text>
        </Box>
        <Badge
          color={trackingStage === 'delivered' ? 'positive' : trackingStage === 'out_for_delivery' ? 'notice' : 'information'}
          size="medium"
        >
          {trackingStage.replace('_', ' ').toUpperCase()}
        </Badge>
      </Box>

      {/* Tracking Card */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.6">
            {/* Order Info */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap="spacing.3">
                <PackageIcon size="medium" color="interactive.icon.primary.normal" />
                <Box display="flex" flexDirection="column">
                  {order.order_items?.[0] && (
                    <>
                      <Text size="small" weight="semibold">{order.order_items[0].name}</Text>
                      {order.order_items.length > 1 && (
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {`and ${order.order_items.length - 1} more item${order.order_items.length > 2 ? 's' : ''}`}
                        </Text>
                      )}
                    </>
                  )}
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {`Courier: Express Logistics • Tracking ID: ${order.razorpay_payment_id ?? 'N/A'}`}
                  </Text>
                </Box>
              </Box>
              <Text size="small" weight="semibold" color={trackingStage === 'delivered' ? 'interactive.text.positive.normal' : 'interactive.text.gray.muted'}>
                {trackingStage === 'delivered' ? 'Delivered' : trackingStage === 'out_for_delivery' ? 'Out for Delivery' : 'In Transit'}
              </Text>
            </Box>

            <TrackingTimeline
              status={trackingStage}
              currentStage={currentStageIndex >= 0 ? currentStageIndex : undefined}
            />
          </Box>
        </CardBody>
      </Card>

      {/* Order Summary Card */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Heading size="medium" weight="semibold">Order Summary</Heading>
            <Box display="flex" justifyContent="space-between">
              <Text size="small" color="surface.text.gray.muted">Order ID</Text>
              <Text size="small" weight="semibold">{order.id}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text size="small" color="surface.text.gray.muted">Order Date</Text>
              <Text size="small" weight="semibold">
                {new Date(order.created_at).toLocaleDateString()}
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text size="small" color="surface.text.gray.muted">Order Status</Text>
              <Badge color={order.status === 'paid' ? 'positive' : 'notice'} size="small">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </Box>

            {order.order_items && order.order_items.length > 0 && (
              <>
                <Divider />
                <Heading size="small" weight="semibold">{`Items (${order.order_items.length})`}</Heading>
                <Box display="flex" flexDirection="column" gap="spacing.2">
                  {order.order_items.map((item) => (
                    <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" flexDirection="column">
                        <Text size="small" weight="semibold">{item.name}</Text>
                        <Text size="xsmall" color="surface.text.gray.muted">{`Qty: ${item.qty}`}</Text>
                      </Box>
                      <Amount value={item.line_total} size="small" />
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {order.invoices?.[0] && (
              <>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Invoice</Text>
                  <Text size="small" weight="semibold">{order.invoices[0].invoice_number}</Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Grand Total</Text>
                  <Amount value={order.invoices[0].grand_total} size="small" />
                </Box>
              </>
            )}

            {order.refund_status === 'processed' && order.refund_amount && (
              <>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Refund Status</Text>
                  <Badge color="notice" size="small">Processed</Badge>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Refund Amount</Text>
                  <Amount value={Number(order.refund_amount)} size="small" />
                </Box>
              </>
            )}
          </Box>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Button variant="primary" isFullWidth icon={PackageIcon} iconPosition="left">
          Track Shipment
        </Button>
        <Button variant="secondary" isFullWidth icon={FileTextIcon} iconPosition="left">
          View Invoice
        </Button>
        <Link href="/store" style={{ textDecoration: 'none' }}>
          <Button variant="tertiary" isFullWidth>
            Continue Shopping
          </Button>
        </Link>
      </Box>

      {/* Navigation Links */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Link href={`/store/order-success/${order.id}?verified=true`} style={{ textDecoration: 'none' }}>
          <Button variant="tertiary">Back to Order Confirmation</Button>
        </Link>
        <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" icon={FileTextIcon} iconPosition="left">
            View Audit Chain for this Shipment
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
