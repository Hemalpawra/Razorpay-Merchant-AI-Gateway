'use client';

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  IconButton,
  Card,
  CardBody,
  Badge,
  Tabs,
  TabList,
  TabItem,
  Alert,
  // Icons
  SparklesIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  FileTextIcon,
  SearchIcon,
  PackageIcon,
  ZapIcon,
  ClockIcon,
  InfoIcon,
  CloseIcon,
  CopyIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  SettingsIcon,
  RefreshIcon,
  DownloadIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

// ─── Types ─────────────────────────────────────────────────────────────────────

type ConvStatus =
  | 'Active'
  | 'Waiting for Customer'
  | 'Waiting for Payment'
  | 'Waiting for Approval'
  | 'Checkout Ready'
  | 'Paid'
  | 'Completed'
  | 'Failed'
  | 'Cancelled';

type ConvType = 'Human Customer' | 'ChatGPT' | 'Claude' | 'Gemini' | 'Grok' | 'Custom AI';

type Product = { name: string; price: string; sku: string };

type Message = {
  id: string;
  sender: 'customer' | 'ai';
  text: string;
  time: string;
  products?: Product[];
  comparison?: string;
};

type Conversation = {
  id: string;
  convId: string;
  customerName: string;
  type: ConvType;
  status: ConvStatus;
  amount: string | null;
  startedAt: string;
  messages: Message[];
  relatedOrderId: string | null;
  relatedOrderStatus: string | null;
  relatedInvoiceId: string | null;
  relatedProduct: string | null;
  shipmentStatus: string;
  auditEvents: number;
};

// ─── Status Config ─────────────────────────────────────────────────────────────

const statusConfig: Record<ConvStatus, { color: 'positive' | 'negative' | 'notice' | 'information' | 'neutral'; label: string }> = {
  Active: { color: 'positive', label: 'Active' },
  'Waiting for Customer': { color: 'notice', label: 'Waiting for Customer' },
  'Waiting for Payment': { color: 'notice', label: 'Waiting for payment' },
  'Waiting for Approval': { color: 'notice', label: 'Waiting for approval' },
  'Checkout Ready': { color: 'information', label: 'Checkout ready' },
  Paid: { color: 'positive', label: 'Paid' },
  Completed: { color: 'neutral', label: 'Completed' },
  Failed: { color: 'negative', label: 'Failed' },
  Cancelled: { color: 'neutral', label: 'Cancelled' },
};

// ─── Mock Conversations ────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    convId: 'CONV-1032',
    customerName: 'Hemal',
    type: 'Human Customer',
    status: 'Waiting for Payment',
    amount: '₹58,990',
    startedAt: '10:31 AM',
    messages: [
      { id: 'm1', sender: 'customer', text: 'I need a gaming laptop under ₹60,000.', time: '10:31 AM' },
      {
        id: 'm2', sender: 'ai', text: 'Here are some great options for you.', time: '10:31 AM',
        products: [
          { name: 'Asus TUF F15', price: '₹58,990', sku: 'ASUS-TUF-F15' },
          { name: 'Acer Nitro 5', price: '₹55,990', sku: 'ACER-N5' },
          { name: 'Lenovo IdeaPad Gaming 3', price: '₹56,990', sku: 'LEN-IPG3' },
        ],
      },
      { id: 'm3', sender: 'customer', text: 'Compare first two.', time: '10:34 AM' },
      { id: 'm4', sender: 'ai', text: 'Sure, here is a quick comparison.', time: '10:34 AM', comparison: 'Comparison: Asus TUF F15 vs Acer Nitro 5' },
      { id: 'm5', sender: 'customer', text: "I'll go with Asus TUF F15.", time: '10:35 AM' },
      { id: 'm6', sender: 'ai', text: "Great choice! I'll create the order for you.", time: '10:35 AM' },
    ],
    relatedOrderId: 'ORD-10231',
    relatedOrderStatus: 'Waiting for payment',
    relatedInvoiceId: 'INV-22991',
    relatedProduct: 'Asus TUF F15',
    shipmentStatus: 'Preparing',
    auditEvents: 12,
  },
  {
    id: '2',
    convId: 'CONV-1031',
    customerName: 'ChatGPT',
    type: 'ChatGPT',
    status: 'Waiting for Approval',
    amount: '₹54,999',
    startedAt: '10:18 AM',
    messages: [
      { id: 'm1', sender: 'customer', text: 'My user wants a gaming laptop with RTX 4060. Budget ₹55,000.', time: '10:18 AM' },
      {
        id: 'm2', sender: 'ai', text: 'Perfect match found — Acer Nitro 5 with RTX 4060 at ₹54,999. Awaiting approval to proceed.', time: '10:19 AM',
        products: [{ name: 'Acer Nitro 5 RTX 4060', price: '₹54,999', sku: 'ACER-N5-4060' }],
      },
      { id: 'm3', sender: 'customer', text: 'Awaiting user confirmation. Please hold.', time: '10:20 AM' },
    ],
    relatedOrderId: null,
    relatedOrderStatus: null,
    relatedInvoiceId: null,
    relatedProduct: 'Acer Nitro 5 RTX 4060',
    shipmentStatus: '—',
    auditEvents: 5,
  },
  {
    id: '3',
    convId: 'CONV-1030',
    customerName: 'Claude',
    type: 'Claude',
    status: 'Active',
    amount: null,
    startedAt: '10:05 AM',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Looking for wireless mechanical keyboards under ₹5,000.', time: '10:05 AM' },
      { id: 'm2', sender: 'ai', text: "Searching our catalog for wireless mechanical keyboards under ₹5,000.", time: '10:06 AM' },
    ],
    relatedOrderId: null,
    relatedOrderStatus: null,
    relatedInvoiceId: null,
    relatedProduct: null,
    shipmentStatus: '—',
    auditEvents: 3,
  },
  {
    id: '4',
    convId: 'CONV-1029',
    customerName: 'Gemini',
    type: 'Gemini',
    status: 'Checkout Ready',
    amount: '₹1,299',
    startedAt: '09:52 AM',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Purchase USB-C cable for my user.', time: '09:52 AM' },
      {
        id: 'm2', sender: 'ai', text: 'Found it! USB-C Cable 3.1 Gen2 at ₹1,299. Payment link ready.', time: '09:53 AM',
        products: [{ name: 'USB-C Cable 3.1 Gen2', price: '₹1,299', sku: 'USB-C-31G2' }],
      },
    ],
    relatedOrderId: 'ORD-10229',
    relatedOrderStatus: 'Checkout ready',
    relatedInvoiceId: null,
    relatedProduct: 'USB-C Cable 3.1 Gen2',
    shipmentStatus: '—',
    auditEvents: 6,
  },
  {
    id: '5',
    convId: 'CONV-1028',
    customerName: 'Grok',
    type: 'Grok',
    status: 'Completed',
    amount: '₹2,199',
    startedAt: '09:30 AM',
    messages: [
      { id: 'm1', sender: 'customer', text: "My user wants a Bluetooth speaker under ₹2,500.", time: '09:30 AM' },
      {
        id: 'm2', sender: 'ai', text: 'JBL Go 3 at ₹2,199 is a great match. Creating order now.', time: '09:31 AM',
        products: [{ name: 'JBL Go 3', price: '₹2,199', sku: 'JBL-GO3' }],
      },
      { id: 'm3', sender: 'customer', text: 'Payment completed.', time: '09:45 AM' },
      { id: 'm4', sender: 'ai', text: 'Order completed! Invoice sent. Shipment is being prepared.', time: '09:46 AM' },
    ],
    relatedOrderId: 'ORD-10228',
    relatedOrderStatus: 'Paid',
    relatedInvoiceId: 'INV-22990',
    relatedProduct: 'JBL Go 3',
    shipmentStatus: 'Preparing',
    auditEvents: 9,
  },
];

// ─── Conversation Detail Drawer ────────────────────────────────────────────────

function ConversationDrawer({ conv, onClose }: { conv: Conversation; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'conversation' | 'actions' | 'details'>('conversation');
  const [copied, setCopied] = useState(false);

  const cfg = statusConfig[conv.status];

  const handleCopy = () => {
    navigator.clipboard.writeText(conv.convId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aiActions = [
    { icon: SearchIcon, action: 'Catalog searched', desc: 'Searched product catalog matching buyer intent', result: 'success' as const },
    { icon: PackageIcon, action: 'Products recommended', desc: `${conv.messages.find(m => m.products)?.products?.length ?? 0} products presented to buyer`, result: 'success' as const },
    { icon: ZapIcon, action: 'Upsell offered', desc: 'Suggested extended warranty (+₹1,999)', result: 'declined' as const },
    { icon: ShoppingBagIcon, action: 'Razorpay Order created', desc: conv.relatedOrderId ? `Order ${conv.relatedOrderId} created successfully` : 'Order not yet created', result: conv.relatedOrderId ? ('success' as const) : ('pending' as const) },
  ];

  return (
    <Box
      position="fixed"
      top="56px"
      right="spacing.0"
      width={{ base: '100%', m: '460px' }}
      height="calc(100vh - 56px)"
      backgroundColor="surface.background.gray.intense"
      borderLeftWidth="thin"
      borderLeftColor="surface.border.gray.muted"
      padding="spacing.5"
      display="flex"
      flexDirection="column"
      zIndex={100}
      overflow="auto"
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.4">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Box display="flex" alignItems="center" gap="spacing.2" flexWrap="wrap">
            <Heading size="medium" weight="semibold">Conversation with {conv.customerName}</Heading>
            <Badge color={cfg.color} size="small">{cfg.label}</Badge>
          </Box>
          <Text size="xsmall" color="surface.text.gray.muted">
            Started at {conv.startedAt} • {conv.type}
          </Text>
          <Box display="flex" alignItems="center" gap="spacing.1">
            <Text size="xsmall" color="surface.text.gray.subtle">ID: {conv.convId}</Text>
            <IconButton icon={CopyIcon} accessibilityLabel="Copy conversation ID" size="small" onClick={handleCopy} />
          </Box>
        </Box>
        <IconButton icon={CloseIcon} accessibilityLabel="Close drawer" size="medium" onClick={onClose} />
      </Box>

      {/* Tabs */}
      <Box marginBottom="spacing.4">
        <Tabs variant="bordered" value={activeTab} onChange={(v) => setActiveTab(v as any)}>
          <TabList>
            <TabItem value="conversation">Conversation</TabItem>
            <TabItem value="actions">AI Actions</TabItem>
            <TabItem value="details">Details</TabItem>
          </TabList>
        </Tabs>
      </Box>

      {/* ── Tab: Conversation ── */}
      {activeTab === 'conversation' && (
        <Box display="flex" flexDirection="column" gap="spacing.4">
          {conv.messages.map((msg) => (
            <Box key={msg.id}>
              {msg.sender === 'customer' ? (
                <Box display="flex" gap="spacing.2" alignItems="flex-start">
                  <Box
                    width="28px" height="28px" borderRadius="round"
                    backgroundColor="surface.background.gray.subtle"
                    borderWidth="thin" borderColor="surface.border.gray.muted"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <Text size="xsmall" weight="semibold">{conv.customerName[0]}</Text>
                  </Box>
                  <Box flex={1} display="flex" flexDirection="column" gap="spacing.1">
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Text size="xsmall" weight="semibold">{conv.customerName}</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">{msg.time}</Text>
                    </Box>
                    <Card elevation="none" backgroundColor="surface.background.gray.subtle">
                      <CardBody>
                        <Text size="small">{msg.text}</Text>
                      </CardBody>
                    </Card>
                  </Box>
                </Box>
              ) : (
                <Box display="flex" gap="spacing.2" alignItems="flex-start">
                  <Box
                    width="28px" height="28px" borderRadius="round"
                    backgroundColor="surface.background.primary.subtle"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <SparklesIcon size="small" color="interactive.icon.primary.normal" />
                  </Box>
                  <Box flex={1} display="flex" flexDirection="column" gap="spacing.2">
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Text size="xsmall" weight="semibold">AI Agent</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">{msg.time}</Text>
                    </Box>
                    <Card elevation="none" backgroundColor="surface.background.gray.subtle">
                      <CardBody>
                        <Text size="small">{msg.text}</Text>
                      </CardBody>
                    </Card>

                    {/* Product cards */}
                    {msg.products && (
                      <Box display="flex" gap="spacing.2" overflow="auto" paddingBottom="spacing.1">
                        {msg.products.map((p) => (
                          <Card key={p.sku} elevation="none" backgroundColor="surface.background.gray.intense">
                            <CardBody>
                              <Box display="flex" flexDirection="column" gap="spacing.2" width="110px">
                                <Box
                                  height="56px" borderRadius="small"
                                  backgroundColor="surface.background.gray.subtle"
                                  display="flex" alignItems="center" justifyContent="center"
                                >
                                  <PackageIcon size="medium" color="surface.icon.gray.subtle" />
                                </Box>
                                <Text size="xsmall" weight="semibold" truncateAfterLines={2}>{p.name}</Text>
                                <Text size="xsmall" color="interactive.text.primary.normal" weight="semibold">{p.price}</Text>
                              </Box>
                            </CardBody>
                          </Card>
                        ))}
                      </Box>
                    )}

                    {/* Comparison pill */}
                    {msg.comparison && (
                      <Card elevation="none" backgroundColor="surface.background.gray.intense">
                        <CardBody>
                          <Box display="flex" alignItems="center" gap="spacing.2">
                            <InfoIcon size="small" color="interactive.icon.primary.normal" />
                            <Text size="small" weight="semibold" color="interactive.text.primary.normal">{msg.comparison}</Text>
                            <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
                          </Box>
                        </CardBody>
                      </Card>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* ── Tab: AI Actions ── */}
      {activeTab === 'actions' && (
        <Box display="flex" flexDirection="column" gap="spacing.3">
          {aiActions.map((item, i) => (
            <Card key={i} elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Box display="flex" alignItems="center" gap="spacing.3">
                  <Box
                    width="32px" height="32px" borderRadius="small"
                    backgroundColor={item.result === 'success' ? 'surface.background.sea.subtle' : item.result === 'declined' ? 'surface.background.gray.subtle' : 'surface.background.cloud.subtle'}
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <item.icon
                      size="small"
                      color={item.result === 'success' ? 'interactive.icon.positive.normal' : item.result === 'declined' ? 'interactive.icon.negative.normal' : 'interactive.icon.notice.normal'}
                    />
                  </Box>
                  <Box flex={1}>
                    <Text size="small" weight="semibold">{item.action}</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">{item.desc}</Text>
                  </Box>
                  <Badge
                    color={item.result === 'success' ? 'positive' : item.result === 'declined' ? 'negative' : 'notice'}
                    size="small"
                  >
                    {item.result === 'success' ? 'Success' : item.result === 'declined' ? 'Declined' : 'Pending'}
                  </Badge>
                </Box>
              </CardBody>
            </Card>
          ))}
        </Box>
      )}

      {/* ── Tab: Details ── */}
      {activeTab === 'details' && (
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.4">
          <Box>
            <Text size="xsmall" color="surface.text.gray.muted">Customer / AI</Text>
            <Text size="small" weight="semibold" marginTop="spacing.1">{conv.customerName}</Text>
          </Box>
          <Box>
            <Text size="xsmall" color="surface.text.gray.muted">Type</Text>
            <Text size="small" weight="semibold" marginTop="spacing.1">{conv.type}</Text>
          </Box>
          <Box>
            <Text size="xsmall" color="surface.text.gray.muted">Status</Text>
            <Box marginTop="spacing.1"><Badge color={cfg.color} size="small">{cfg.label}</Badge></Box>
          </Box>
          <Box>
            <Text size="xsmall" color="surface.text.gray.muted">Amount</Text>
            <Text size="small" weight="semibold" marginTop="spacing.1">{conv.amount ?? '—'}</Text>
          </Box>
          <Box>
            <Text size="xsmall" color="surface.text.gray.muted">Started At</Text>
            <Text size="small" weight="semibold" marginTop="spacing.1">{conv.startedAt}</Text>
          </Box>
          <Box>
            <Text size="xsmall" color="surface.text.gray.muted">Audit Events</Text>
            <Text size="small" weight="semibold" marginTop="spacing.1">{conv.auditEvents} events</Text>
          </Box>
        </Box>
      )}

      {/* ── Related Resources (always shown) ── */}
      <Box marginTop="spacing.5" paddingTop="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted">
        <Text size="small" weight="semibold" color="surface.text.gray.muted" marginBottom="spacing.3">Related Resources</Text>
        <Box display="flex" flexDirection="column" gap="spacing.2">

          {conv.relatedOrderId && (
            <Link href="/dashboard/orders" style={{ textDecoration: 'none' }}>
              <Card elevation="none" backgroundColor="surface.background.gray.subtle">
                <CardBody>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <ShoppingBagIcon size="small" color="interactive.icon.primary.normal" />
                      <Box>
                        <Text size="xsmall" weight="semibold">Order {conv.relatedOrderId}</Text>
                        {conv.relatedOrderStatus && (
                          <Text size="xsmall" color="interactive.text.notice.normal">{conv.relatedOrderStatus}</Text>
                        )}
                      </Box>
                    </Box>
                    <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
                  </Box>
                </CardBody>
              </Card>
            </Link>
          )}

          {conv.relatedProduct && (
            <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
              <Card elevation="none" backgroundColor="surface.background.gray.subtle">
                <CardBody>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <PackageIcon size="small" color="interactive.icon.primary.normal" />
                      <Box>
                        <Text size="xsmall" color="surface.text.gray.muted">View Product</Text>
                        <Text size="xsmall" weight="semibold">{conv.relatedProduct}</Text>
                      </Box>
                    </Box>
                    <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
                  </Box>
                </CardBody>
              </Card>
            </Link>
          )}

          {conv.relatedInvoiceId && (
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <FileTextIcon size="small" color="interactive.icon.primary.normal" />
                    <Box>
                      <Text size="xsmall" weight="semibold">Invoice {conv.relatedInvoiceId}</Text>
                      <Text size="xsmall" color="interactive.text.positive.normal">Generated</Text>
                    </Box>
                  </Box>
                  <IconButton icon={DownloadIcon} accessibilityLabel="Download invoice" size="small" onClick={() => {}} />
                </Box>
              </CardBody>
            </Card>
          )}

          <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <FileTextIcon size="small" color="interactive.icon.primary.normal" />
                    <Box>
                      <Text size="xsmall" weight="semibold">Audit Trail</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">{conv.auditEvents} events</Text>
                    </Box>
                  </Box>
                  <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
                </Box>
              </CardBody>
            </Card>
          </Link>

          <Card elevation="none" backgroundColor="surface.background.gray.subtle">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <PackageIcon size="small" color="interactive.icon.primary.normal" />
                  <Box>
                    <Text size="xsmall" weight="semibold">Track Shipment</Text>
                    <Text size="xsmall" color={conv.shipmentStatus === '—' ? 'surface.text.gray.muted' : 'interactive.text.notice.normal'}>
                      {conv.shipmentStatus}
                    </Text>
                  </Box>
                </Box>
                <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
              </Box>
            </CardBody>
          </Card>

        </Box>
      </Box>

      {/* Close */}
      <Box marginTop="spacing.5">
        <Button variant="secondary" isFullWidth onClick={onClose}>Close</Button>
      </Box>

      {copied && (
        <Box position="absolute" bottom="spacing.4" left="spacing.6" right="spacing.6" display="flex" justifyContent="center">
          <Badge color="positive" size="medium">Copied!</Badge>
        </Box>
      )}
    </Box>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AIAgentPage() {
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">AI Agent</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Monitor how your AI helps customers and drives more sales for your business.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="tertiary" icon={ExternalLinkIcon} iconPosition="right">
            Learn more
          </Button>
          <Button variant="secondary" icon={SettingsIcon} iconPosition="left">
            AI Agent Settings
          </Button>
        </Box>
      </Box>

      {/* ──────────────────────────────────────────────────────────────────────
          SECTION 1 — AI Overview
      ────────────────────────────────────────────────────────────────────── */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
        <Box display="flex" alignItems="center" gap="spacing.2">
          <Heading size="medium" weight="semibold">AI Overview</Heading>
          <IconButton icon={InfoIcon} accessibilityLabel="Overview info" size="small" onClick={() => {}} />
        </Box>
        <Button variant="tertiary" size="small">View all</Button>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(4,1fr)' }}
        gap="spacing.4"
        marginBottom="spacing.6"
      >
        {/* AI Status */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">AI Status</Text>
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Box width="8px" height="8px" borderRadius="round" backgroundColor="surface.background.sea.intense" />
                  <Heading size="xlarge" weight="semibold" color="interactive.text.positive.normal">Online</Heading>
                </Box>
                <Text size="xsmall" color="surface.text.gray.subtle">All systems operational</Text>
              </Box>
              <Box
                width="32px" height="32px" borderRadius="small"
                backgroundColor="surface.background.sea.subtle"
                display="flex" alignItems="center" justifyContent="center"
              >
                <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Active Conversations */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Active Conversations</Text>
                <Heading size="xlarge" weight="semibold">12</Heading>
                <Text size="xsmall" color="surface.text.gray.subtle">Live right now</Text>
              </Box>
              <Box
                width="32px" height="32px" borderRadius="small"
                backgroundColor="surface.background.primary.subtle"
                display="flex" alignItems="center" justifyContent="center"
              >
                <ZapIcon size="small" color="interactive.icon.primary.normal" />
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Orders Created Today */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Orders Created Today</Text>
                <Heading size="xlarge" weight="semibold">42</Heading>
                <Text size="xsmall" color="interactive.text.positive.normal">↑ 24% vs yesterday</Text>
              </Box>
              <Box
                width="32px" height="32px" borderRadius="small"
                backgroundColor="surface.background.primary.subtle"
                display="flex" alignItems="center" justifyContent="center"
              >
                <ShoppingBagIcon size="small" color="interactive.icon.primary.normal" />
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Revenue Generated Today */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Revenue Generated Today</Text>
                <Heading size="xlarge" weight="semibold">₹1,24,500</Heading>
                <Text size="xsmall" color="interactive.text.positive.normal">↑ 28% vs yesterday</Text>
              </Box>
              <Box
                width="32px" height="32px" borderRadius="small"
                backgroundColor="surface.background.sea.subtle"
                display="flex" alignItems="center" justifyContent="center"
              >
                <TrendingUpIcon size="small" color="interactive.icon.positive.normal" />
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* ──────────────────────────────────────────────────────────────────────
          SECTION 2 — AI Performance
      ────────────────────────────────────────────────────────────────────── */}
      <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.4">
        <Heading size="medium" weight="semibold">AI Performance</Heading>
        <Text size="small" color="surface.text.gray.muted">(Today)</Text>
        <IconButton icon={InfoIcon} accessibilityLabel="Performance info" size="small" onClick={() => {}} />
      </Box>

      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          <Box display="flex" alignItems="center" flexWrap="wrap" gap="spacing.2">

            {/* Customers Helped */}
            <Box flex={1} display="flex" flexDirection="column" alignItems="center" gap="spacing.2" paddingY="spacing.3">
              <Box
                width="40px" height="40px" borderRadius="round"
                backgroundColor="surface.background.gray.subtle"
                display="flex" alignItems="center" justifyContent="center"
              >
                <SparklesIcon size="medium" color="surface.icon.gray.subtle" />
              </Box>
              <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">Customers Helped</Text>
              <Heading size="xlarge" weight="semibold">128</Heading>
            </Box>

            <ArrowRightIcon size="medium" color="surface.icon.gray.subtle" />

            {/* Orders Created */}
            <Box flex={1} display="flex" flexDirection="column" alignItems="center" gap="spacing.2" paddingY="spacing.3">
              <Box
                width="40px" height="40px" borderRadius="round"
                backgroundColor="surface.background.gray.subtle"
                display="flex" alignItems="center" justifyContent="center"
              >
                <ShoppingBagIcon size="medium" color="surface.icon.gray.subtle" />
              </Box>
              <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">Orders Created</Text>
              <Heading size="xlarge" weight="semibold">42</Heading>
            </Box>

            <ArrowRightIcon size="medium" color="surface.icon.gray.subtle" />

            {/* Revenue Generated */}
            <Box flex={1} display="flex" flexDirection="column" alignItems="center" gap="spacing.2" paddingY="spacing.3">
              <Box
                width="40px" height="40px" borderRadius="round"
                backgroundColor="surface.background.gray.subtle"
                display="flex" alignItems="center" justifyContent="center"
              >
                <TrendingUpIcon size="medium" color="surface.icon.gray.subtle" />
              </Box>
              <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">Revenue Generated</Text>
              <Heading size="xlarge" weight="semibold">₹1,24,500</Heading>
            </Box>

            <ArrowRightIcon size="medium" color="surface.icon.gray.subtle" />

            {/* Conversion Rate */}
            <Box flex={1} display="flex" flexDirection="column" alignItems="center" gap="spacing.2" paddingY="spacing.3">
              <Box
                width="40px" height="40px" borderRadius="round"
                backgroundColor="surface.background.primary.subtle"
                display="flex" alignItems="center" justifyContent="center"
              >
                <ZapIcon size="medium" color="interactive.icon.primary.normal" />
              </Box>
              <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">Conversion Rate</Text>
              <Heading size="xlarge" weight="semibold" color="interactive.text.primary.normal">32%</Heading>
            </Box>

          </Box>
        </CardBody>
      </Card>

      {/* ──────────────────────────────────────────────────────────────────────
          SECTIONS 3 + 4 + 6 — two-column layout
      ────────────────────────────────────────────────────────────────────── */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '1fr 1fr' }} gap="spacing.6">

        {/* LEFT COLUMN: Business Insights + Needs Attention */}
        <Box display="flex" flexDirection="column" gap="spacing.6">

          {/* SECTION 3: Business Insights */}
          <Box>
            <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.4">
              <Heading size="medium" weight="semibold">Business Insights</Heading>
              <IconButton icon={InfoIcon} accessibilityLabel="Insights info" size="small" onClick={() => {}} />
            </Box>

            <Box display="flex" flexDirection="column" gap="spacing.4">

              {/* Insight 1: Bundle Recommendation */}
              <Card elevation="none" backgroundColor="surface.background.gray.intense">
                <CardBody>
                  <Box display="flex" gap="spacing.4" alignItems="flex-start">
                    <Box
                      width="36px" height="36px" borderRadius="small"
                      backgroundColor="surface.background.primary.subtle"
                      display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                    >
                      <ShoppingBagIcon size="small" color="interactive.icon.primary.normal" />
                    </Box>
                    <Box flex={1} display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="small">
                        Customers buying <Text as="span" size="small" weight="semibold">Gaming Laptop</Text> also purchased{' '}
                        <Text as="span" size="small" weight="semibold">Mouse and Keyboard.</Text>
                      </Text>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginTop="spacing.1">
                        <Box>
                          <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">Recommended Action</Text>
                          <Text size="small" weight="semibold" color="interactive.text.primary.normal">
                            Enable Bundle Recommendation
                          </Text>
                          <Box marginTop="spacing.1">
                            <Text size="xsmall" color="surface.text.gray.muted">Estimated Extra Revenue</Text>
                            <Text size="small" weight="semibold" color="interactive.text.positive.normal">₹8,200</Text>
                          </Box>
                        </Box>
                        <Button variant="primary" size="small">Enable</Button>
                      </Box>
                    </Box>
                  </Box>
                </CardBody>
              </Card>

              {/* Insight 2: Missed Search */}
              <Card elevation="none" backgroundColor="surface.background.gray.intense">
                <CardBody>
                  <Box display="flex" gap="spacing.4" alignItems="flex-start">
                    <Box
                      width="36px" height="36px" borderRadius="small"
                      backgroundColor="surface.background.cloud.subtle"
                      display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                    >
                      <SearchIcon size="small" color="interactive.icon.notice.normal" />
                    </Box>
                    <Box flex={1} display="flex" flexDirection="column" gap="spacing.2">
                      <Text size="small">
                        <Text as="span" size="small" weight="semibold">17 customers</Text> searched for{' '}
                        <Text as="span" size="small" weight="semibold">"Mechanical Keyboard"</Text> but no matching product was found.
                      </Text>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-end" marginTop="spacing.1">
                        <Box>
                          <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">Potential Missed Revenue</Text>
                          <Text size="small" weight="semibold" color="interactive.text.negative.normal">₹4,350</Text>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="flex-end" gap="spacing.2">
                          <Badge color="notice" size="small">High Opportunity</Badge>
                          <Link href="/dashboard/import" style={{ textDecoration: 'none' }}>
                            <Button variant="secondary" size="small">Add Product</Button>
                          </Link>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardBody>
              </Card>

            </Box>
          </Box>

          {/* SECTION 6: Needs Attention */}
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Heading size="medium" weight="semibold">Needs Attention</Heading>
                <IconButton icon={InfoIcon} accessibilityLabel="Attention info" size="small" onClick={() => {}} />
              </Box>
              <Button variant="tertiary" size="small">Review all</Button>
            </Box>

            <Card elevation="none" backgroundColor="surface.background.gray.intense">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.3">

                  <Box display="flex" alignItems="center" gap="spacing.4">
                    <Box
                      width="36px" height="36px" borderRadius="small"
                      backgroundColor="surface.background.cloud.subtle"
                      display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                    >
                      <ClockIcon size="small" color="interactive.icon.notice.normal" />
                    </Box>
                    <Box flex={1}>
                      <Text size="small" weight="semibold">3</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Conversations waiting for payment</Text>
                    </Box>
                    <Button variant="secondary" size="small" onClick={() => setSelectedConv(MOCK_CONVERSATIONS[0])}>Review</Button>
                  </Box>

                  <Box borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3" display="flex" alignItems="center" gap="spacing.4">
                    <Box
                      width="36px" height="36px" borderRadius="small"
                      backgroundColor="surface.background.gray.subtle"
                      display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                    >
                      <AlertCircleIcon size="small" color="interactive.icon.negative.normal" />
                    </Box>
                    <Box flex={1}>
                      <Text size="small" weight="semibold">1</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Customer requested human support</Text>
                    </Box>
                    <Button variant="secondary" size="small">Review</Button>
                  </Box>

                  <Box borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3" display="flex" alignItems="center" gap="spacing.4">
                    <Box
                      width="36px" height="36px" borderRadius="small"
                      backgroundColor="surface.background.cloud.subtle"
                      display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                    >
                      <PackageIcon size="small" color="interactive.icon.notice.normal" />
                    </Box>
                    <Box flex={1}>
                      <Text size="small" weight="semibold">2</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Products out of stock</Text>
                    </Box>
                    <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
                      <Button variant="secondary" size="small">Review</Button>
                    </Link>
                  </Box>

                </Box>
              </CardBody>
            </Card>
          </Box>

        </Box>

        {/* RIGHT COLUMN: Live Conversations */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Heading size="medium" weight="semibold">Live Conversations</Heading>
              <IconButton icon={InfoIcon} accessibilityLabel="Conversations info" size="small" onClick={() => {}} />
            </Box>
            <Button variant="tertiary" size="small">View all</Button>
          </Box>

          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column">

                {MOCK_CONVERSATIONS.map((conv, idx) => {
                  const cfg = statusConfig[conv.status];
                  const isHuman = conv.type === 'Human Customer';
                  const isSelected = selectedConv?.id === conv.id;

                  return (
                    <Box
                      key={conv.id}
                      display="flex"
                      alignItems="center"
                      gap="spacing.3"
                      paddingY="spacing.4"
                      paddingX="spacing.3"
                      borderBottomWidth={idx !== MOCK_CONVERSATIONS.length - 1 ? 'thin' : 'none'}
                      borderBottomColor="surface.border.gray.muted"
                      backgroundColor={isSelected ? 'surface.background.primary.subtle' : 'transparent'}
                      borderRadius={isSelected ? 'small' : 'none'}
                    >
                      {/* Avatar */}
                      <Box
                        width="40px" height="40px" borderRadius="round"
                        backgroundColor={isHuman ? 'surface.background.gray.subtle' : 'surface.background.primary.subtle'}
                        borderWidth="thin" borderColor="surface.border.gray.muted"
                        display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                      >
                        {isHuman ? (
                          <Text size="small" weight="semibold">{conv.customerName[0]}</Text>
                        ) : (
                          <SparklesIcon size="small" color="interactive.icon.primary.normal" />
                        )}
                      </Box>

                      {/* Name + Type */}
                      <Box flex={1} display="flex" flexDirection="column" gap="spacing.1">
                        <Text size="small" weight="semibold">{conv.customerName}</Text>
                        <Text size="xsmall" color="surface.text.gray.muted">{conv.type}</Text>
                      </Box>

                      {/* Status */}
                      <Badge color={cfg.color} size="small">{cfg.label}</Badge>

                      {/* Amount */}
                      <Box width="72px" textAlign="right">
                        <Text size="small" weight="semibold" color="surface.text.gray.normal">
                          {conv.amount ?? '—'}
                        </Text>
                      </Box>

                      {/* Open button */}
                      <IconButton
                        icon={ChevronRightIcon}
                        accessibilityLabel={`Open conversation with ${conv.customerName}`}
                        size="small"
                        onClick={() => setSelectedConv(isSelected ? null : conv)}
                      />
                    </Box>
                  );
                })}

              </Box>
            </CardBody>
          </Card>

          <Box marginTop="spacing.4" display="flex" justifyContent="center">
            <Button variant="tertiary" size="small">View all conversations</Button>
          </Box>
        </Box>

      </Box>

      {/* ── Conversation Detail Drawer ── */}
      {selectedConv && (
        <ConversationDrawer
          conv={selectedConv}
          onClose={() => setSelectedConv(null)}
        />
      )}

    </Box>
  );
}
