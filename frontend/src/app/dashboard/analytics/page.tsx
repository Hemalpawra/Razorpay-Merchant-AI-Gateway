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
  ProgressBar,
  // Icons
  DownloadIcon,
  CalendarIcon,
  TrendingUpIcon,
  ShoppingBagIcon,
  SparklesIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  PackageIcon,
  ZapIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ClockIcon,
  SearchIcon,
  ChevronDownIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

// ─── Sparkline SVG helper ──────────────────────────────────────────────────────

function MiniSparkline({ color }: { color: string }) {
  return (
    <svg width="100%" height="28" viewBox="0 0 120 28" fill="none">
      <path
        d="M0 22 C 15 22, 20 12, 35 15 C 50 18, 55 8, 70 12 C 85 16, 95 4, 120 2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ─── Main Chart SVG ────────────────────────────────────────────────────────────

function RevenueLineChart() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.2" width="100%">
      <svg width="100%" height="150" viewBox="0 0 400 150" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2B6CB0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2B6CB0" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        <line x1="0" y1="20" x2="400" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
        <line x1="0" y1="60" x2="400" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />
        <line x1="0" y1="140" x2="400" y2="140" stroke="#E2E8F0" strokeDasharray="3 3" />

        {/* Filled area */}
        <path
          d="M 0,110 L 40,105 L 80,85 L 120,115 L 160,95 L 200,105 L 240,80 L 280,90 L 320,65 L 360,60 L 400,30 L 400,140 L 0,140 Z"
          fill="url(#revenueGrad)"
        />

        {/* Line */}
        <path
          d="M 0,110 L 40,105 L 80,85 L 120,115 L 160,95 L 200,105 L 240,80 L 280,90 L 320,65 L 360,60 L 400,30"
          stroke="#0066CC"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End dot */}
        <circle cx="400" cy="30" r="4" fill="#0066CC" />
      </svg>
      <Box display="flex" justifyContent="space-between" paddingX="spacing.1">
        <Text size="xsmall" color="surface.text.gray.muted">21 May</Text>
        <Text size="xsmall" color="surface.text.gray.muted">26 May</Text>
        <Text size="xsmall" color="surface.text.gray.muted">31 May</Text>
        <Text size="xsmall" color="surface.text.gray.muted">5 Jun</Text>
        <Text size="xsmall" color="surface.text.gray.muted">10 Jun</Text>
        <Text size="xsmall" color="surface.text.gray.muted">15 Jun</Text>
        <Text size="xsmall" color="surface.text.gray.muted">21 Jun</Text>
      </Box>
    </Box>
  );
}

function OrdersLineChart() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.2" width="100%">
      <svg width="100%" height="150" viewBox="0 0 400 150" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3182CE" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3182CE" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        <line x1="0" y1="20" x2="400" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
        <line x1="0" y1="60" x2="400" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
        <line x1="0" y1="100" x2="400" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />
        <line x1="0" y1="140" x2="400" y2="140" stroke="#E2E8F0" strokeDasharray="3 3" />

        {/* Filled area */}
        <path
          d="M 0,125 L 40,110 L 80,95 L 120,115 L 160,85 L 200,90 L 240,75 L 280,85 L 320,60 L 360,55 L 400,40 L 400,140 L 0,140 Z"
          fill="url(#ordersGrad)"
        />

        {/* Line */}
        <path
          d="M 0,125 L 40,110 L 80,95 L 120,115 L 160,85 L 200,90 L 240,75 L 280,85 L 320,60 L 360,55 L 400,40"
          stroke="#2B6CB0"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End dot */}
        <circle cx="400" cy="40" r="4" fill="#2B6CB0" />
      </svg>
      <Box display="flex" justifyContent="space-between" paddingX="spacing.1">
        <Text size="xsmall" color="surface.text.gray.muted">21 May</Text>
        <Text size="xsmall" color="surface.text.gray.muted">26 May</Text>
        <Text size="xsmall" color="surface.text.gray.muted">31 May</Text>
        <Text size="xsmall" color="surface.text.gray.muted">5 Jun</Text>
        <Text size="xsmall" color="surface.text.gray.muted">10 Jun</Text>
        <Text size="xsmall" color="surface.text.gray.muted">15 Jun</Text>
        <Text size="xsmall" color="surface.text.gray.muted">21 Jun</Text>
      </Box>
    </Box>
  );
}

// ─── Donut Chart Representation ───────────────────────────────────────────────

function SourceDonutChart() {
  const sources = [
    { label: 'Human Customer', value: '₹2,65,450', pct: '36.6%', color: '#2563EB' },
    { label: 'ChatGPT', value: '₹1,86,240', pct: '25.7%', color: '#38BDF8' },
    { label: 'Claude', value: '₹1,25,300', pct: '17.3%', color: '#A855F7' },
    { label: 'Gemini', value: '₹85,600', pct: '11.8%', color: '#F59E0B' },
    { label: 'Grok', value: '₹36,970', pct: '5.1%', color: '#64748B' },
    { label: 'Merchant AI', value: '₹24,000', pct: '3.3%', color: '#10B981' },
  ];

  return (
    <Box display="flex" alignItems="center" gap="spacing.5">
      {/* SVG Donut */}
      <Box position="relative" width="130px" height="130px" flexShrink={0}>
        <svg width="130" height="130" viewBox="0 0 42 42">
          {/* Segments */}
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="#2563EB" strokeWidth="6" strokeDasharray="36.6 63.4" strokeDashoffset="25" />
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="#38BDF8" strokeWidth="6" strokeDasharray="25.7 74.3" strokeDashoffset="-11.6" />
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="#A855F7" strokeWidth="6" strokeDasharray="17.3 82.7" strokeDashoffset="-37.3" />
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="6" strokeDasharray="11.8 88.2" strokeDashoffset="-54.6" />
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="#64748B" strokeWidth="6" strokeDasharray="5.1 94.9" strokeDashoffset="-66.4" />
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="#10B981" strokeWidth="6" strokeDasharray="3.3 96.7" strokeDashoffset="-71.5" />
        </svg>
        <Box
          position="absolute"
          top="spacing.0" left="spacing.0" right="spacing.0" bottom="spacing.0"
          display="flex" flexDirection="column" alignItems="center" justifyContent="center"
        >
          <Text size="xsmall" weight="semibold" color="interactive.text.primary.normal">₹7,24,560</Text>
          <Text size="xsmall" color="surface.text.gray.muted">Total</Text>
        </Box>
      </Box>

      {/* Legend */}
      <Box display="flex" flexDirection="column" gap="spacing.1" flex={1}>
        {sources.map((s, idx) => (
          <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Box width="8px" height="8px" borderRadius="round" backgroundColor={s.color as any} />
              <Text size="xsmall" color="surface.text.gray.normal">{s.label}</Text>
            </Box>
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Text size="xsmall" weight="semibold">{s.value}</Text>
              <Text size="xsmall" color="surface.text.gray.subtle">({s.pct})</Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Analytics</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Track how AI conversations are impacting your business and revenue.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="tertiary" icon={CalendarIcon} iconPosition="left">
            21 May – 21 Jun 2025
          </Button>
          <Button variant="secondary" icon={DownloadIcon} iconPosition="left">
            Export report
          </Button>
        </Box>
      </Box>

      {/* ──────────────────────────────────────────────────────────────────────
          SECTION 1 — Summary Cards (4 Cards)
      ────────────────────────────────────────────────────────────────────── */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(4,1fr)' }}
        gap="spacing.4"
        marginBottom="spacing.6"
      >
        {/* Card 1: Revenue Generated */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Revenue Generated</Text>
                <IconButton icon={InfoIcon} accessibilityLabel="Revenue info" size="small" onClick={() => {}} />
              </Box>
              <Heading size="xlarge" weight="semibold">₹7,24,560</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">
                ↑ 28% vs 21 Apr – 20 May
              </Text>
              <Box marginTop="spacing.1">
                <MiniSparkline color="#10B981" />
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Card 2: Orders Created */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Orders Created</Text>
                <IconButton icon={InfoIcon} accessibilityLabel="Orders info" size="small" onClick={() => {}} />
              </Box>
              <Heading size="xlarge" weight="semibold">256</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">
                ↑ 18% vs 21 Apr – 20 May
              </Text>
              <Box marginTop="spacing.1">
                <MiniSparkline color="#2563EB" />
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Card 3: AI Conversion Rate */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">AI Conversion Rate</Text>
                <IconButton icon={InfoIcon} accessibilityLabel="Conversion info" size="small" onClick={() => {}} />
              </Box>
              <Heading size="xlarge" weight="semibold">32.8%</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">
                ↑ 6.5% vs 21 Apr – 20 May
              </Text>
              <Box marginTop="spacing.1">
                <MiniSparkline color="#8B5CF6" />
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Card 4: Upsell Revenue */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Upsell Revenue</Text>
                <IconButton icon={InfoIcon} accessibilityLabel="Upsell info" size="small" onClick={() => {}} />
              </Box>
              <Heading size="xlarge" weight="semibold">₹48,250</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">
                ↑ 35% vs 21 Apr – 20 May
              </Text>
              <Box marginTop="spacing.1">
                <MiniSparkline color="#F59E0B" />
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* ──────────────────────────────────────────────────────────────────────
          SECTION 2 — Performance Overview (2 Charts + Snapshot Card)
      ────────────────────────────────────────────────────────────────────── */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', l: '1.2fr 1.2fr 0.9fr' }}
        gap="spacing.4"
        marginBottom="spacing.6"
      >
        {/* Chart 1: Revenue Over Time */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold">Revenue Over Time</Text>
                  <IconButton icon={InfoIcon} accessibilityLabel="Revenue chart info" size="small" onClick={() => {}} />
                </Box>
                <Button variant="tertiary" size="small" icon={ChevronDownIcon} iconPosition="right">
                  Daily
                </Button>
              </Box>
              <RevenueLineChart />
            </Box>
          </CardBody>
        </Card>

        {/* Chart 2: Orders from AI Conversations */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold">Orders from AI Conversations</Text>
                  <IconButton icon={InfoIcon} accessibilityLabel="Orders chart info" size="small" onClick={() => {}} />
                </Box>
                <Button variant="tertiary" size="small" icon={ChevronDownIcon} iconPosition="right">
                  Daily
                </Button>
              </Box>
              <OrdersLineChart />
            </Box>
          </CardBody>
        </Card>

        {/* Card 3: AI Performance Snapshot */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold">AI Performance Snapshot</Text>
                  <IconButton icon={InfoIcon} accessibilityLabel="Snapshot info" size="small" onClick={() => {}} />
                </Box>
                <Button variant="tertiary" size="small" icon={ChevronDownIcon} iconPosition="right">
                  Today
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.3">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Box
                      width="28px" height="28px" borderRadius="small"
                      backgroundColor="surface.background.sea.subtle"
                      display="flex" alignItems="center" justifyContent="center"
                    >
                      <SparklesIcon size="small" color="interactive.icon.positive.normal" />
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.normal">Customers Helped</Text>
                  </Box>
                  <Text size="small" weight="semibold">128</Text>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Box
                      width="28px" height="28px" borderRadius="small"
                      backgroundColor="surface.background.primary.subtle"
                      display="flex" alignItems="center" justifyContent="center"
                    >
                      <ShoppingBagIcon size="small" color="interactive.icon.primary.normal" />
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.normal">Orders Created</Text>
                  </Box>
                  <Text size="small" weight="semibold">42</Text>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Box
                      width="28px" height="28px" borderRadius="small"
                      backgroundColor="surface.background.sea.subtle"
                      display="flex" alignItems="center" justifyContent="center"
                    >
                      <TrendingUpIcon size="small" color="interactive.icon.positive.normal" />
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.normal">Revenue Generated</Text>
                  </Box>
                  <Text size="small" weight="semibold">₹1,24,500</Text>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Box
                      width="28px" height="28px" borderRadius="small"
                      backgroundColor="surface.background.cloud.subtle"
                      display="flex" alignItems="center" justifyContent="center"
                    >
                      <ZapIcon size="small" color="interactive.icon.notice.normal" />
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.normal">Upsell Revenue</Text>
                  </Box>
                  <Text size="small" weight="semibold">₹8,200</Text>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* ──────────────────────────────────────────────────────────────────────
          SECTION 3 — Middle Row (Top Products | Funnel | Revenue by Source)
      ────────────────────────────────────────────────────────────────────── */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', l: '1.2fr 1fr 1fr' }}
        gap="spacing.4"
        marginBottom="spacing.6"
      >
        {/* Top Products */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold">Top Products</Text>
                  <IconButton icon={InfoIcon} accessibilityLabel="Top products info" size="small" onClick={() => {}} />
                </Box>
              </Box>

              {/* Mini Table */}
              <Box display="flex" flexDirection="column">
                <Box
                  display="grid" gridTemplateColumns="2fr 0.8fr 1.2fr 1fr 1.1fr" gap="spacing.2"
                  paddingY="spacing.2" borderBottomWidth="thin" borderBottomColor="surface.border.gray.muted"
                >
                  <Text size="xsmall" color="surface.text.gray.muted">Product</Text>
                  <Text size="xsmall" color="surface.text.gray.muted" textAlign="right">Orders</Text>
                  <Text size="xsmall" color="surface.text.gray.muted" textAlign="right">Revenue</Text>
                  <Text size="xsmall" color="surface.text.gray.muted" textAlign="right">Conv Rate</Text>
                  <Text size="xsmall" color="surface.text.gray.muted" textAlign="right">Upsell</Text>
                </Box>

                {[
                  { name: 'Asus TUF F15', orders: 78, revenue: '₹4,15,620', conv: '36.4%', upsell: '₹22,450' },
                  { name: 'Lenovo IdeaPad Gaming 3', orders: 56, revenue: '₹2,25,850', conv: '31.2%', upsell: '₹15,200' },
                  { name: 'Mechanical Keyboard', orders: 42, revenue: '₹48,300', conv: '28.6%', upsell: '₹4,800' },
                  { name: 'Wireless Mouse', orders: 38, revenue: '₹22,420', conv: '26.1%', upsell: '₹2,600' },
                  { name: 'Gaming Headset', orders: 21, revenue: '₹12,370', conv: '23.7%', upsell: '₹1,200' },
                ].map((item, idx) => (
                  <Box
                    key={idx} display="grid" gridTemplateColumns="2fr 0.8fr 1.2fr 1fr 1.1fr" gap="spacing.2"
                    paddingY="spacing.2" alignItems="center"
                    borderBottomWidth={idx !== 4 ? 'thin' : 'none'} borderBottomColor="surface.border.gray.muted"
                  >
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Box
                        width="24px" height="24px" borderRadius="small"
                        backgroundColor="surface.background.gray.subtle"
                        display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                      >
                        <PackageIcon size="small" color="surface.icon.gray.subtle" />
                      </Box>
                      <Text size="xsmall" weight="semibold" truncateAfterLines={1}>{item.name}</Text>
                    </Box>
                    <Text size="xsmall" textAlign="right">{item.orders}</Text>
                    <Text size="xsmall" weight="semibold" textAlign="right">{item.revenue}</Text>
                    <Text size="xsmall" textAlign="right" color="interactive.text.positive.normal">{item.conv}</Text>
                    <Text size="xsmall" textAlign="right" color="interactive.text.positive.normal">{item.upsell}</Text>
                  </Box>
                ))}
              </Box>

              <Box display="flex" justifyContent="center" marginTop="spacing.2">
                <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="small" icon={ArrowRightIcon} iconPosition="right">
                    View all products
                  </Button>
                </Link>
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Conversation to Order Funnel */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold">Conversation to Order Funnel</Text>
                  <IconButton icon={InfoIcon} accessibilityLabel="Funnel info" size="small" onClick={() => {}} />
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.3">
                {[
                  { step: 'Conversations Started', count: '1,248', pct: '100%', val: 100, icon: SparklesIcon },
                  { step: 'Products Recommended', count: '984', pct: '78.8%', val: 78.8, icon: PackageIcon },
                  { step: 'Added to Checkout', count: '412', pct: '41.9%', val: 41.9, icon: ShoppingBagIcon },
                  { step: 'Orders Created', count: '256', pct: '25.8%', val: 25.8, icon: FileTextIcon },
                  { step: 'Payments Completed', count: '231', pct: '22.9%', val: 22.9, icon: CheckCircleIcon },
                ].map((f, i) => (
                  <Box key={i} display="flex" flexDirection="column" gap="spacing.1">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="spacing.2">
                        <f.icon size="small" color="interactive.icon.primary.normal" />
                        <Text size="xsmall" color="surface.text.gray.normal">{f.step}</Text>
                      </Box>
                      <Box display="flex" gap="spacing.2">
                        <Text size="xsmall" weight="semibold">{f.count}</Text>
                        <Text size="xsmall" color="surface.text.gray.muted">({f.pct})</Text>
                      </Box>
                    </Box>
                    <Box width="100%" height="8px" borderRadius="round" backgroundColor="surface.background.gray.subtle">
                      <Box
                        width={`${f.val}%`} height="100%" borderRadius="round"
                        backgroundColor="surface.background.primary.intense"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box display="flex" justifyContent="center" marginTop="spacing.2">
                <Button variant="tertiary" size="small" icon={ArrowRightIcon} iconPosition="right">
                  View full funnel
                </Button>
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Revenue by Source */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold">Revenue by Source</Text>
                  <IconButton icon={InfoIcon} accessibilityLabel="Source info" size="small" onClick={() => {}} />
                </Box>
              </Box>

              <SourceDonutChart />

              <Box display="flex" justifyContent="center" marginTop="spacing.1">
                <Button variant="tertiary" size="small" icon={ArrowRightIcon} iconPosition="right">
                  View detailed report
                </Button>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* ──────────────────────────────────────────────────────────────────────
          SECTION 4 — Bottom Row (Upsell Insights | Needs Attention | Recent Activity)
      ────────────────────────────────────────────────────────────────────── */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', l: '1.2fr 1fr 1fr' }}
        gap="spacing.4"
      >
        {/* Upsell & Cross-sell Insights */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold">Upsell & Cross-sell Insights</Text>
                  <IconButton icon={InfoIcon} accessibilityLabel="Upsell insights info" size="small" onClick={() => {}} />
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.3">
                <Box display="flex" gap="spacing.3" alignItems="flex-start">
                  <Box
                    width="32px" height="32px" borderRadius="small"
                    backgroundColor="surface.background.primary.subtle"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <ShoppingBagIcon size="small" color="interactive.icon.primary.normal" />
                  </Box>
                  <Box flex={1} display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Text size="xsmall" color="surface.text.gray.normal">
                      Customers buying <Text as="span" size="xsmall" weight="semibold">Gaming Laptop</Text> also purchased <Text as="span" size="xsmall" weight="semibold">Mouse and Keyboard.</Text>
                    </Text>
                    <Box textAlign="right" marginLeft="spacing.2">
                      <Text size="xsmall" color="surface.text.gray.muted">Extra Revenue</Text>
                      <Text size="xsmall" weight="semibold" color="interactive.text.positive.normal">₹8,200</Text>
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" gap="spacing.3" alignItems="flex-start" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box
                    width="32px" height="32px" borderRadius="small"
                    backgroundColor="surface.background.sea.subtle"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <TrendingUpIcon size="small" color="interactive.icon.positive.normal" />
                  </Box>
                  <Box flex={1} display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Text size="xsmall" color="surface.text.gray.normal">
                      Bundle recommendations increased revenue by
                    </Text>
                    <Box textAlign="right" marginLeft="spacing.2">
                      <Text size="xsmall" color="surface.text.gray.muted">Revenue Impact</Text>
                      <Text size="xsmall" weight="semibold" color="interactive.text.positive.normal">₹14,300</Text>
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" gap="spacing.3" alignItems="flex-start" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box
                    width="32px" height="32px" borderRadius="small"
                    backgroundColor="surface.background.cloud.subtle"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <ZapIcon size="small" color="interactive.icon.notice.normal" />
                  </Box>
                  <Box flex={1} display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Text size="xsmall" color="surface.text.gray.normal">
                      Premium product suggestions converted better than standard recommendations.
                    </Text>
                    <Box textAlign="right" marginLeft="spacing.2">
                      <Text size="xsmall" color="surface.text.gray.muted">Conversion Impact</Text>
                      <Text size="xsmall" weight="semibold" color="interactive.text.positive.normal">↑ 18%</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" justifyContent="center" marginTop="spacing.1">
                <Button variant="tertiary" size="small" icon={ArrowRightIcon} iconPosition="right">
                  View all insights
                </Button>
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Needs Attention */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold">Needs Attention</Text>
                  <IconButton icon={InfoIcon} accessibilityLabel="Attention info" size="small" onClick={() => {}} />
                </Box>
                <Button variant="tertiary" size="small">View all</Button>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.3">
                <Box display="flex" alignItems="center" gap="spacing.3">
                  <Box
                    width="32px" height="32px" borderRadius="small"
                    backgroundColor="surface.background.gray.subtle"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <AlertTriangleIcon size="small" color="interactive.icon.negative.normal" />
                  </Box>
                  <Box flex={1}>
                    <Text size="xsmall" weight="semibold">3 high-value conversations were abandoned</Text>
                    <Text size="xsmall" color="interactive.text.negative.normal">Potential Revenue: ₹28,450</Text>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap="spacing.3" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box
                    width="32px" height="32px" borderRadius="small"
                    backgroundColor="surface.background.cloud.subtle"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <AlertCircleIcon size="small" color="interactive.icon.notice.normal" />
                  </Box>
                  <Box flex={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Text size="xsmall" weight="semibold">2 products have low conversion rate</Text>
                    <Text size="xsmall" color="interactive.text.primary.normal">Check now →</Text>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap="spacing.3" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box
                    width="32px" height="32px" borderRadius="small"
                    backgroundColor="surface.background.cloud.subtle"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <ClockIcon size="small" color="interactive.icon.notice.normal" />
                  </Box>
                  <Box flex={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Text size="xsmall" weight="semibold">1 payment failure pattern detected</Text>
                    <Text size="xsmall" color="interactive.text.primary.normal">Check now →</Text>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap="spacing.3" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box
                    width="32px" height="32px" borderRadius="small"
                    backgroundColor="surface.background.cloud.subtle"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <PackageIcon size="small" color="interactive.icon.notice.normal" />
                  </Box>
                  <Box flex={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Text size="xsmall" weight="semibold">2 products are out of stock</Text>
                    <Text size="xsmall" color="interactive.text.primary.normal">Manage stock →</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Text size="small" weight="semibold">Recent Activity</Text>
                  <IconButton icon={InfoIcon} accessibilityLabel="Activity info" size="small" onClick={() => {}} />
                </Box>
                <Button variant="tertiary" size="small">View all</Button>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.3">
                {[
                  { text: 'AI recommended a product bundle', time: '10:31 AM', icon: SparklesIcon, color: 'positive' as const },
                  { text: 'Customer completed payment for order ORD-10231', time: '10:28 AM', icon: CheckCircleIcon, color: 'positive' as const },
                  { text: 'Upsell accepted for order ORD-10230', time: '10:21 AM', icon: ZapIcon, color: 'positive' as const },
                  { text: 'Payment failed for order ORD-10229', time: '09:48 AM', icon: AlertCircleIcon, color: 'negative' as const },
                  { text: 'Order created from conversation CONV-1032', time: '09:41 AM', icon: ShoppingBagIcon, color: 'information' as const },
                ].map((act, i) => (
                  <Box key={i} display="flex" alignItems="center" justifyContent="space-between" gap="spacing.2">
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Box
                        width="24px" height="24px" borderRadius="round"
                        backgroundColor={act.color === 'positive' ? 'surface.background.sea.subtle' : act.color === 'negative' ? 'surface.background.gray.subtle' : 'surface.background.primary.subtle'}
                        display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                      >
                        <act.icon size="xsmall" color={`interactive.icon.${act.color}.normal` as any} />
                      </Box>
                      <Text size="xsmall" color="surface.text.gray.normal" truncateAfterLines={1}>{act.text}</Text>
                    </Box>
                    <Box flexShrink={0}>
                      <Text size="xsmall" color="surface.text.gray.muted">{act.time}</Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

    </Box>
  );
}
