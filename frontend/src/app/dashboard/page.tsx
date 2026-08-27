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
  PackageIcon
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
        fetch('/api/audit?limit=6').then(r => r.json()),
      ]);

      if (resSessions.sessions) setSessions(resSessions.sessions);
      if (resOrders.orders) setOrders(resOrders.orders);
      if (resProducts.products) setProducts(resProducts.products);
      if (resAudit.audit_logs) setAuditLogs(resAudit.audit_logs);
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
      setError('We couldn’t load your dashboard data. Please try again.');
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
  const customersHelpedToday = sessions.filter(s => isToday(s.created_at)).length;
  const conversionRate = sessions.length > 0 ? Math.round((paidOrders.length / sessions.length) * 100) : 0;
  const lowStockProducts = products.filter(p => (p.stock_qty || 0) <= 5);

  const SUMMARY_STATS = [
    { title: 'AI Status', value: 'Online', trend: 'Catalog synced & connected', icon: SparklesIcon, color: 'primary', href: '/dashboard/ai-agent' },
    { title: 'Active Conversations', value: String(activeConversations.length), trend: `${sessions.length} total`, icon: UsersIcon, color: 'primary', href: '/dashboard/ai-agent' },
    { title: 'Orders Created Today', value: String(ordersToday.length), trend: `${paidOrders.length} paid overall`, icon: ShoppingBagIcon, color: 'positive', href: '/dashboard/orders' },
    { title: 'Revenue Generated Today', value: `₹${revenueToday.toLocaleString('en-IN')}`, trend: 'Verified payments', icon: RupeeIcon, color: 'primary', href: '/dashboard/orders' }
  ];

  const STAT_COLORS = {
    primary: { bg: 'surface.background.primary.subtle', icon: 'interactive.icon.primary.normal' },
    positive: { bg: 'feedback.background.positive.subtle', icon: 'interactive.icon.positive.normal' },
  } as const;

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box>
          <Heading size="2xlarge" marginBottom="spacing.2">Good morning, Merchant! 👋</Heading>
          <Text color="surface.text.gray.subtle">
            Here is your live AI commerce operations overview across buyer sessions, product search, and automated checkouts.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="tertiary" icon={RefreshIcon} iconPosition="left" onClick={loadDashboardData}>
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert color="negative" title="Couldn’t load dashboard" description={error} marginBottom="spacing.6" />
      )}

      {!isLoading && !error && sessions.length === 0 && orders.length === 0 && products.length === 0 && (
        <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
          <CardBody>
            <EmptyState
              title="No activity yet"
              description="Once your AI agent handles conversations and creates orders, your live operations overview will appear here."
            />
          </CardBody>
        </Card>
      )}

      {/* Summary Cards */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.4" marginBottom="spacing.6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} elevation="none" backgroundColor="surface.background.gray.intense">
                <CardBody>
                  <Skeleton height="64px" />
                </CardBody>
              </Card>
            ))
          : SUMMARY_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} elevation="none" backgroundColor="surface.background.gray.intense">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.2">
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Box 
                        width="36px" 
                        height="36px" 
                        borderRadius="medium" 
                        backgroundColor={STAT_COLORS[stat.color as keyof typeof STAT_COLORS].bg}
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                      >
                        <Icon size="medium" color={STAT_COLORS[stat.color as keyof typeof STAT_COLORS].icon} />
                      </Box>
                      <Text weight="semibold" size="small" color="surface.text.gray.subtle">
                        {stat.title}
                      </Text>
                    </Box>
                    {stat.title === 'AI Status' && (
                      <Badge color="positive" size="small">Live</Badge>
                    )}
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="flex-end" marginTop="spacing.2">
                    <Box>
                      <Heading size="2xlarge">{stat.value}</Heading>
                      {stat.trend && (
                        <Text size="xsmall" color={stat.color === 'negative' ? 'interactive.text.negative.normal' : 'interactive.text.positive.normal'} marginTop="spacing.1">
                          {stat.trend}
                        </Text>
                      )}
                    </Box>
                    <Link href={stat.href} style={{ textDecoration: 'none' }}>
                      <Button variant="tertiary" size="small" icon={ChevronRightIcon} iconPosition="right">
                        View
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          );
        })}
      </Box>

      {/* Main Content Grid */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '1fr 1.4fr' }} gap="spacing.6" marginBottom="spacing.6">
        
        {/* Left Column */}
        <Box display="flex" flexDirection="column" gap="spacing.6">
          
          {/* AI Performance Summary */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.4">
                <SparklesIcon size="small" color="interactive.icon.primary.normal" />
                <Heading size="small">AI Performance</Heading>
              </Box>
              <Box display="grid" gridTemplateColumns={{ base: '1fr 1fr', m: 'repeat(4,1fr)' }} gap="spacing.3">
                {[
                  { label: 'Customers helped today', value: String(customersHelpedToday) },
                  { label: 'Orders created today', value: String(ordersToday.length) },
                  { label: 'Revenue generated today', value: `₹${revenueToday.toLocaleString('en-IN')}` },
                  { label: 'Conversion rate', value: `${conversionRate}%` },
                ].map((item) => (
                  <Box key={item.label} padding="spacing.3" backgroundColor="surface.background.gray.subtle" borderRadius="medium">
                    <Text size="medium" weight="semibold">{item.value}</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">{item.label}</Text>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>

          {/* Recent Orders */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <ShoppingBagIcon size="small" color="interactive.icon.primary.normal" />
                  <Heading size="small">Recent Orders ({orders.length})</Heading>
                </Box>
                <Link href="/dashboard/orders" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="small">View all</Button>
                </Link>
              </Box>

              {orders.length === 0 ? (
                <Text size="small" color="surface.text.gray.muted">No orders created yet.</Text>
              ) : (
                <Box display="flex" flexDirection="column">
                  {orders.slice(0, 5).map((order, idx) => (
                    <Box 
                      key={order.id} 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center"
                      paddingY="spacing.3"
                      borderBottomWidth={idx !== Math.min(orders.length, 5) - 1 ? 'thin' : 'none'}
                      borderBottomColor="surface.border.gray.muted"
                    >
                      <Box display="flex" gap="spacing.3" alignItems="center">
                        <Box width="32px" height="32px" backgroundColor="surface.background.primary.subtle" borderRadius="medium" display="flex" alignItems="center" justifyContent="center">
                          <PackageIcon size="small" color="interactive.icon.primary.normal" />
                        </Box>
                        <Box>
                          <Text weight="semibold" size="small" color="surface.text.primary.normal">
                            {order.id.substring(0, 8).toUpperCase()}
                          </Text>
                          <Text size="xsmall" color="surface.text.gray.subtle">
                            {order.razorpay_order_id || 'Catalog Order'}
                          </Text>
                        </Box>
                      </Box>
                      <Text weight="semibold" size="small">₹{order.amount}</Text>
                      <Badge color={order.status === 'paid' ? 'positive' : 'notice'} size="small">
                        {order.status}
                      </Badge>
                    </Box>
                  ))}
                </Box>
              )}
            </CardBody>
          </Card>

          {/* AI Readiness */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Heading size="small">AI Catalog Readiness</Heading>
                <Badge color="positive" size="small">100% Connected</Badge>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.3" marginBottom="spacing.4">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap="spacing.2" alignItems="center">
                    <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
                    <Text size="small">Catalog Synced</Text>
                  </Box>
                  <Text size="xsmall" color="surface.text.gray.muted">{products.length} Products</Text>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap="spacing.2" alignItems="center">
                    <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
                    <Text size="small">Razorpay Checkout</Text>
                  </Box>
                  <Text size="xsmall" color="interactive.text.positive.normal">Active</Text>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap="spacing.2" alignItems="center">
                    <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
                    <Text size="small">Audit Logging</Text>
                  </Box>
                  <Text size="xsmall" color="interactive.text.positive.normal">Capturing ({auditLogs.length})</Text>
                </Box>
              </Box>

              <Link href="/dashboard/import" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="small" isFullWidth icon={UploadIcon} iconPosition="left">
                  Import Catalog Updates
                </Button>
              </Link>
            </CardBody>
          </Card>

        </Box>

        {/* Right Column */}
        <Box display="flex" flexDirection="column" gap="spacing.6">
          
          {/* Latest Conversations */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <ActivityIcon size="small" color="interactive.icon.primary.normal" />
                  <Heading size="small">Latest Conversations</Heading>
                </Box>
                <Link href="/dashboard/ai-agent" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="small">View all</Button>
                </Link>
              </Box>

              {sessions.length === 0 ? (
                <Text size="small" color="surface.text.gray.muted">No conversations recorded yet.</Text>
              ) : (
                <Box display="flex" flexDirection="column">
                  {sessions.slice(0, 5).map((session, index) => (
                    <Box 
                      key={session.id} 
                      display="grid" 
                      gridTemplateColumns="1.4fr 1fr 1fr" 
                      gap="spacing.3" 
                      alignItems="center"
                      paddingY="spacing.3"
                      borderBottomWidth={index !== Math.min(sessions.length, 5) - 1 ? 'thin' : 'none'}
                      borderBottomColor="surface.border.gray.muted"
                    >
                      <Box>
                        <Text weight="semibold" size="small">{session.external_ai_name || 'Customer'}</Text>
                        <Text size="xsmall" color="surface.text.gray.subtle">{(session.customer_query || session.buyer_request_text || '').slice(0, 48) || 'No request recorded'}</Text>
                      </Box>
                      <Badge
                        color={session.status === 'paid' || session.status === 'completed' ? 'positive' : session.status === 'checkout_ready' ? 'notice' : 'information'}
                        size="small"
                      >
                        {(session.status || 'active').replaceAll('_', ' ')}
                      </Badge>
                      <Link href="/dashboard/ai-agent" style={{ textDecoration: 'none', justifySelf: 'end' }}>
                        <Button variant="secondary" size="small">Open</Button>
                      </Link>
                    </Box>
                  ))}
                </Box>
              )}
            </CardBody>
          </Card>

          {/* Gateway Event Log */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Heading size="small">Gateway Event Log</Heading>
                <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="small">View all</Button>
                </Link>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.3">
                {auditLogs.slice(0, 5).map((activity) => (
                  <Box key={activity.id} display="flex" gap="spacing.2" alignItems="flex-start">
                    <Box 
                      width="6px" 
                      height="6px" 
                      borderRadius="round" 
                      backgroundColor="surface.background.sea.intense"
                      marginTop="spacing.2"
                    />
                    <Box flex={1}>
                      <Text size="xsmall" weight="semibold">{activity.title}</Text>
                      <Text size="xsmall" color="surface.text.gray.subtle">
                        {activity.actor_type} • {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>

        </Box>
      </Box>

      {/* Quick Actions Footer */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap="spacing.4">
            <Box>
              <Heading size="small">Merchant Quick Actions</Heading>
              <Text size="xsmall" color="surface.text.gray.subtle">
                Direct access to core AI commerce workflows
              </Text>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap="spacing.3">
              <Link href="/dashboard/products" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="small" icon={PlusIcon} iconPosition="left">Add Product</Button>
              </Link>
              <Link href="/dashboard/import" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="small" icon={UploadIcon} iconPosition="left">Import Catalog</Button>
              </Link>
              <Link href="/dashboard/live-sessions" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="small" icon={ActivityIcon} iconPosition="left">Live Sessions</Button>
              </Link>
              <Link href="/dashboard/orders" style={{ textDecoration: 'none' }}>
                <Button variant="tertiary" size="small" icon={ShoppingBagIcon} iconPosition="left">AI Orders</Button>
              </Link>
              <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
                <Button variant="tertiary" size="small" icon={FileTextIcon} iconPosition="left">Audit Trail</Button>
              </Link>
            </Box>
          </Box>
        </CardBody>
      </Card>

    </Box>
  );
}
