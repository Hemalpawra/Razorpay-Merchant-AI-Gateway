'use client';

import React, { useState, useEffect } from 'react';
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
  InfoIcon
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
              <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Active Products</Text>
              <Heading size="xlarge" weight="semibold">{products.length}</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">Indexed in catalog</Text>
            </Box>
          </CardBody>
        </Card>
      </Box>

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
