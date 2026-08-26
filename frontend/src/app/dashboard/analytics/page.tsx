'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  IconButton,
  DownloadIcon,
  CalendarIcon,
  TrendingUpIcon,
  ShoppingBagIcon,
  SparklesIcon,
  CheckCircleIcon,
  PackageIcon,
  ZapIcon,
  InfoIcon,
  Alert
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalyticsData() {
      setIsLoading(true);
      try {
        const [resSess, resOrd, resProd] = await Promise.all([
          fetch('/api/sessions').then(r => r.json()),
          fetch('/api/orders').then(r => r.json()),
          fetch('/api/products').then(r => r.json())
        ]);
        if (resSess.sessions) setSessions(resSess.sessions);
        if (resOrd.orders) setOrders(resOrd.orders);
        if (resProd.products) setProducts(resProd.products);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalyticsData();
  }, []);

  const paidOrders = orders.filter(o => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
  const conversionRate = sessions.length > 0 ? ((paidOrders.length / sessions.length) * 100).toFixed(1) : '0.0';

  const multiItemPaid = paidOrders.filter(o => Array.isArray(o.order_items) && o.order_items.length > 1);
  const upsellRevenue = multiItemPaid.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);

  const revenueBySource = useMemo(() => {
    const totals = new Map<string, number>();
    for (const order of paidOrders) {
      const session = Array.isArray(order.buyer_sessions) ? order.buyer_sessions[0] : order.buyer_sessions;
      const source = session?.external_ai_name ? session.external_ai_name : order.session_id ? 'Merchant AI' : 'Human Customer';
      totals.set(source, (totals.get(source) ?? 0) + (parseFloat(order.amount) || 0));
    }
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [paidOrders]);
  const maxSourceRevenue = Math.max(1, ...revenueBySource.map(([, value]) => value));

  const topProducts = useMemo(() => {
    const counts = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const order of paidOrders) {
      for (const item of order.order_items ?? []) {
        const entry = counts.get(item.sku) ?? { name: item.name, qty: 0, revenue: 0 };
        entry.qty += Number(item.qty) || 0;
        entry.revenue += Number(item.line_total) || 0;
        counts.set(item.sku, entry);
      }
    }
    return Array.from(counts.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [paidOrders]);

  const waitingForPayment = sessions.filter(s => s.status === 'checkout_ready');
  const outOfStock = products.filter(p => Number(p.stock_qty ?? 0) <= 0);
  const needsAttentionCount = waitingForPayment.length + outOfStock.length;

  const bestSeller = topProducts[0];

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Analytics</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Track how AI conversations and database transactions impact your business and revenue.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="secondary" icon={DownloadIcon} iconPosition="left">
            Export report
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(4,1fr)' }} gap="spacing.4" marginBottom="spacing.6">
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Total Revenue</Text>
              <Heading size="xlarge" weight="semibold">{`₹${totalRevenue.toLocaleString('en-IN')}`}</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">From verified orders</Text>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Orders Created</Text>
              <Heading size="xlarge" weight="semibold">{orders.length}</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">{`${paidOrders.length} Paid`}</Text>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">AI Conversion Rate</Text>
              <Heading size="xlarge" weight="semibold">{`${conversionRate}%`}</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">Sessions converted to orders</Text>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Upsell Revenue</Text>
              <Heading size="xlarge" weight="semibold">{`₹${upsellRevenue.toLocaleString('en-IN')}`}</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">{`${multiItemPaid.length} multi-product orders`}</Text>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Revenue by Source + Top Products */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: 'repeat(2,1fr)' }} gap="spacing.4" marginBottom="spacing.6">
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Heading size="small" marginBottom="spacing.4">Revenue by Source</Heading>
            {revenueBySource.length === 0 ? (
              <Text size="small" color="surface.text.gray.muted">No paid revenue recorded yet.</Text>
            ) : (
              revenueBySource.map(([source, value]) => (
                <Box key={source} marginBottom="spacing.3">
                  <Box display="flex" justifyContent="space-between" marginBottom="spacing.1">
                    <Text size="xsmall" weight="semibold">{source}</Text>
                    <Text size="xsmall">{`₹${value.toLocaleString('en-IN')}`}</Text>
                  </Box>
                  <Box height="6px" borderRadius="round" backgroundColor="surface.background.gray.subtle">
                    <Box height="6px" borderRadius="round" width={`${Math.max(8, (value / maxSourceRevenue) * 100)}%`} backgroundColor={'interactive.background.primary.default' as any} />
                  </Box>
                </Box>
              ))
            )}
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Heading size="small" marginBottom="spacing.4">Top Products (Paid Orders)</Heading>
            {topProducts.length === 0 ? (
              <Text size="small" color="surface.text.gray.muted">No product sales recorded yet.</Text>
            ) : (
              topProducts.map((product) => (
                <Box key={product.name} display="flex" justifyContent="space-between" paddingY="spacing.2" borderBottomWidth="thin" borderBottomColor="surface.border.gray.subtle">
                  <Text size="small" weight="semibold">{product.name}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">{`${product.qty} sold · ₹${product.revenue.toLocaleString('en-IN')}`}</Text>
                </Box>
              ))
            )}
          </CardBody>
        </Card>
      </Box>

      {/* Business Insight */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          <Box display="flex" alignItems="center" gap="spacing.3" marginBottom="spacing.2">
            <SparklesIcon color="interactive.icon.primary.normal" />
            <Heading size="small">Business Insight</Heading>
          </Box>
          {bestSeller ? (
            <Text size="small">
              Your best selling product through AI conversations is <Text size="small" weight="semibold">{bestSeller.name}</Text> with {bestSeller.qty} unit(s) sold for ₹{bestSeller.revenue.toLocaleString('en-IN')}.
              {outOfStock.length > 0 && ` ${outOfStock.length} product(s) are currently out of stock — restocking them could recover missed revenue.`}
            </Text>
          ) : (
            <Text size="small">Once AI conversations convert into paid orders, your best sellers and growth opportunities will appear here.</Text>
          )}
        </CardBody>
      </Card>

      {/* Needs Attention */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          <Heading size="small" marginBottom="spacing.4">Needs Attention</Heading>
          {needsAttentionCount === 0 ? (
            <Alert color="positive" title="All clear" description="No conversations or products need your attention right now." />
          ) : (
            <Box display="flex" flexDirection="column" gap="spacing.3">
              {waitingForPayment.slice(0, 3).map((s: any) => (
                <Box key={s.id} display="flex" justifyContent="space-between" alignItems="center">
                  <Text size="small">Conversation waiting for payment · {s.external_ai_name || 'Customer'}</Text>
                  <Button variant="secondary" size="small" href="/dashboard/ai-agent">Review</Button>
                </Box>
              ))}
              {outOfStock.slice(0, 3).map((p: any) => (
                <Box key={p.id} display="flex" justifyContent="space-between" alignItems="center">
                  <Text size="small">Out of stock · {p.name}</Text>
                  <Button variant="secondary" size="small" href="/dashboard/products">Review</Button>
                </Box>
              ))}
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Catalog Performance Grid */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          <Heading size="small" marginBottom="spacing.4">Product Inventory Performance</Heading>
          <Box display="grid" gridTemplateColumns="2fr 1fr 1fr 1fr" gap="spacing.3" paddingY="spacing.2" backgroundColor="surface.background.gray.subtle" borderRadius="small" marginBottom="spacing.2" paddingX="spacing.3">
            <Text size="xsmall" weight="semibold">PRODUCT NAME</Text>
            <Text size="xsmall" weight="semibold">CATEGORY</Text>
            <Text size="xsmall" weight="semibold">PRICE</Text>
            <Text size="xsmall" weight="semibold">STOCK</Text>
          </Box>
          {products.slice(0, 8).map((p: any) => (
            <Box key={p.id} display="grid" gridTemplateColumns="2fr 1fr 1fr 1fr" gap="spacing.3" paddingY="spacing.3" paddingX="spacing.3" borderBottomWidth="thin" borderBottomColor="surface.border.gray.muted" alignItems="center">
              <Text size="small" weight="semibold">{p.name}</Text>
              <Text size="xsmall" color="surface.text.gray.muted">{p.category || 'General'}</Text>
              <Text size="small" weight="semibold">₹{p.price}</Text>
              <Text size="xsmall" color={p.stock_qty > 0 ? 'interactive.text.positive.normal' : 'interactive.text.negative.normal'}>
                {p.stock_qty > 0 ? `${p.stock_qty} in stock` : 'Out of stock'}
              </Text>
            </Box>
          ))}
        </CardBody>
      </Card>
    </Box>
  );
}
