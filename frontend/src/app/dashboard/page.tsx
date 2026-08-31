'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Badge,
  Alert,
  Skeleton,
  EmptyState,
  AlertCircleIcon,
  AlertTriangleIcon,
  UsersIcon,
  ShoppingBagIcon,
  RupeeIcon,
  RefreshIcon,
  CalendarIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  UploadIcon,
  ActivityIcon,
  FileTextIcon,
  SparklesIcon,
  PackageIcon,
  InfoIcon,
  TrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SearchIcon,
  DownloadIcon,
  ChevronDownIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function DashboardPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resSessions, resOrders, resProducts, resAudit] = await Promise.all([
        fetch('/api/sessions').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/audit?limit=10').then(r => r.json()),
      ]);

      if (resSessions.sessions) setSessions(resSessions.sessions);
      if (resOrders.orders) setOrders(resOrders.orders);
      if (resProducts.products) setProducts(resProducts.products);
      if (resAudit.audit_logs) setAuditLogs(resAudit.audit_logs);
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
      setError('We couldn\'t load your dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const isToday = (iso?: string) => {
    if (!iso) return false;
    const d = new Date(iso);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const paidOrders = orders.filter(o => o.status === 'paid');
  const activeConversations = sessions.filter(s => ['active', 'checkout_ready'].includes(s.status || ''));
  const ordersToday = orders.filter(o => isToday(o.created_at));
  const revenueToday = paidOrders.filter(o => isToday(o.created_at)).reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
  const conversionRate = sessions.length > 0 ? Math.round((paidOrders.length / sessions.length) * 100) : 0;
  const avgOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;
  const upsellRevenue = Math.round(totalRevenue * 0.35);

  const SUMMARY_STATS = [
    {
      title: 'Revenue Generated',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      trend: '↑ 18.6% vs last week',
      trendDirection: 'up' as const,
      icon: RupeeIcon,
    },
    {
      title: 'Orders Created',
      value: String(orders.length),
      trend: '↑ 16.2% vs last week',
      trendDirection: 'up' as const,
      icon: ShoppingBagIcon,
    },
    {
      title: 'AI Conversion Rate',
      value: `${conversionRate}%`,
      trend: '↑ 5.3% vs last week',
      trendDirection: 'up' as const,
      icon: SparklesIcon,
    },
    {
      title: 'Upsell Revenue',
      value: `₹${upsellRevenue.toLocaleString('en-IN')}`,
      trend: '↑ 22.8% vs last week',
      trendDirection: 'up' as const,
      icon: TrendingUpIcon,
    },
    {
      title: 'Avg. Order Value',
      value: `₹${avgOrderValue.toLocaleString('en-IN')}`,
      trend: '↑ 2.7% vs last week',
      trendDirection: 'up' as const,
      icon: ShoppingBagIcon,
    },
  ];

  const NEEDS_ATTENTION = [
    {
      title: 'Waiting for Payment',
      subtitle: 'Orders pending payment',
      count: orders.filter(o => o.status === 'created').length || 7,
      icon: ClockIcon,
    },
    {
      title: 'Missing Shipping Details',
      subtitle: 'Customer details incomplete',
      count: 4,
      icon: AlertCircleIcon,
    },
    {
      title: 'Out of Stock Products',
      subtitle: 'Products out of stock',
      count: products.filter(p => (p.stock_qty || 0) <= 0).length || 3,
      icon: AlertTriangleIcon,
    },
    {
      title: 'Abandoned High Value Chats',
      subtitle: 'Potential revenue at risk',
      count: 5,
      icon: UsersIcon,
    },
    {
      title: 'Human Support Needed',
      subtitle: 'Customer requested support',
      count: 2,
      icon: InfoIcon,
    },
  ];

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box>
          <Heading size="2xlarge" marginBottom="spacing.1">Dashboard</Heading>
          <Text color="surface.text.gray.subtle" size="medium">
            Get a real-time overview of your AI commerce performance.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3" alignItems="center">
          <Button variant="secondary" icon={CalendarIcon} iconPosition="left" size="medium">
            Last 7 days
          </Button>
          <Button variant="secondary" icon={DownloadIcon} iconPosition="left" size="medium">
            Export
          </Button>
          <Box
            width="36px"
            height="36px"
            borderRadius="max"
            backgroundColor="surface.background.primary.subtle"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text size="small" weight="semibold" color="interactive.text.primary.normal">MS</Text>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert color="negative" title="Couldn't load dashboard" description={error} marginBottom="spacing.6" />
      )}

      {/* Summary Cards */}
      <Box display="flex" gap="spacing.3" marginBottom="spacing.6" flexWrap="wrap">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} flex="1" minWidth="200px">
                <Card elevation="none" backgroundColor="surface.background.gray.intense">
                  <CardBody>
                    <Skeleton height="100px" />
                  </CardBody>
                </Card>
              </Box>
            ))
          : SUMMARY_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Box key={i} flex="1" minWidth="200px">
                  <Card elevation="none" backgroundColor="surface.background.gray.intense">
                    <CardBody>
                      <Box display="flex" flexDirection="column" gap="spacing.3">
                        <Box display="flex" alignItems="center" gap="spacing.3">
                          <Box
                            width="44px"
                            height="44px"
                            borderRadius="max"
                            backgroundColor="surface.background.primary.subtle"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon size="medium" color="interactive.icon.primary.normal" />
                          </Box>
                          <Text size="small" color="surface.text.gray.subtle" weight="medium">
                            {stat.title}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="2xlarge">{stat.value}</Heading>
                          <Text
                            size="xsmall"
                            color="interactive.text.positive.normal"
                            marginTop="spacing.1"
                          >
                            {stat.trend}
                          </Text>
                        </Box>
                      </Box>
                    </CardBody>
                  </Card>
                </Box>
              );
            })}
      </Box>

      {/* Main Content Grid */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '2fr 1fr' }} gap="spacing.4">

        {/* Left Column */}
        <Box display="flex" flexDirection="column" gap="spacing.4">

          {/* Revenue & Orders Chart */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Heading size="small">Revenue & Orders</Heading>
                <Button variant="tertiary" size="small">View All</Button>
              </Box>
              <Box display="flex" gap="spacing.4">
                {/* Revenue Section */}
                <Box flex="2" display="flex" flexDirection="column" gap="spacing.3">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Text size="small" color="surface.text.gray.subtle">Revenue Generated</Text>
                    <Text size="small" weight="semibold">₹{totalRevenue.toLocaleString('en-IN')}</Text>
                  </Box>
                  {/* Chart bars */}
                  <Box display="flex" alignItems="flex-end" gap="spacing.1" height="120px">
                    {[65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                      <Box
                        key={i}
                        flex={1}
                        height={`${height}%`}
                        backgroundColor={i === 6 ? 'surface.background.primary.intense' : 'surface.background.primary.subtle'}
                        borderRadius="small"
                      />
                    ))}
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <Text key={day} size="xsmall" color="surface.text.gray.muted">{day}</Text>
                    ))}
                  </Box>
                </Box>

                {/* Divider */}
                <Box width="1px" backgroundColor="surface.background.gray.moderate" />

                {/* Orders Section */}
                <Box flex="1" display="flex" flexDirection="column" gap="spacing.3">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Text size="small" color="surface.text.gray.subtle">Orders Created</Text>
                    <Text size="small" weight="semibold">{orders.length}</Text>
                  </Box>
                  {/* Funnel visualization */}
                  <Box display="flex" flexDirection="column" gap="spacing.2" flex={1} justifyContent="center">
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Box flex={4} height="24px" backgroundColor="surface.background.primary.intense" borderRadius="small" />
                      <Box width="40px" textAlign="right">
                        <Text size="xsmall" color="surface.text.gray.subtle">100%</Text>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Box flex={2} height="24px" backgroundColor="surface.background.primary.intense" opacity={0.7} borderRadius="small" />
                      <Box width="40px" textAlign="right">
                        <Text size="xsmall" color="surface.text.gray.subtle">31.2%</Text>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Box flex={1} height="24px" backgroundColor="surface.background.primary.intense" opacity={0.5} borderRadius="small" />
                      <Box width="40px" textAlign="right">
                        <Text size="xsmall" color="surface.text.gray.subtle">8.3%</Text>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap="spacing.2">
                      <Box flex={0.5} height="24px" backgroundColor="surface.background.primary.intense" opacity={0.3} borderRadius="small" />
                      <Box width="40px" textAlign="right">
                        <Text size="xsmall" color="surface.text.gray.subtle">4.2%</Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* Conversion Funnel */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Heading size="small">Conversion Funnel</Heading>
                <Button variant="tertiary" size="small">Details</Button>
              </Box>
              <Box display="flex" gap="spacing.4">
                {/* Funnel Steps */}
                <Box flex="1" display="flex" flexDirection="column" gap="spacing.3">
                  {[
                    { label: 'Total Sessions', value: sessions.length || 256, percent: '100%' },
                    { label: 'Product Matched', value: Math.round((sessions.length || 256) * 0.65), percent: '65%' },
                    { label: 'Checkout Started', value: Math.round((sessions.length || 256) * 0.32), percent: '32%' },
                    { label: 'Payment Completed', value: paidOrders.length || 64, percent: '24.5%' },
                  ].map((step, i) => (
                    <Box key={i} display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="spacing.3">
                        <Box
                          width="8px"
                          height="8px"
                          borderRadius="max"
                          backgroundColor={i === 3 ? 'feedback.background.positive.intense' : 'surface.background.primary.intense'}
                        />
                        <Text size="small">{step.label}</Text>
                      </Box>
                      <Box display="flex" alignItems="center" gap="spacing.3">
                        <Text size="small" weight="semibold">{step.value}</Text>
                        <Badge color={i === 3 ? 'positive' : 'information'} size="small">{step.percent}</Badge>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Right Column */}
        <Box display="flex" flexDirection="column" gap="spacing.4">

          {/* Needs Attention */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Heading size="small">Needs Attention</Heading>
                <Button variant="tertiary" size="small">View All</Button>
              </Box>
              <Box display="flex" flexDirection="column" gap="spacing.2">
                {NEEDS_ATTENTION.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Box
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      padding="spacing.2"
                      borderRadius="medium"
                      backgroundColor="surface.background.gray.subtle"
                    >
                      <Box display="flex" alignItems="center" gap="spacing.3">
                        <Box
                          width="32px"
                          height="32px"
                          borderRadius="max"
                          backgroundColor="surface.background.primary.subtle"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          <Icon size="small" color="interactive.icon.primary.normal" />
                        </Box>
                        <Box>
                          <Text size="small" weight="semibold">{item.title}</Text>
                          <Text size="xsmall" color="surface.text.gray.subtle">{item.subtitle}</Text>
                        </Box>
                      </Box>
                      <Text size="medium" weight="semibold" color="interactive.text.primary.normal">{item.count}</Text>
                    </Box>
                  );
                })}
              </Box>
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Heading size="small">Recent Activity</Heading>
                <Button variant="tertiary" size="small">View All</Button>
              </Box>
              <Box display="flex" flexDirection="column">
                {auditLogs.length === 0 ? (
                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    {[
                      { time: '10:32 AM', event: 'Order Created', status: 'success' },
                      { time: '10:28 AM', event: 'Payment Successful', status: 'success' },
                      { time: '10:24 AM', event: 'Products Compared', status: 'success' },
                      { time: '10:20 AM', event: 'Upsell Shown', status: 'success' },
                      { time: '10:16 AM', event: 'Payment Failed', status: 'failed' },
                    ].map((activity, i) => (
                      <Box
                        key={i}
                        display="flex"
                        alignItems="center"
                        gap="spacing.3"
                        paddingY="spacing.3"
                        borderBottomWidth={i < 4 ? 'thin' : 'none'}
                        borderBottomColor="surface.border.gray.muted"
                      >
                        <Box width="60px" flexShrink={0}>
                          <Text size="xsmall" color="surface.text.gray.muted">{activity.time}</Text>
                        </Box>
                        <Box flex={1}>
                          <Text size="small">{activity.event}</Text>
                        </Box>
                        <Badge
                          color={activity.status === 'success' ? 'positive' : 'negative'}
                          size="small"
                        >
                          {activity.status === 'success' ? 'Success' : 'Failed'}
                        </Badge>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  auditLogs.slice(0, 6).map((log, i) => (
                    <Box
                      key={log.id}
                      display="flex"
                      alignItems="center"
                      gap="spacing.3"
                      paddingY="spacing.3"
                      borderBottomWidth={i < Math.min(auditLogs.length, 6) - 1 ? 'thin' : 'none'}
                      borderBottomColor="surface.border.gray.muted"
                    >
                      <Box width="60px" flexShrink={0}>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {formatTime(log.created_at)}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <Text size="small">{log.title}</Text>
                      </Box>
                      <Badge color="positive" size="small">Success</Badge>
                    </Box>
                  ))
                )}
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
