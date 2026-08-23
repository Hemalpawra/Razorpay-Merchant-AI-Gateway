'use client';

import React, { useState, useMemo } from 'react';
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
  Tabs,
  TabList,
  TabItem,
  Alert,
  // Icons
  DownloadIcon,
  FileTextIcon,
  CalendarIcon,
  FilterIcon,
  MoreVerticalIcon,
  CloseIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  SparklesIcon,
  CopyIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  RefreshIcon,
  ArrowRightIcon,
  CheckIcon,
  PackageIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  ZapIcon,
  InfoIcon,
  ExternalLinkIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Cancelled';
export type OrderStatus = 'Completed' | 'Processing' | 'Pending Payment' | 'Failed' | 'Refunded' | 'Cancelled';
export type OrderSource = 'Human Customer' | 'ChatGPT' | 'Claude' | 'Gemini' | 'Grok' | 'Merchant AI';

export interface Order {
  id: string;
  sessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  source: OrderSource;
  product: string;
  sku: string;
  amount: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  invoiceId: string;
  invoiceStatus: 'Generated' | 'Pending' | 'Failed';
  razorpayOrderId: string;
  paymentMethod: string;
  createdAt: string;
  paidAt: string | null;
  failureReason?: string;
  refundReason?: string;
  shipmentSteps: { title: string; time: string; completed: boolean }[];
  auditEventsCount: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-10231',
    sessionId: 'CONV-1032',
    customerName: 'Hemal',
    customerEmail: 'hemal@gmail.com',
    customerPhone: '+91 98765 43210',
    source: 'Human Customer',
    product: 'Asus TUF F15',
    sku: 'ASUS-TUF-F15',
    amount: '₹54,999',
    paymentStatus: 'Paid',
    orderStatus: 'Completed',
    invoiceId: 'INV-22991',
    invoiceStatus: 'Generated',
    razorpayOrderId: 'order_M9y8X2aP',
    paymentMethod: 'UPI',
    createdAt: '21 Jun, 2025 10:31 AM',
    paidAt: '21 Jun, 2025 10:34 AM',
    shipmentSteps: [
      { title: 'Preparing', time: '21 Jun, 10:35 AM', completed: true },
      { title: 'Packed', time: '21 Jun, 01:15 PM', completed: true },
      { title: 'Shipped', time: '21 Jun, 04:30 PM', completed: true },
      { title: 'Out for Delivery', time: '22 Jun, 09:00 AM', completed: false },
      { title: 'Delivered', time: '22 Jun, 07:00 PM (Est.)', completed: false },
    ],
    auditEventsCount: 12,
  },
  {
    id: 'ORD-10230',
    sessionId: 'CONV-1031',
    customerName: 'ChatGPT',
    customerEmail: 'buyer_ai@openai.com',
    customerPhone: '+91 98000 11122',
    source: 'ChatGPT',
    product: 'Lenovo IdeaPad Gaming 3',
    sku: 'LEN-IPG3',
    amount: '₹56,990',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    invoiceId: 'INV-22990',
    invoiceStatus: 'Generated',
    razorpayOrderId: 'order_M9y8X2bP',
    paymentMethod: 'NetBanking',
    createdAt: '21 Jun, 2025 10:21 AM',
    paidAt: '21 Jun, 2025 10:23 AM',
    shipmentSteps: [
      { title: 'Preparing', time: '21 Jun, 10:25 AM', completed: true },
      { title: 'Packed', time: '21 Jun, 02:00 PM', completed: true },
      { title: 'Shipped', time: '21 Jun, 05:00 PM', completed: false },
      { title: 'Out for Delivery', time: '22 Jun, 09:00 AM', completed: false },
      { title: 'Delivered', time: '22 Jun, 07:00 PM (Est.)', completed: false },
    ],
    auditEventsCount: 9,
  },
  {
    id: 'ORD-10229',
    sessionId: 'CONV-1030',
    customerName: 'Claude',
    customerEmail: 'claude_buyer@anthropic.com',
    customerPhone: '+91 98000 33344',
    source: 'Claude',
    product: 'Acer Nitro 5',
    sku: 'ACER-N5',
    amount: '₹55,990',
    paymentStatus: 'Pending',
    orderStatus: 'Pending Payment',
    invoiceId: 'INV-22989',
    invoiceStatus: 'Pending',
    razorpayOrderId: 'order_M9y8X2cP',
    paymentMethod: 'Awaiting Payment',
    createdAt: '21 Jun, 2025 09:48 AM',
    paidAt: null,
    shipmentSteps: [
      { title: 'Preparing', time: 'Pending Payment', completed: false },
      { title: 'Packed', time: '—', completed: false },
      { title: 'Shipped', time: '—', completed: false },
      { title: 'Out for Delivery', time: '—', completed: false },
      { title: 'Delivered', time: '—', completed: false },
    ],
    auditEventsCount: 6,
  },
  {
    id: 'ORD-10228',
    sessionId: 'CONV-1029',
    customerName: 'Gemini',
    customerEmail: 'gemini_buyer@google.com',
    customerPhone: '+91 98000 55566',
    source: 'Gemini',
    product: 'Mechanical Keyboard',
    sku: 'MK-100',
    amount: '₹4,499',
    paymentStatus: 'Paid',
    orderStatus: 'Completed',
    invoiceId: 'INV-22988',
    invoiceStatus: 'Generated',
    razorpayOrderId: 'order_M9y8X2dP',
    paymentMethod: 'Cards',
    createdAt: '21 Jun, 2025 09:12 AM',
    paidAt: '21 Jun, 2025 09:14 AM',
    shipmentSteps: [
      { title: 'Preparing', time: '21 Jun, 09:15 AM', completed: true },
      { title: 'Packed', time: '21 Jun, 11:00 AM', completed: true },
      { title: 'Shipped', time: '21 Jun, 02:00 PM', completed: true },
      { title: 'Out for Delivery', time: '21 Jun, 05:00 PM', completed: true },
      { title: 'Delivered', time: '21 Jun, 07:30 PM', completed: true },
    ],
    auditEventsCount: 14,
  },
  {
    id: 'ORD-10227',
    sessionId: 'CONV-1028',
    customerName: 'Sarah',
    customerEmail: 'sarah.m@example.com',
    customerPhone: '+91 98111 22334',
    source: 'Human Customer',
    product: 'Wireless Mouse',
    sku: 'WM-200',
    amount: '₹1,299',
    paymentStatus: 'Paid',
    orderStatus: 'Completed',
    invoiceId: 'INV-22987',
    invoiceStatus: 'Generated',
    razorpayOrderId: 'order_M9y8X2eP',
    paymentMethod: 'UPI',
    createdAt: '20 Jun, 2025 08:55 PM',
    paidAt: '20 Jun, 2025 08:57 PM',
    shipmentSteps: [
      { title: 'Preparing', time: '20 Jun, 09:00 PM', completed: true },
      { title: 'Packed', time: '21 Jun, 09:00 AM', completed: true },
      { title: 'Shipped', time: '21 Jun, 01:00 PM', completed: true },
      { title: 'Out for Delivery', time: '21 Jun, 04:00 PM', completed: true },
      { title: 'Delivered', time: '21 Jun, 06:30 PM', completed: true },
    ],
    auditEventsCount: 8,
  },
  {
    id: 'ORD-10226',
    sessionId: 'CONV-1027',
    customerName: 'Grok',
    customerEmail: 'grok_buyer@x.ai',
    customerPhone: '+91 98000 77788',
    source: 'Grok',
    product: 'Laptop Stand',
    sku: 'LS-300',
    amount: '₹1,599',
    paymentStatus: 'Failed',
    orderStatus: 'Failed',
    invoiceId: 'INV-22986',
    invoiceStatus: 'Failed',
    razorpayOrderId: 'order_M9y8X2fP',
    paymentMethod: 'Cards (Declined)',
    createdAt: '20 Jun, 2025 08:30 PM',
    paidAt: null,
    failureReason: 'Card authorization failed: Insufficient funds (PAYMENT_DECLINED)',
    shipmentSteps: [
      { title: 'Preparing', time: 'Payment Failed', completed: false },
      { title: 'Packed', time: '—', completed: false },
      { title: 'Shipped', time: '—', completed: false },
      { title: 'Out for Delivery', time: '—', completed: false },
      { title: 'Delivered', time: '—', completed: false },
    ],
    auditEventsCount: 5,
  },
  {
    id: 'ORD-10225',
    sessionId: 'CONV-1026',
    customerName: 'Alex',
    customerEmail: 'alex.k@example.com',
    customerPhone: '+91 98222 33445',
    source: 'Human Customer',
    product: 'HP Victus 15',
    sku: 'HP-V15',
    amount: '₹62,990',
    paymentStatus: 'Pending',
    orderStatus: 'Pending Payment',
    invoiceId: 'INV-22985',
    invoiceStatus: 'Pending',
    razorpayOrderId: 'order_M9y8X2gP',
    paymentMethod: 'NetBanking (Awaiting OTP)',
    createdAt: '20 Jun, 2025 07:45 PM',
    paidAt: null,
    shipmentSteps: [
      { title: 'Preparing', time: 'Awaiting Payment', completed: false },
      { title: 'Packed', time: '—', completed: false },
      { title: 'Shipped', time: '—', completed: false },
      { title: 'Out for Delivery', time: '—', completed: false },
      { title: 'Delivered', time: '—', completed: false },
    ],
    auditEventsCount: 4,
  },
  {
    id: 'ORD-10224',
    sessionId: 'CONV-1025',
    customerName: 'ChatGPT',
    customerEmail: 'buyer_ai2@openai.com',
    customerPhone: '+91 98000 99900',
    source: 'ChatGPT',
    product: 'RGB Gaming Keyboard',
    sku: 'RGB-GK',
    amount: '₹2,999',
    paymentStatus: 'Paid',
    orderStatus: 'Completed',
    invoiceId: 'INV-22984',
    invoiceStatus: 'Generated',
    razorpayOrderId: 'order_M9y8X2hP',
    paymentMethod: 'UPI',
    createdAt: '20 Jun, 2025 07:20 PM',
    paidAt: '20 Jun, 2025 07:22 PM',
    shipmentSteps: [
      { title: 'Preparing', time: '20 Jun, 07:25 PM', completed: true },
      { title: 'Packed', time: '20 Jun, 09:00 PM', completed: true },
      { title: 'Shipped', time: '21 Jun, 08:00 AM', completed: true },
      { title: 'Out for Delivery', time: '21 Jun, 12:00 PM', completed: true },
      { title: 'Delivered', time: '21 Jun, 03:00 PM', completed: true },
    ],
    auditEventsCount: 11,
  },
];

// ─── Status / Badge Configurations ──────────────────────────────────────────

const paymentStatusConfig: Record<PaymentStatus, { color: 'positive' | 'negative' | 'notice' | 'neutral', label: string }> = {
  Paid: { color: 'positive', label: 'Paid' },
  Pending: { color: 'notice', label: 'Pending' },
  Failed: { color: 'negative', label: 'Failed' },
  Refunded: { color: 'neutral', label: 'Refunded' },
  Cancelled: { color: 'neutral', label: 'Cancelled' },
};

const orderStatusConfig: Record<OrderStatus, { color: 'positive' | 'negative' | 'notice' | 'information' | 'neutral', label: string }> = {
  Completed: { color: 'positive', label: 'Completed' },
  Processing: { color: 'information', label: 'Processing' },
  'Pending Payment': { color: 'notice', label: 'Pending Payment' },
  Failed: { color: 'negative', label: 'Failed' },
  Refunded: { color: 'neutral', label: 'Refunded' },
  Cancelled: { color: 'neutral', label: 'Cancelled' },
};

const sourceBadgeConfig: Record<OrderSource, { color: 'positive' | 'notice' | 'information' | 'neutral', label: string }> = {
  'Human Customer': { color: 'positive', label: 'Human' },
  ChatGPT: { color: 'information', label: 'ChatGPT' },
  Claude: { color: 'notice', label: 'Claude' },
  Gemini: { color: 'information', label: 'Gemini' },
  Grok: { color: 'neutral', label: 'Grok' },
  'Merchant AI': { color: 'positive', label: 'Merchant AI' },
};

// ─── Order Summary Card Component ─────────────────────────────────────────────

function SummaryCard({
  title, value, trend, trendUp, icon: Icon, badgeColor, isCritical,
}: {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ComponentType<any>;
  badgeColor: 'primary' | 'positive' | 'negative' | 'notice' | 'neutral';
  isCritical?: boolean;
}) {
  return (
    <Card elevation="none" backgroundColor="surface.background.gray.intense">
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">{title}</Text>
            <Box
              width="28px" height="28px"
              borderRadius="small"
              backgroundColor={`surface.background.${badgeColor}.subtle` as any}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Icon size="small" color={`interactive.icon.${badgeColor}.normal` as any} />
            </Box>
          </Box>
          <Heading size="xlarge" weight="semibold" color={isCritical ? 'interactive.text.negative.normal' : undefined}>
            {value}
          </Heading>
          <Text size="xsmall" color={trendUp ? 'interactive.text.positive.normal' : 'interactive.text.negative.normal'}>
            {trend}
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
}

// ─── Order Detail Drawer Component ───────────────────────────────────────────

function OrderDetailDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  const [copiedSession, setCopiedSession] = useState(false);
  const [copiedRazorpayOrder, setCopiedRazorpayOrder] = useState(false);

  const payCfg = paymentStatusConfig[order.paymentStatus];
  const ordCfg = orderStatusConfig[order.orderStatus];
  const srcCfg = sourceBadgeConfig[order.source];

  const handleCopySession = () => {
    navigator.clipboard.writeText(order.sessionId);
    setCopiedSession(true);
    setTimeout(() => setCopiedSession(false), 2000);
  };

  const handleCopyRazorpayOrder = () => {
    navigator.clipboard.writeText(order.razorpayOrderId);
    setCopiedRazorpayOrder(true);
    setTimeout(() => setCopiedRazorpayOrder(false), 2000);
  };

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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.5">
        <Box display="flex" alignItems="center" gap="spacing.2">
          <Heading size="medium" weight="semibold">Order {order.id}</Heading>
          <Badge color={payCfg.color} size="small">{payCfg.label}</Badge>
        </Box>
        <IconButton icon={CloseIcon} accessibilityLabel="Close drawer" size="medium" onClick={onClose} />
      </Box>

      {/* ── SECTION: Order Summary ── */}
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
                <Box display="flex" alignItems="center" gap="spacing.1" marginTop="spacing.1">
                  <Text size="small" weight="semibold" color="interactive.text.primary.normal">{order.sessionId}</Text>
                  <IconButton icon={CopyIcon} accessibilityLabel="Copy session ID" size="small" onClick={handleCopySession} />
                </Box>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Source</Text>
                <Box marginTop="spacing.1">
                  <Badge color={srcCfg.color} size="small">{order.source}</Badge>
                </Box>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Product</Text>
                <Text size="small" weight="semibold" marginTop="spacing.1">{order.product}</Text>
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

      {/* ── SECTION: Customer Details ── */}
      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.2">
            <Text size="small" weight="semibold" color="surface.text.gray.muted">Customer Details</Text>
            <Box display="flex" alignItems="center" gap="spacing.3">
              <Box
                width="36px" height="36px" borderRadius="round"
                backgroundColor="surface.background.gray.subtle"
                borderWidth="thin" borderColor="surface.border.gray.muted"
                display="flex" alignItems="center" justifyContent="center"
              >
                <Text size="small" weight="semibold">{order.customerName[0]}</Text>
              </Box>
              <Box display="flex" flexDirection="column">
                <Text size="small" weight="semibold">{order.customerName}</Text>
                <Text size="xsmall" color="surface.text.gray.muted">{order.customerEmail}</Text>
              </Box>
              <Box marginLeft="auto">
                <Text size="xsmall" color="surface.text.gray.muted">{order.customerPhone}</Text>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* ── SECTION: Payment Details ── */}
      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Text size="small" weight="semibold" color="surface.text.gray.muted">Payment Details</Text>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.3">
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Razorpay Order ID</Text>
                <Box display="flex" alignItems="center" gap="spacing.1" marginTop="spacing.1">
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.normal">{order.razorpayOrderId}</Text>
                  <IconButton icon={CopyIcon} accessibilityLabel="Copy Razorpay Order ID" size="small" onClick={handleCopyRazorpayOrder} />
                </Box>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Payment Status</Text>
                <Box marginTop="spacing.1"><Badge color={payCfg.color} size="small">{payCfg.label}</Badge></Box>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Invoice Status</Text>
                <Box marginTop="spacing.1">
                  <Badge color={order.invoiceStatus === 'Generated' ? 'positive' : order.invoiceStatus === 'Pending' ? 'notice' : 'negative'} size="small">
                    {order.invoiceStatus}
                  </Badge>
                </Box>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Payment Method</Text>
                <Text size="small" weight="semibold" marginTop="spacing.1">{order.paymentMethod}</Text>
              </Box>
              {order.paidAt && (
                <Box gridColumn="span 2">
                  <Text size="xsmall" color="surface.text.gray.muted">Paid At</Text>
                  <Text size="small" weight="semibold" marginTop="spacing.1">{order.paidAt}</Text>
                </Box>
              )}
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* ── SECTION: Failure / Refund Notice (if applicable) ── */}
      {(order.paymentStatus === 'Failed' || order.orderStatus === 'Failed') && (
        <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <AlertCircleIcon size="small" color="interactive.icon.negative.normal" />
                <Text size="small" weight="semibold" color="interactive.text.negative.normal">Payment Failed</Text>
              </Box>
              <Text size="xsmall" color="surface.text.gray.muted">
                Reason: {order.failureReason ?? 'Authorization declined by issuing bank.'}
              </Text>
              <Box display="flex" gap="spacing.2" marginTop="spacing.2">
                <Button variant="secondary" size="small" icon={RefreshIcon} iconPosition="left">
                  Retry Payment Link
                </Button>
                <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="small">View Audit Log</Button>
                </Link>
              </Box>
            </Box>
          </CardBody>
        </Card>
      )}

      {/* ── SECTION: Invoice Section ── */}
      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
        <CardBody>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.3">
              <FileTextIcon size="medium" color="interactive.icon.primary.normal" />
              <Box display="flex" flexDirection="column">
                <Text size="small" weight="semibold">Invoice {order.invoiceId}</Text>
                <Text size="xsmall" color="surface.text.gray.muted">Status: {order.invoiceStatus}</Text>
              </Box>
            </Box>
            <Box display="flex" gap="spacing.2">
              <Button variant="secondary" size="small" icon={DownloadIcon} iconPosition="left">
                Download
              </Button>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* ── SECTION: Shipping (Dummy Tracking) & Related ── */}
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.4" marginBottom="spacing.5">
        {/* Shipping Timeline */}
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Text size="small" weight="semibold" color="surface.text.gray.muted">Shipping (Dummy Tracking)</Text>
          <Box display="flex" flexDirection="column" gap="spacing.2" paddingLeft="spacing.2" borderLeftWidth="thick" borderLeftColor="surface.border.primary.normal">
            {order.shipmentSteps.map((step, idx) => (
              <Box key={idx} display="flex" flexDirection="column" gap="spacing.1">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Box
                    width="12px" height="12px" borderRadius="round"
                    backgroundColor={step.completed ? 'surface.background.sea.intense' : 'surface.background.gray.subtle'}
                  />
                  <Text size="xsmall" weight={step.completed ? 'semibold' : 'regular'} color={step.completed ? 'surface.text.gray.normal' : 'surface.text.gray.subtle'}>
                    {step.title}
                  </Text>
                </Box>
                <Box paddingLeft="spacing.4">
                  <Text size="xsmall" color="surface.text.gray.muted">{step.time}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Related Links */}
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Text size="small" weight="semibold" color="surface.text.gray.muted">Related Links</Text>

          <Link href="/dashboard/ai-agent" style={{ textDecoration: 'none' }}>
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <SparklesIcon size="small" color="interactive.icon.primary.normal" />
                    <Box>
                      <Text size="xsmall" weight="semibold">View Conversation</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">{order.sessionId}</Text>
                    </Box>
                  </Box>
                  <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
                </Box>
              </CardBody>
            </Card>
          </Link>

          <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <FileTextIcon size="small" color="interactive.icon.primary.normal" />
                    <Box>
                      <Text size="xsmall" weight="semibold">View Audit Trail</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">{order.auditEventsCount} events</Text>
                    </Box>
                  </Box>
                  <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
                </Box>
              </CardBody>
            </Card>
          </Link>

          <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <PackageIcon size="small" color="interactive.icon.primary.normal" />
                    <Box>
                      <Text size="xsmall" weight="semibold">Open Product</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">{order.product}</Text>
                    </Box>
                  </Box>
                  <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
                </Box>
              </CardBody>
            </Card>
          </Link>
        </Box>
      </Box>

      {/* Footer CTAs */}
      <Box marginTop="auto" display="flex" gap="spacing.3">
        {order.paymentStatus === 'Paid' && (
          <Button variant="secondary" isFullWidth>Refund Order</Button>
        )}
        {order.paymentStatus === 'Pending' && (
          <Button variant="primary" isFullWidth icon={RefreshIcon} iconPosition="left">
            Resend Payment Link
          </Button>
        )}
        {order.paymentStatus === 'Failed' && (
          <Button variant="primary" isFullWidth icon={RefreshIcon} iconPosition="left">
            Retry Order
          </Button>
        )}
        <Button variant="tertiary" onClick={onClose}>Close</Button>
      </Box>

      {(copiedSession || copiedRazorpayOrder) && (
        <Box position="absolute" bottom="spacing.4" left="spacing.6" right="spacing.6" display="flex" justifyContent="center">
          <Badge color="positive" size="medium">Copied to clipboard!</Badge>
        </Box>
      )}
    </Box>
  );
}

// ─── Main Orders Page Component ───────────────────────────────────────────────

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(MOCK_ORDERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        q === '' ||
        o.id.toLowerCase().includes(q) ||
        o.sessionId.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.source.toLowerCase().includes(q);

      const matchPayment = paymentFilter === 'all' || o.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();
      const matchOrderStatus = orderStatusFilter === 'all' || o.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase();
      const matchSource = sourceFilter === 'all' || o.source.toLowerCase().includes(sourceFilter.toLowerCase());

      return matchSearch && matchPayment && matchOrderStatus && matchSource;
    });
  }, [searchQuery, paymentFilter, orderStatusFilter, sourceFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setPaymentFilter('all');
    setOrderStatusFilter('all');
    setSourceFilter('all');
  };

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Orders</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Track all orders created by customers and AI conversations.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="secondary" icon={DownloadIcon} iconPosition="left">
            Export orders
          </Button>
          <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" icon={FileTextIcon} iconPosition="left">
              View audit trail
            </Button>
          </Link>
        </Box>
      </Box>

      {/* SECTION 1: Summary Cards (4 cards) */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(4,1fr)' }}
        gap="spacing.4"
        marginBottom="spacing.6"
      >
        <SummaryCard title="Total Orders" value="256" trend="↑ 18% vs yesterday" trendUp icon={ShoppingBagIcon} badgeColor="primary" />
        <SummaryCard title="Paid Orders" value="186" trend="↑ 22% vs yesterday" trendUp icon={CheckCircleIcon} badgeColor="positive" />
        <SummaryCard title="Pending Orders" value="34" trend="↓ 8% vs yesterday" trendUp={false} icon={ClockIcon} badgeColor="notice" />
        <SummaryCard title="Revenue Generated" value="₹7,24,560" trend="↑ 28% vs yesterday" trendUp icon={TrendingUpIcon} badgeColor="positive" />
      </Box>

      {/* SECTION 2: Filters Row */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap="spacing.4">
            <Box display="flex" flexWrap="wrap" alignItems="center" gap="spacing.3" flex={1}>
              <Box width={{ base: '100%', m: '320px' }}>
                <TextInput
                  label=""
                  accessibilityLabel="Search orders"
                  placeholder="Search by order ID, session ID, product, or customer AI"
                  value={searchQuery}
                  onChange={({ value }) => setSearchQuery(value || '')}
                />
              </Box>

              <Dropdown>
                <SelectInput label="" accessibilityLabel="Payment status filter" placeholder="Payment: All" />
                <DropdownOverlay>
                  <ActionList>
                    <ActionListItem title="All Payments" value="all" onClick={() => setPaymentFilter('all')} />
                    <ActionListItem title="Paid" value="paid" onClick={() => setPaymentFilter('paid')} />
                    <ActionListItem title="Pending" value="pending" onClick={() => setPaymentFilter('pending')} />
                    <ActionListItem title="Failed" value="failed" onClick={() => setPaymentFilter('failed')} />
                    <ActionListItem title="Refunded" value="refunded" onClick={() => setPaymentFilter('refunded')} />
                  </ActionList>
                </DropdownOverlay>
              </Dropdown>

              <Dropdown>
                <SelectInput label="" accessibilityLabel="Order status filter" placeholder="Order Status: All" />
                <DropdownOverlay>
                  <ActionList>
                    <ActionListItem title="All Order Statuses" value="all" onClick={() => setOrderStatusFilter('all')} />
                    <ActionListItem title="Completed" value="completed" onClick={() => setOrderStatusFilter('completed')} />
                    <ActionListItem title="Processing" value="processing" onClick={() => setOrderStatusFilter('processing')} />
                    <ActionListItem title="Pending Payment" value="pending_payment" onClick={() => setOrderStatusFilter('pending payment')} />
                    <ActionListItem title="Failed" value="failed" onClick={() => setOrderStatusFilter('failed')} />
                  </ActionList>
                </DropdownOverlay>
              </Dropdown>

              <Dropdown>
                <SelectInput label="" accessibilityLabel="Source filter" placeholder="Source: All" />
                <DropdownOverlay>
                  <ActionList>
                    <ActionListItem title="All Sources" value="all" onClick={() => setSourceFilter('all')} />
                    <ActionListItem title="Human Customer" value="human" onClick={() => setSourceFilter('human')} />
                    <ActionListItem title="ChatGPT" value="chatgpt" onClick={() => setSourceFilter('chatgpt')} />
                    <ActionListItem title="Claude" value="claude" onClick={() => setSourceFilter('claude')} />
                    <ActionListItem title="Gemini" value="gemini" onClick={() => setSourceFilter('gemini')} />
                    <ActionListItem title="Grok" value="grok" onClick={() => setSourceFilter('grok')} />
                  </ActionList>
                </DropdownOverlay>
              </Dropdown>

              <Button variant="tertiary" icon={CalendarIcon} iconPosition="left">
                21 May – 21 Jun 2025
              </Button>
            </Box>

            <Button variant="tertiary" onClick={resetFilters}>Reset</Button>
          </Box>
        </CardBody>
      </Card>

      {/* SECTION 3: Orders Table */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          {/* Table Header */}
          <Box
            display="grid"
            gridTemplateColumns="1.2fr 1.2fr 1.6fr 1.6fr 1fr 1.1fr 1fr 1.2fr 1.4fr 0.5fr"
            gap="spacing.3"
            paddingY="spacing.3"
            paddingX="spacing.4"
            backgroundColor="surface.background.gray.subtle"
            borderRadius="small"
            alignItems="center"
            marginBottom="spacing.2"
          >
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Order ID</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Session ID</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Customer / AI</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Product</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Amount</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Source</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Payment</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Order Status</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Created At</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" textAlign="center">Actions</Text>
          </Box>

          {/* Rows */}
          {filteredOrders.length > 0 ? (
            <Box display="flex" flexDirection="column">
              {filteredOrders.map((ord, idx) => {
                const payCfg = paymentStatusConfig[ord.paymentStatus];
                const ordCfg = orderStatusConfig[ord.orderStatus];
                const srcCfg = sourceBadgeConfig[ord.source];
                const isSelected = selectedOrder?.id === ord.id;

                return (
                  <Box
                    key={ord.id}
                    display="grid"
                    gridTemplateColumns="1.2fr 1.2fr 1.6fr 1.6fr 1fr 1.1fr 1fr 1.2fr 1.4fr 0.5fr"
                    gap="spacing.3"
                    paddingY="spacing.3"
                    paddingX="spacing.4"
                    alignItems="center"
                    borderBottomWidth={idx !== filteredOrders.length - 1 ? 'thin' : 'none'}
                    borderBottomColor="surface.border.gray.muted"
                    backgroundColor={isSelected ? 'surface.background.primary.subtle' : 'transparent'}
                  >
                    {/* Order ID */}
                    <Button variant="tertiary" size="small" onClick={() => setSelectedOrder(ord)}>
                      {ord.id}
                    </Button>

                    {/* Session ID */}
                    <Text size="xsmall" color="interactive.text.primary.normal">{ord.sessionId}</Text>

                    {/* Customer / AI */}
                    <Box display="flex" flexDirection="column" gap="spacing.1">
                      <Text size="xsmall" weight="semibold">{ord.customerName}</Text>
                      <Text size="xsmall" color="surface.text.gray.subtle">
                        {ord.source === 'Human Customer' ? 'Human Customer' : 'AI Assistant'}
                      </Text>
                    </Box>

                    {/* Product */}
                    <Text size="xsmall" weight="semibold">{ord.product}</Text>

                    {/* Amount */}
                    <Text size="xsmall" weight="semibold">{ord.amount}</Text>

                    {/* Source Badge */}
                    <Badge color={srcCfg.color} size="small">{srcCfg.label}</Badge>

                    {/* Payment Status */}
                    <Badge color={payCfg.color} size="small">{payCfg.label}</Badge>

                    {/* Order Status */}
                    <Badge color={ordCfg.color} size="small">{ordCfg.label}</Badge>

                    {/* Created At */}
                    <Text size="xsmall" color="surface.text.gray.muted">{ord.createdAt}</Text>

                    {/* Row Action menu */}
                    <Box display="flex" justifyContent="center">
                      <IconButton
                        icon={MoreVerticalIcon}
                        accessibilityLabel="Order row options"
                        size="small"
                        onClick={() => setSelectedOrder(ord)}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            /* SECTION 9: Empty State */
            <Box
              padding="spacing.8"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap="spacing.3"
            >
              <ShoppingBagIcon size="large" color="surface.icon.gray.subtle" />
              <Heading size="small">No orders match your filter criteria</Heading>
              <Text size="small" color="surface.text.gray.subtle">
                Try resetting your search query or status filter to view all orders.
              </Text>
              <Button variant="secondary" size="small" onClick={resetFilters}>Reset filters</Button>
            </Box>
          )}

          {/* Pagination */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingTop="spacing.4"
            marginTop="spacing.4"
            borderTopWidth="thin"
            borderTopColor="surface.border.gray.muted"
          >
            <Text size="small" color="surface.text.gray.muted">
              Showing 1 to {filteredOrders.length} of 256 orders
            </Text>
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Button variant="tertiary" size="small" icon={ChevronLeftIcon} />
              <Button variant="primary" size="small">1</Button>
              <Button variant="tertiary" size="small">2</Button>
              <Button variant="tertiary" size="small">3</Button>
              <Text size="small" color="surface.text.gray.muted">...</Text>
              <Button variant="tertiary" size="small">32</Button>
              <Button variant="tertiary" size="small" icon={ChevronRightIcon} />
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </Box>
  );
}
