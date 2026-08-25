'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  SelectInput,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  DownloadIcon,
  FileTextIcon,
  CloseIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  SparklesIcon,
  CopyIcon,
  ChevronRightIcon,
  RefreshIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  PackageIcon
} from '@razorpay/blade/components';
import Link from 'next/link';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Cancelled';
export type OrderStatus = 'Completed' | 'Processing' | 'Pending Payment' | 'Failed' | 'Refunded' | 'Cancelled';

export interface OrderItem {
  id: string;
  sessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  source: string;
  product: string;
  amount: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  invoiceId: string;
  razorpayOrderId: string;
  createdAt: string;
  rawOrder?: any;
}

const paymentStatusConfig: Record<PaymentStatus, { color: 'positive' | 'negative' | 'notice' | 'neutral', label: string }> = {
  Paid: { color: 'positive', label: 'Paid' },
  Pending: { color: 'notice', label: 'Pending' },
  Failed: { color: 'negative', label: 'Failed' },
  Refunded: { color: 'neutral', label: 'Refunded' },
  Cancelled: { color: 'neutral', label: 'Cancelled' },
};

function OrderDetailDrawer({ order, onClose }: { order: OrderItem; onClose: () => void }) {
  const payCfg = paymentStatusConfig[order.paymentStatus];

  return (
    <Box
      position="fixed"
      top="56px"
      right="spacing.0"
      width={{ base: '100%', m: '480px' }}
      height="calc(100vh - 56px)"
      backgroundColor="surface.background.gray.intense"
      borderLeftWidth="thin"
      borderLeftColor="surface.border.gray.muted"
      padding="spacing.6"
      display="flex"
      flexDirection="column"
      zIndex={100}
      overflow="auto"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.5">
        <Box display="flex" alignItems="center" gap="spacing.2">
          <Heading size="medium" weight="semibold">Order {order.id}</Heading>
          <Badge color={payCfg.color} size="small">{payCfg.label}</Badge>
        </Box>
        <IconButton icon={CloseIcon} accessibilityLabel="Close drawer" size="medium" onClick={onClose} />
      </Box>

      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Text size="small" weight="semibold" color="surface.text.gray.muted">Order Summary</Text>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.3">
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Order ID</Text>
                <Text size="small" weight="semibold" marginTop="spacing.1">{order.id}</Text>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Session ID</Text>
                <Text size="small" weight="semibold" color="interactive.text.primary.normal">{order.sessionId}</Text>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Amount</Text>
                <Text size="small" weight="semibold" marginTop="spacing.1">{order.amount}</Text>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Created At</Text>
                <Text size="small" weight="semibold" marginTop="spacing.1">{order.createdAt}</Text>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>

      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.2">
            <Text size="small" weight="semibold" color="surface.text.gray.muted">Customer Details</Text>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Text size="small" weight="semibold">{order.customerName}</Text>
              <Text size="xsmall" color="surface.text.gray.muted">{order.customerEmail}</Text>
              <Text size="xsmall" color="surface.text.gray.muted">{order.customerPhone}</Text>
            </Box>
          </Box>
        </CardBody>
      </Card>

      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.2">
            <Text size="small" weight="semibold" color="surface.text.gray.muted">Razorpay Details</Text>
            <Text size="xsmall" color="surface.text.gray.muted">Order ID: {order.razorpayOrderId}</Text>
            <Text size="xsmall" color="surface.text.gray.muted">Invoice ID: {order.invoiceId}</Text>
          </Box>
        </CardBody>
      </Card>

      <Box marginTop="auto" display="flex" gap="spacing.3">
        <Button variant="tertiary" onClick={onClose} isFullWidth>Close</Button>
      </Box>
    </Box>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        const mapped: OrderItem[] = data.orders.map((o: any) => {
          const cust = Array.isArray(o.customer_details) ? o.customer_details[0] : o.customer_details;
          return {
            id: o.id.substring(0, 8).toUpperCase(),
            sessionId: o.session_id ? o.session_id.substring(0, 8).toUpperCase() : 'DIRECT',
            customerName: cust?.full_name || 'Customer',
            customerEmail: cust?.email || 'customer@example.com',
            customerPhone: cust?.phone || '+91 98765 43210',
            source: 'Store / AI Gateway',
            product: 'Catalog Order',
            amount: `₹${Number(o.amount).toLocaleString('en-IN')}`,
            paymentStatus: o.status === 'paid' ? 'Paid' : o.status === 'draft' ? 'Pending' : 'Failed',
            orderStatus: o.status === 'paid' ? 'Completed' : 'Processing',
            invoiceId: `INV-${o.id.substring(0, 5).toUpperCase()}`,
            razorpayOrderId: o.razorpay_order_id || 'order_rzp_mock',
            createdAt: new Date(o.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            rawOrder: o
          };
        });
        setOrders(mapped);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + parseFloat(o.amount.replace(/[^0-9.]/g, '') || '0'), 0);

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Orders</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Track all orders created by customers and AI conversations.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="primary" icon={RefreshIcon} iconPosition="left" onClick={fetchOrders}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(4,1fr)' }} gap="spacing.4" marginBottom="spacing.6">
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Total Orders</Text>
            <Heading size="xlarge">{orders.length}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Paid Orders</Text>
            <Heading size="xlarge">{orders.filter(o => o.paymentStatus === 'Paid').length}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Pending Orders</Text>
            <Heading size="xlarge">{orders.filter(o => o.paymentStatus === 'Pending').length}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Total Revenue</Text>
            <Heading size="xlarge">{`₹${totalRevenue.toLocaleString('en-IN')}`}</Heading>
          </CardBody>
        </Card>
      </Box>

      {/* Orders Table */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box 
            display="grid" 
            gridTemplateColumns="1fr 1.2fr 2fr 1fr 1fr 1fr auto" 
            gap="spacing.4" 
            paddingY="spacing.3" 
            paddingX="spacing.4"
            backgroundColor="surface.background.gray.subtle"
            borderRadius="small"
            marginBottom="spacing.2"
          >
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">ORDER ID</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">CUSTOMER</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">RAZORPAY ID</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">AMOUNT</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">STATUS</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">DATE</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" textAlign="right">ACTIONS</Text>
          </Box>

          {isLoading ? (
            <Box padding="spacing.4"><Text size="small" color="surface.text.gray.muted">Loading orders from DB...</Text></Box>
          ) : orders.length === 0 ? (
            <Box padding="spacing.4"><Text size="small" color="surface.text.gray.muted">No orders created yet.</Text></Box>
          ) : (
            <Box display="flex" flexDirection="column">
              {orders.map((order, index) => (
                <Box 
                  key={order.id}
                  paddingY="spacing.4"
                  paddingX="spacing.4"
                  borderBottomWidth={index !== orders.length - 1 ? 'thin' : 'none'}
                  borderBottomColor="surface.border.gray.muted"
                  display="grid"
                  gridTemplateColumns="1fr 1.2fr 2fr 1fr 1fr 1fr auto"
                  gap="spacing.4"
                  alignItems="center"
                >
                  <Text weight="semibold" size="small" color="surface.text.primary.normal">{order.id}</Text>
                  <Text size="small" weight="semibold">{order.customerName}</Text>
                  <Text size="xsmall" color="surface.text.gray.subtle">{order.razorpayOrderId}</Text>
                  <Text size="small" weight="semibold">{order.amount}</Text>
                  <Box>
                    <Badge color={paymentStatusConfig[order.paymentStatus].color} size="small">
                      {paymentStatusConfig[order.paymentStatus].label}
                    </Badge>
                  </Box>
                  <Text size="xsmall" color="surface.text.gray.muted">{order.createdAt}</Text>
                  <Box display="flex" alignItems="center" gap="spacing.2" justifyContent="flex-end">
                    <Button variant="secondary" size="small" onClick={() => setSelectedOrder(order)}>
                      View
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardBody>
      </Card>

      {selectedOrder && (
        <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </Box>
  );
}
