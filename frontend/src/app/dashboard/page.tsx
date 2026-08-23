'use client';

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Card, 
  CardBody, 
  Button, 
  Badge,
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

// Mock Data
const SUMMARY_STATS = [
  { title: 'Live Sessions', value: '128', trend: '↑ 18% vs yesterday', icon: UsersIcon, color: 'primary', href: '/dashboard/live-sessions' },
  { title: 'Orders Today', value: '56', trend: '↑ 20% vs yesterday', icon: ShoppingBagIcon, color: 'positive', href: '/dashboard/orders' },
  { title: 'Revenue Today', value: '₹1,24,560', trend: '↑ 15% vs yesterday', icon: RupeeIcon, color: 'primary', href: '/dashboard/orders' },
  { title: 'Attention Needed', value: '12', trend: 'Requires action', icon: AlertCircleIcon, color: 'negative', isAction: true, href: '/dashboard/live-sessions' }
];

const URGENT_ACTIONS = [
  { id: 1, title: '8 sessions awaiting confirmation', reason: 'Customers waiting for merchant approval', time: '3m ago', action: 'Review', type: 'notice' as const },
  { id: 2, title: '2 payments failed', reason: 'Action required to retry payments', time: '15m ago', action: 'Check', type: 'negative' as const },
  { id: 3, title: '5 products low on stock', reason: 'Update inventory to avoid session drops', time: '1h ago', action: 'Update', type: 'primary' as const },
  { id: 4, title: '3 sessions missing details', reason: 'Customer AIs requested more spec data', time: '2h ago', action: 'Open', type: 'primary' as const }
];

const RECENT_SESSIONS = [
  { id: 'S-78291', customerAI: 'ShopSmart AI', request: 'Noise cancelling headphones under ₹5,000', status: 'Awaiting Confirmation', time: '2m ago' },
  { id: 'S-78290', customerAI: 'BudgetBuy AI', request: 'Smartwatch with heart rate monitor', status: 'Matching', time: '3m ago' },
  { id: 'S-78289', customerAI: 'GadgetGenie AI', request: 'Gaming chair with lumbar support', status: 'Awaiting Details', time: '5m ago' },
  { id: 'S-78288', customerAI: 'DealFinder AI', request: 'iPhone 15 128GB best price', status: 'Checkout Ready', time: '8m ago' }
];

const RECENT_ORDERS = [
  { id: 'O-19281', item: 'MacBook Air M2', price: '₹1,10,000', status: 'Paid' as const, time: '15m ago' },
  { id: 'O-19280', item: 'Canon EOS R50', price: '₹55,000', status: 'Paid' as const, time: '18m ago' },
  { id: 'O-19279', item: 'Wireless earbuds', price: '₹2,000', status: 'Pending' as const, time: '22m ago' },
  { id: 'O-19278', item: 'Air Purifier', price: '₹18,999', status: 'Failed' as const, time: '25m ago' }
];

const RECENT_ACTIVITY = [
  { id: 1, text: 'Payment successful for Order O-19281', amount: '₹1,10,000', time: '10:24 AM', type: 'positive' as const },
  { id: 2, text: 'Razorpay order created for Session S-78291', amount: '₹5,000', time: '10:20 AM', type: 'primary' as const },
  { id: 3, text: 'Product matched for Session S-78290', amount: 'Smartwatch', time: '10:15 AM', type: 'primary' as const },
  { id: 4, text: 'Customer details requested for S-78289', amount: 'Missing budget info', time: '10:10 AM', type: 'notice' as const },
  { id: 5, text: 'New session received from ShopSmart AI', amount: 'Noise cancelling headphones', time: '10:05 AM', type: 'positive' as const }
];

export default function DashboardPage() {
  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box>
          <Heading size="2xlarge" marginBottom="spacing.2">Good morning, Arjun! 👋</Heading>
          <Text color="surface.text.gray.subtle">
            Here is your live AI commerce operations overview across buyer sessions and automated checkouts.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="tertiary" icon={CalendarIcon} iconPosition="left">
            Last 7 Days
          </Button>
          <Button variant="tertiary" icon={RefreshIcon} iconPosition="left">
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.4" marginBottom="spacing.6">
        {SUMMARY_STATS.map((stat, i) => {
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
                        backgroundColor={`surface.background.${stat.color}.subtle` as any}
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                      >
                        <Icon size="medium" color={`interactive.icon.${stat.color}.normal` as any} />
                      </Box>
                      <Text weight="semibold" size="small" color="surface.text.gray.subtle">
                        {stat.title}
                      </Text>
                    </Box>
                    {stat.isAction && (
                      <Badge color="negative" size="small">Action</Badge>
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
          
          {/* Needs Attention */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <AlertCircleIcon size="small" color="interactive.icon.negative.normal" />
                  <Heading size="small">Needs Attention ({URGENT_ACTIONS.length})</Heading>
                </Box>
                <Link href="/dashboard/live-sessions" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="small">View all</Button>
                </Link>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.3">
                {URGENT_ACTIONS.map(action => (
                  <Box 
                    key={action.id} 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    paddingY="spacing.3" 
                    borderBottomWidth="thin" 
                    borderBottomColor="surface.border.gray.muted"
                  >
                    <Box display="flex" gap="spacing.3" alignItems="flex-start">
                      <Box 
                        width="32px" 
                        height="32px" 
                        borderRadius="medium" 
                        backgroundColor={`surface.background.${action.type}.subtle` as any}
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                      >
                        {action.type === 'notice' ? <ClockIcon size="small" color="interactive.icon.notice.normal" /> : 
                         action.type === 'negative' ? <AlertCircleIcon size="small" color="interactive.icon.negative.normal" /> :
                         <SparklesIcon size="small" color="interactive.icon.primary.normal" />}
                      </Box>
                      <Box>
                        <Text weight="semibold" size="small">{action.title}</Text>
                        <Text size="xsmall" color="surface.text.gray.subtle">{action.reason}</Text>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Text size="xsmall" color="surface.text.gray.muted">{action.time}</Text>
                      <Button variant="secondary" size="small">{action.action}</Button>
                    </Box>
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
                  <Heading size="small">Recent Orders</Heading>
                </Box>
                <Link href="/dashboard/orders" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="small">View all</Button>
                </Link>
              </Box>

              <Box display="flex" flexDirection="column">
                {RECENT_ORDERS.map((order, idx) => (
                  <Box 
                    key={order.id} 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center"
                    paddingY="spacing.3"
                    borderBottomWidth={idx !== RECENT_ORDERS.length - 1 ? 'thin' : 'none'}
                    borderBottomColor="surface.border.gray.muted"
                  >
                    <Box display="flex" gap="spacing.3" alignItems="center">
                      <Box 
                        width="32px" 
                        height="32px" 
                        backgroundColor="surface.background.primary.subtle" 
                        borderRadius="medium"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <PackageIcon size="small" color="interactive.icon.primary.normal" />
                      </Box>
                      <Box>
                        <Text weight="semibold" size="small" color="surface.text.primary.normal">{order.id}</Text>
                        <Text size="xsmall" color="surface.text.gray.subtle">{order.item}</Text>
                      </Box>
                    </Box>
                    <Text weight="semibold" size="small">{order.price}</Text>
                    <Badge color={order.status === 'Paid' ? 'positive' : order.status === 'Failed' ? 'negative' : 'notice'} size="small">
                      {order.status}
                    </Badge>
                    <Text size="xsmall" color="surface.text.gray.muted">{order.time}</Text>
                    <ChevronRightIcon size="small" color="surface.icon.gray.muted" />
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>

        </Box>

        {/* Right Column */}
        <Box display="flex" flexDirection="column" gap="spacing.6">
          
          {/* Recent Live Sessions */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <ActivityIcon size="small" color="interactive.icon.primary.normal" />
                  <Heading size="small">Recent Live Sessions</Heading>
                </Box>
                <Link href="/dashboard/live-sessions" style={{ textDecoration: 'none' }}>
                  <Button variant="tertiary" size="small">View all</Button>
                </Link>
              </Box>

              <Box 
                display="grid" 
                gridTemplateColumns="1fr 1.2fr 2fr 1.2fr auto" 
                gap="spacing.3" 
                paddingY="spacing.2" 
                paddingX="spacing.3"
                backgroundColor="surface.background.gray.subtle"
                borderRadius="small"
                marginBottom="spacing.2"
              >
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">SESSION</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">BUYER AI</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">REQUEST</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">STATUS</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">TIME</Text>
              </Box>

              <Box display="flex" flexDirection="column">
                {RECENT_SESSIONS.map((session, index) => (
                  <Box 
                    key={session.id} 
                    display="grid" 
                    gridTemplateColumns="1fr 1.2fr 2fr 1.2fr auto" 
                    gap="spacing.3" 
                    alignItems="center"
                    paddingY="spacing.3"
                    paddingX="spacing.3"
                    borderBottomWidth={index !== RECENT_SESSIONS.length - 1 ? 'thin' : 'none'}
                    borderBottomColor="surface.border.gray.muted"
                  >
                    <Text weight="semibold" size="small" color="surface.text.primary.normal">{session.id}</Text>
                    <Box display="flex" alignItems="center" gap="spacing.1">
                      <SparklesIcon size="xsmall" color="interactive.icon.primary.normal" />
                      <Text size="xsmall" weight="semibold">{session.customerAI}</Text>
                    </Box>
                    <Box overflow="hidden" whiteSpace="nowrap">
                      <Text size="xsmall" color="surface.text.gray.subtle">{session.request}</Text>
                    </Box>
                    <Badge color={session.status === 'Awaiting Confirmation' || session.status === 'Awaiting Details' ? 'notice' : session.status === 'Checkout Ready' ? 'information' : 'primary'} size="small">
                      {session.status}
                    </Badge>
                    <Text size="xsmall" color="surface.text.gray.muted">{session.time}</Text>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>

          <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.4">
            {/* AI Readiness */}
            <Card elevation="none" backgroundColor="surface.background.gray.intense">
              <CardBody>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                  <Heading size="small">AI Catalog Readiness</Heading>
                  <Badge color="positive" size="small">96% Ready</Badge>
                </Box>

                <Box display="flex" flexDirection="column" gap="spacing.3" marginBottom="spacing.4">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap="spacing.2" alignItems="center">
                      <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
                      <Text size="small">Catalog Synced</Text>
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.muted">1,248 Items</Text>
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
                      <Text size="small">Budget Rules</Text>
                    </Box>
                    <Text size="xsmall" color="interactive.text.positive.normal">Configured</Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap="spacing.2" alignItems="center">
                      <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
                      <Text size="small">Audit Logging</Text>
                    </Box>
                    <Text size="xsmall" color="interactive.text.positive.normal">Capturing</Text>
                  </Box>
                </Box>

                <Link href="/dashboard/import" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="small" isFullWidth icon={UploadIcon} iconPosition="left">
                    Import Catalog Updates
                  </Button>
                </Link>
              </CardBody>
            </Card>

            {/* Recent Activity */}
            <Card elevation="none" backgroundColor="surface.background.gray.intense">
              <CardBody>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
                  <Heading size="small">Gateway Event Log</Heading>
                  <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
                    <Button variant="tertiary" size="small">View all</Button>
                  </Link>
                </Box>

                <Box display="flex" flexDirection="column" gap="spacing.3">
                  {RECENT_ACTIVITY.slice(0, 4).map((activity) => (
                    <Box key={activity.id} display="flex" gap="spacing.2" alignItems="flex-start">
                      <Box 
                        width="6px" 
                        height="6px" 
                        borderRadius="round" 
                        backgroundColor={activity.type === 'positive' ? 'surface.background.sea.intense' : activity.type === 'notice' ? 'surface.background.cloud.intense' : 'surface.background.primary.intense'}
                        marginTop="spacing.2"
                      />
                      <Box flex={1}>
                        <Text size="xsmall" weight="semibold">{activity.text}</Text>
                        <Text size="xsmall" color="surface.text.gray.subtle">{activity.amount} • {activity.time}</Text>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardBody>
            </Card>
          </Box>
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
