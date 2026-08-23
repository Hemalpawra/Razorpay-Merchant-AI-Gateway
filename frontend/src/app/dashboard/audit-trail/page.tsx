'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  IconButton,
  Card,
  CardBody,
  Badge,
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
  Divider,
  // Icons
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  CloseIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  SparklesIcon,
  CopyIcon,
  ExternalLinkIcon,
  RefreshIcon,
  MoreVerticalIcon,
  FileTextIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  PackageIcon,
  ZapIcon,
  ShieldIcon,
  ClockIcon,
  CheckIcon,
  CrosshairIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type EventResult = 'Success' | 'Failed' | 'Warning' | 'Info';
type EventSeverity = 'Info' | 'Warning' | 'Critical' | 'Success';

type AuditEvent = {
  id: string;
  time: string;
  timeIST: string;
  eventType: string;
  eventSubtext: string;
  sessionId: string | null;
  orderId: string | null;
  actor: string;
  actorType: 'System' | 'AI' | 'User' | 'Policy';
  result: EventResult;
  severity: EventSeverity;
  source: string;
  reason: string;
  relatedProduct: string | null;
  customerAI: string | null;
  payload: Record<string, string | number | boolean | string[]>;
  chainEvents: { time: string; type: string; description: string; dot: 'success' | 'info' | 'warning' | 'error' }[];
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_EVENTS: AuditEvent[] = [
  {
    id: 'evt_001',
    time: '19 May 2025, 10:24:31 AM',
    timeIST: '19 May 2025, 10:24:31 AM (IST)',
    eventType: 'Payment success',
    eventSubtext: 'Payment captured',
    sessionId: 'sess_8JH2K91',
    orderId: 'order_OJH82J1K',
    actor: 'System',
    actorType: 'System',
    result: 'Success',
    severity: 'Info',
    source: 'Razorpay',
    reason: 'Payment captured successfully via Razorpay.',
    relatedProduct: 'Wireless Earbuds (WE-100)',
    customerAI: 'StyleBuddy',
    payload: { payment_id: 'pay_OJH82J1K8S1', amount: 1999, currency: 'INR', method: 'upi', captured: true },
    chainEvents: [
      { time: '10:24:31 AM', type: 'Payment success', description: 'Payment captured', dot: 'success' },
      { time: '10:24:25 AM', type: 'Razorpay order created', description: 'Order created in Razorpay', dot: 'info' },
      { time: '10:23:11 AM', type: 'Approval received', description: 'Customer confirmed', dot: 'success' },
      { time: '10:22:47 AM', type: 'Approval requested', description: 'Sent product details', dot: 'info' },
      { time: '10:22:01 AM', type: 'Product matched', description: '1 product matched', dot: 'success' },
    ],
  },
  {
    id: 'evt_002',
    time: '19 May 2025, 10:24:25 AM',
    timeIST: '19 May 2025, 10:24:25 AM (IST)',
    eventType: 'Razorpay order created',
    eventSubtext: 'Order created in Razorpay',
    sessionId: 'sess_8JH2K91',
    orderId: 'order_OJH82J1K',
    actor: 'System',
    actorType: 'System',
    result: 'Success',
    severity: 'Info',
    source: 'System',
    reason: 'Razorpay order created for confirmed product with locked price.',
    relatedProduct: 'Wireless Earbuds (WE-100)',
    customerAI: 'StyleBuddy',
    payload: { order_id: 'order_OJH82J1K', amount: 199900, currency: 'INR', receipt: 'rcpt_001' },
    chainEvents: [
      { time: '10:24:25 AM', type: 'Razorpay order created', description: 'Order created in Razorpay', dot: 'info' },
      { time: '10:23:11 AM', type: 'Approval received', description: 'Customer confirmed', dot: 'success' },
      { time: '10:22:47 AM', type: 'Approval requested', description: 'Sent product details', dot: 'info' },
    ],
  },
  {
    id: 'evt_003',
    time: '19 May 2025, 10:23:11 AM',
    timeIST: '19 May 2025, 10:23:11 AM (IST)',
    eventType: 'Approval received',
    eventSubtext: 'Customer confirmed',
    sessionId: 'sess_8JH2K91',
    orderId: null,
    actor: 'StyleBuddy (AI)',
    actorType: 'AI',
    result: 'Success',
    severity: 'Info',
    source: 'System',
    reason: 'Customer AI confirmed product selection on behalf of user.',
    relatedProduct: 'Wireless Earbuds (WE-100)',
    customerAI: 'StyleBuddy',
    payload: { confirmed_by: 'AI', product_sku: 'WE-100', quantity: 1, price_agreed: 1999 },
    chainEvents: [
      { time: '10:23:11 AM', type: 'Approval received', description: 'Customer confirmed', dot: 'success' },
      { time: '10:22:47 AM', type: 'Approval requested', description: 'Sent product details', dot: 'info' },
      { time: '10:22:01 AM', type: 'Product matched', description: '1 product matched', dot: 'success' },
    ],
  },
  {
    id: 'evt_004',
    time: '19 May 2025, 10:22:47 AM',
    timeIST: '19 May 2025, 10:22:47 AM (IST)',
    eventType: 'Approval requested',
    eventSubtext: 'Sent product details',
    sessionId: 'sess_8JH2K91',
    orderId: null,
    actor: 'StyleBuddy (AI)',
    actorType: 'AI',
    result: 'Success',
    severity: 'Info',
    source: 'System',
    reason: 'AI assistant sent product card and requested user approval before proceeding.',
    relatedProduct: 'Wireless Earbuds (WE-100)',
    customerAI: 'StyleBuddy',
    payload: { product_sku: 'WE-100', price: 1999, approval_timeout_s: 300 },
    chainEvents: [
      { time: '10:22:47 AM', type: 'Approval requested', description: 'Sent product details', dot: 'info' },
      { time: '10:22:01 AM', type: 'Product matched', description: '1 product matched', dot: 'success' },
    ],
  },
  {
    id: 'evt_005',
    time: '19 May 2025, 10:22:01 AM',
    timeIST: '19 May 2025, 10:22:01 AM (IST)',
    eventType: 'Product matched',
    eventSubtext: '1 product matched',
    sessionId: 'sess_8JH2K91',
    orderId: null,
    actor: 'LookAI',
    actorType: 'AI',
    result: 'Success',
    severity: 'Info',
    source: 'System',
    reason: 'Catalog search returned 1 exact match for noise cancelling earbuds query.',
    relatedProduct: 'Wireless Earbuds (WE-100)',
    customerAI: 'StyleBuddy',
    payload: { matched_sku: 'WE-100', query: 'noise cancelling earbuds', confidence: 0.97 },
    chainEvents: [
      { time: '10:22:01 AM', type: 'Product matched', description: '1 product matched', dot: 'success' },
      { time: '10:21:32 AM', type: 'Catalog searched', description: 'Searched 231 products', dot: 'info' },
    ],
  },
  {
    id: 'evt_006',
    time: '19 May 2025, 10:21:32 AM',
    timeIST: '19 May 2025, 10:21:32 AM (IST)',
    eventType: 'Catalog searched',
    eventSubtext: 'Searched 231 products',
    sessionId: 'sess_8JH2K91',
    orderId: null,
    actor: 'StyleBuddy (AI)',
    actorType: 'AI',
    result: 'Success',
    severity: 'Info',
    source: 'System',
    reason: 'Full-text catalog search executed on merchant product index.',
    relatedProduct: null,
    customerAI: 'StyleBuddy',
    payload: { query: 'earbuds under 2000', products_scanned: 231, results_found: 4 },
    chainEvents: [
      { time: '10:21:32 AM', type: 'Catalog searched', description: 'Searched 231 products', dot: 'info' },
      { time: '10:21:10 AM', type: 'Request received', description: 'User message received', dot: 'info' },
    ],
  },
  {
    id: 'evt_007',
    time: '19 May 2025, 10:21:10 AM',
    timeIST: '19 May 2025, 10:21:10 AM (IST)',
    eventType: 'Request received',
    eventSubtext: 'User message received',
    sessionId: 'sess_8JH2K91',
    orderId: null,
    actor: 'User',
    actorType: 'User',
    result: 'Info',
    severity: 'Info',
    source: 'Web Chat',
    reason: 'Customer sent initial shopping query to StyleBuddy AI assistant.',
    relatedProduct: null,
    customerAI: 'StyleBuddy',
    payload: { message: 'I need noise cancelling earbuds under 2000', channel: 'web_chat' },
    chainEvents: [
      { time: '10:21:10 AM', type: 'Request received', description: 'User message received', dot: 'info' },
    ],
  },
  {
    id: 'evt_008',
    time: '19 May 2025, 09:17:45 AM',
    timeIST: '19 May 2025, 09:17:45 AM (IST)',
    eventType: 'Payment failed',
    eventSubtext: 'Card declined',
    sessionId: 'sess_8JH2K8X',
    orderId: 'order_OJH82J1B',
    actor: 'System',
    actorType: 'System',
    result: 'Failed',
    severity: 'Critical',
    source: 'Razorpay',
    reason: 'Card authorization failed: Bank declined due to insufficient funds (PAYMENT_DECLINED).',
    relatedProduct: 'Backpack (BP-600)',
    customerAI: 'LookAI',
    payload: { payment_id: 'pay_FAILED_001', error_code: 'PAYMENT_DECLINED', bank_error: 'Insufficient funds' },
    chainEvents: [
      { time: '09:17:45 AM', type: 'Payment failed', description: 'Card declined by bank', dot: 'error' },
      { time: '09:17:40 AM', type: 'Razorpay order created', description: 'Order created in Razorpay', dot: 'info' },
      { time: '09:16:25 AM', type: 'Missing details requested', description: 'Asked for size and color', dot: 'warning' },
    ],
  },
  {
    id: 'evt_009',
    time: '19 May 2025, 09:17:40 AM',
    timeIST: '19 May 2025, 09:17:40 AM (IST)',
    eventType: 'Razorpay order created',
    eventSubtext: 'Order created in Razorpay',
    sessionId: 'sess_8JH2K8X',
    orderId: 'order_OJH82J1B',
    actor: 'System',
    actorType: 'System',
    result: 'Success',
    severity: 'Info',
    source: 'System',
    reason: 'Razorpay order object generated for customer checkout.',
    relatedProduct: 'Backpack (BP-600)',
    customerAI: 'LookAI',
    payload: { order_id: 'order_OJH82J1B', amount: 219900, currency: 'INR' },
    chainEvents: [
      { time: '09:17:40 AM', type: 'Razorpay order created', description: 'Order created in Razorpay', dot: 'info' },
      { time: '09:16:25 AM', type: 'Missing details requested', description: 'Asked for size and color', dot: 'warning' },
    ],
  },
  {
    id: 'evt_010',
    time: '19 May 2025, 09:16:25 AM',
    timeIST: '19 May 2025, 09:16:25 AM (IST)',
    eventType: 'Missing details requested',
    eventSubtext: 'Asked for size and color',
    sessionId: 'sess_8JH2K8X',
    orderId: null,
    actor: 'StyleBuddy (AI)',
    actorType: 'AI',
    result: 'Warning',
    severity: 'Warning',
    source: 'System',
    reason: 'Product variant information (size, color) not provided in initial request. AI asked for clarification.',
    relatedProduct: 'Backpack (BP-600)',
    customerAI: 'StyleBuddy',
    payload: { missing_fields: ['size', 'color'], product_sku: 'BP-600', follow_up_sent: true },
    chainEvents: [
      { time: '09:16:25 AM', type: 'Missing details requested', description: 'Asked for size and color', dot: 'warning' },
    ],
  },
];

// ─── Severity / Result config ──────────────────────────────────────────────────

const resultConfig: Record<EventResult, { color: 'positive' | 'negative' | 'notice' | 'information', label: string }> = {
  Success: { color: 'positive', label: 'Success' },
  Failed: { color: 'negative', label: 'Failed' },
  Warning: { color: 'notice', label: 'Warning' },
  Info: { color: 'information', label: 'Info' },
};

const severityConfig: Record<EventSeverity, { color: 'positive' | 'negative' | 'notice' | 'information', label: string }> = {
  Success: { color: 'positive', label: 'Success' },
  Info: { color: 'information', label: 'Info' },
  Warning: { color: 'notice', label: 'Warning' },
  Critical: { color: 'negative', label: 'Critical' },
};

const eventTypeIcon: Record<string, React.ComponentType<any>> = {
  'Payment success': CheckCircleIcon,
  'Payment failed': AlertCircleIcon,
  'Razorpay order created': ShoppingBagIcon,
  'Approval received': CheckIcon,
  'Approval requested': FileTextIcon,
  'Product matched': PackageIcon,
  'Catalog searched': SearchIcon,
  'Request received': ZapIcon,
  'Missing details requested': AlertTriangleIcon,
  'Policy blocked': ShieldIcon,
  'Session claimed': ClockIcon,
};

function getEventIcon(type: string) {
  return eventTypeIcon[type] ?? InfoIcon;
}

function getEventIconColor(result: EventResult, severity: EventSeverity): string {
  if (result === 'Failed' || severity === 'Critical') return 'interactive.icon.negative.normal';
  if (result === 'Warning' || severity === 'Warning') return 'interactive.icon.notice.normal';
  if (result === 'Success') return 'interactive.icon.positive.normal';
  return 'interactive.icon.primary.normal';
}

// ─── Summary Card ──────────────────────────────────────────────────────────────

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
              width="24px" height="24px"
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

// ─── Event Detail Drawer ───────────────────────────────────────────────────────

function EventDetailDrawer({ event, onClose }: { event: AuditEvent; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'payload'>('timeline');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const EventIcon = getEventIcon(event.eventType);
  const iconColor = getEventIconColor(event.result, event.severity);

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
        <Heading size="medium" weight="semibold">Event details</Heading>
        <IconButton icon={CloseIcon} accessibilityLabel="Close drawer" size="medium" onClick={onClose} />
      </Box>

      {/* Event Banner */}
      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
        <CardBody>
          <Box display="flex" alignItems="flex-start" gap="spacing.3">
            <Box
              width="36px" height="36px"
              borderRadius="medium"
              backgroundColor={`surface.background.${event.result === 'Failed' ? 'negative' : event.result === 'Warning' ? 'notice' : 'positive'}.subtle` as any}
              display="flex" alignItems="center" justifyContent="center"
              flexShrink={0}
            >
              <EventIcon size="medium" color={iconColor} />
            </Box>
            <Box flex={1} display="flex" flexDirection="column" gap="spacing.1">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Heading size="small" weight="semibold">{event.eventType}</Heading>
                <Badge color={severityConfig[event.severity].color} size="small">
                  {event.severity}
                </Badge>
              </Box>
              <Text size="small" color="surface.text.gray.muted">{event.eventSubtext}</Text>
              <Text size="xsmall" color="surface.text.gray.subtle">{event.timeIST}</Text>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Detail Fields */}
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.4" marginBottom="spacing.5">
        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Session ID</Text>
          <Box display="flex" alignItems="center" gap="spacing.1" marginTop="spacing.1">
            {event.sessionId ? (
              <>
                <Text size="small" weight="semibold" color="interactive.text.primary.normal">{event.sessionId}</Text>
                <IconButton icon={CopyIcon} accessibilityLabel="Copy session ID" size="small" onClick={() => handleCopy(event.sessionId!, 'sid')} />
              </>
            ) : <Text size="small" color="surface.text.gray.muted">—</Text>}
          </Box>
        </Box>

        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Order ID</Text>
          <Box display="flex" alignItems="center" gap="spacing.1" marginTop="spacing.1">
            {event.orderId ? (
              <>
                <Text size="small" weight="semibold" color="interactive.text.primary.normal">{event.orderId}</Text>
                <IconButton icon={CopyIcon} accessibilityLabel="Copy order ID" size="small" onClick={() => handleCopy(event.orderId!, 'oid')} />
              </>
            ) : <Text size="small" color="surface.text.gray.muted">—</Text>}
          </Box>
        </Box>

        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Actor</Text>
          <Text size="small" weight="semibold" marginTop="spacing.1">{event.actor}</Text>
        </Box>

        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Source</Text>
          <Text size="small" weight="semibold" marginTop="spacing.1">{event.source}</Text>
        </Box>

        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Result</Text>
          <Box marginTop="spacing.1">
            <Badge color={resultConfig[event.result].color} size="small">{event.result}</Badge>
          </Box>
        </Box>

        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Severity</Text>
          <Box marginTop="spacing.1">
            <Badge color={severityConfig[event.severity].color} size="small">{event.severity}</Badge>
          </Box>
        </Box>

        {event.relatedProduct && (
          <Box>
            <Text size="xsmall" color="surface.text.gray.muted">Related Product</Text>
            <Text size="small" weight="semibold" marginTop="spacing.1">{event.relatedProduct}</Text>
          </Box>
        )}

        {event.customerAI && (
          <Box>
            <Text size="xsmall" color="surface.text.gray.muted">Customer AI</Text>
            <Box display="flex" alignItems="center" gap="spacing.1" marginTop="spacing.1">
              <SparklesIcon size="small" color="interactive.icon.primary.normal" />
              <Text size="small" weight="semibold">{event.customerAI}</Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* Reason */}
      <Box marginBottom="spacing.5">
        <Text size="xsmall" color="surface.text.gray.muted">Reason</Text>
        <Text size="small" marginTop="spacing.1">{event.reason}</Text>
      </Box>

      {/* Related Links */}
      <Box marginBottom="spacing.5">
        <Text size="small" weight="semibold" color="surface.text.gray.muted" marginBottom="spacing.3">Related Links</Text>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.3">
          {event.sessionId && (
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.1">
                  <Text size="xsmall" color="surface.text.gray.muted">View Session</Text>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Text size="xsmall" weight="semibold" color="interactive.text.primary.normal">{event.sessionId}</Text>
                    <Link href="/dashboard/live-sessions" style={{ textDecoration: 'none' }}>
                      <IconButton icon={ArrowRightIcon} accessibilityLabel="View session" size="small" onClick={() => {}} />
                    </Link>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          )}
          {event.orderId && (
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.1">
                  <Text size="xsmall" color="surface.text.gray.muted">View Order</Text>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Text size="xsmall" weight="semibold" color="interactive.text.primary.normal">{event.orderId}</Text>
                    <Link href="/dashboard/orders" style={{ textDecoration: 'none' }}>
                      <IconButton icon={ArrowRightIcon} accessibilityLabel="View order" size="small" onClick={() => {}} />
                    </Link>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          )}
        </Box>
      </Box>

      {/* Tabs: Event Timeline / Payload */}
      <Box marginBottom="spacing.4">
        <Tabs variant="bordered" value={activeTab} onChange={(v) => setActiveTab(v as any)}>
          <TabList>
            <TabItem value="timeline">Event timeline</TabItem>
            <TabItem value="payload">Payload</TabItem>
          </TabList>
        </Tabs>
      </Box>

      {activeTab === 'timeline' && (
        <Box display="flex" flexDirection="column" gap="spacing.3" paddingLeft="spacing.3" borderLeftWidth="thick" borderLeftColor="surface.border.primary.normal">
          {event.chainEvents.map((ce, i) => (
            <Box key={i} display="flex" flexDirection="column" gap="spacing.1">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  {ce.dot === 'success' ? (
                    <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
                  ) : ce.dot === 'error' ? (
                    <AlertCircleIcon size="small" color="interactive.icon.negative.normal" />
                  ) : ce.dot === 'warning' ? (
                    <AlertTriangleIcon size="small" color="interactive.icon.notice.normal" />
                  ) : (
                    <InfoIcon size="small" color="interactive.icon.primary.normal" />
                  )}
                  <Text size="small" weight="semibold">{ce.type}</Text>
                </Box>
                <Text size="xsmall" color="surface.text.gray.muted">{ce.time}</Text>
              </Box>
              <Box paddingLeft="spacing.6">
                <Text size="xsmall" color="surface.text.gray.subtle">{ce.description}</Text>
              </Box>
            </Box>
          ))}
          {event.chainEvents.length >= 5 && (
            <Box marginTop="spacing.2">
              <Text size="xsmall" color="surface.text.gray.muted">6 more events ▾</Text>
            </Box>
          )}
        </Box>
      )}

      {activeTab === 'payload' && (
        <Card elevation="none" backgroundColor="surface.background.gray.subtle">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              {Object.entries(event.payload).map(([k, v]) => (
                <Box key={k} display="flex" justifyContent="space-between" alignItems="center">
                  <Text size="xsmall" color="surface.text.gray.muted">{k}</Text>
                  <Text size="xsmall" weight="semibold">{String(v)}</Text>
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>
      )}

      {/* Primary CTA */}
      <Box marginTop="spacing.6">
        <Link href={event.orderId ? '/dashboard/orders' : '/dashboard/live-sessions'} style={{ textDecoration: 'none' }}>
          <Button variant="secondary" isFullWidth icon={ExternalLinkIcon} iconPosition="right">
            View full audit chain
          </Button>
        </Link>
      </Box>

      {copied && (
        <Box position="absolute" bottom="spacing.4" left="spacing.6" right="spacing.6" display="flex" justifyContent="center">
          <Badge color="positive" size="medium">Copied to clipboard!</Badge>
        </Box>
      )}
    </Box>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AuditTrailPage() {
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(MOCK_EVENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = q === '' ||
        e.eventType.toLowerCase().includes(q) ||
        (e.sessionId?.toLowerCase().includes(q) ?? false) ||
        (e.orderId?.toLowerCase().includes(q) ?? false) ||
        e.actor.toLowerCase().includes(q);
      const matchType = eventTypeFilter === 'all' || e.eventType.toLowerCase().includes(eventTypeFilter.toLowerCase());
      const matchResult = resultFilter === 'all' || e.result.toLowerCase() === resultFilter.toLowerCase();
      return matchSearch && matchType && matchResult;
    });
  }, [searchQuery, eventTypeFilter, resultFilter]);

  const reset = () => {
    setSearchQuery('');
    setEventTypeFilter('all');
    setResultFilter('all');
  };

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Audit Trail</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Review every important AI commerce event in one place
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="secondary" icon={DownloadIcon} iconPosition="left">
            Export logs
          </Button>
          <Button variant="secondary" icon={FilterIcon} iconPosition="left">
            Filter events&nbsp;&nbsp;
            <Badge color="information" size="small">3</Badge>
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)', l: 'repeat(6,1fr)' }}
        gap="spacing.4"
        marginBottom="spacing.6"
      >
        <SummaryCard title="Total events" value="12,842" trend="↑ 18.6% vs last 7 days" trendUp icon={FileTextIcon} badgeColor="primary" />
        <SummaryCard title="Success events" value="10,124" trend="↗ 78.8%" trendUp icon={CheckCircleIcon} badgeColor="positive" />
        <SummaryCard title="Failed events" value="1,342" trend="↘ 10.5%" trendUp={false} icon={AlertCircleIcon} badgeColor="negative" />
        <SummaryCard title="Sessions with events" value="1,248" trend="↑ 14.3%" trendUp icon={ZapIcon} badgeColor="primary" />
        <SummaryCard title="Orders with events" value="982" trend="↑ 11.7%" trendUp icon={ShoppingBagIcon} badgeColor="positive" />
        <SummaryCard title="Critical alerts" value="24" trend="↘ 11.1%" trendUp={false} icon={AlertTriangleIcon} badgeColor="negative" isCritical />
      </Box>

      {/* Filter Bar */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap="spacing.4">
            <Box display="flex" flexWrap="wrap" alignItems="center" gap="spacing.3" flex={1}>
              <Box width={{ base: '100%', m: '300px' }}>
                <TextInput
                  label=""
                  accessibilityLabel="Search audit events"
                  placeholder="Search by event, session ID, order ID, product"
                  value={searchQuery}
                  onChange={({ value }) => setSearchQuery(value || '')}
                />
              </Box>

              <Dropdown>
                <SelectInput label="" accessibilityLabel="Event type filter" placeholder="Event type: All" />
                <DropdownOverlay>
                  <ActionList>
                    <ActionListItem title="All Event Types" value="all" onClick={() => setEventTypeFilter('all')} />
                    <ActionListItem title="Payment success" value="payment_success" onClick={() => setEventTypeFilter('Payment success')} />
                    <ActionListItem title="Payment failed" value="payment_failed" onClick={() => setEventTypeFilter('Payment failed')} />
                    <ActionListItem title="Razorpay order created" value="order_created" onClick={() => setEventTypeFilter('Razorpay order created')} />
                    <ActionListItem title="Product matched" value="product_matched" onClick={() => setEventTypeFilter('Product matched')} />
                    <ActionListItem title="Approval requested" value="approval_req" onClick={() => setEventTypeFilter('Approval requested')} />
                    <ActionListItem title="Approval received" value="approval_recv" onClick={() => setEventTypeFilter('Approval received')} />
                    <ActionListItem title="Missing details requested" value="missing_details" onClick={() => setEventTypeFilter('Missing details')} />
                    <ActionListItem title="Request received" value="request_recv" onClick={() => setEventTypeFilter('Request received')} />
                    <ActionListItem title="Catalog searched" value="catalog_search" onClick={() => setEventTypeFilter('Catalog searched')} />
                  </ActionList>
                </DropdownOverlay>
              </Dropdown>

              <Dropdown>
                <SelectInput label="" accessibilityLabel="Result filter" placeholder="Result: All" />
                <DropdownOverlay>
                  <ActionList>
                    <ActionListItem title="All Results" value="all" onClick={() => setResultFilter('all')} />
                    <ActionListItem title="Success" value="success" onClick={() => setResultFilter('success')} />
                    <ActionListItem title="Failed" value="failed" onClick={() => setResultFilter('failed')} />
                    <ActionListItem title="Warning" value="warning" onClick={() => setResultFilter('warning')} />
                    <ActionListItem title="Info" value="info" onClick={() => setResultFilter('info')} />
                  </ActionList>
                </DropdownOverlay>
              </Dropdown>

              <Button variant="tertiary" icon={CalendarIcon} iconPosition="left">
                12 May 2025 - 19 May 2025
              </Button>
            </Box>

            <Button variant="tertiary" onClick={reset}>Reset</Button>
          </Box>
        </CardBody>
      </Card>

      {/* Event Table */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          {/* Table Header */}
          <Box
            display="grid"
            gridTemplateColumns="1.6fr 2.4fr 1.2fr 1.2fr 1.4fr 0.9fr 0.9fr 0.9fr 0.5fr"
            gap="spacing.3"
            paddingY="spacing.3"
            paddingX="spacing.4"
            backgroundColor="surface.background.gray.subtle"
            borderRadius="small"
            alignItems="center"
            marginBottom="spacing.2"
          >
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Time</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Event</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Session ID</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Order ID</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Actor</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Result</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Severity</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Source</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" textAlign="center">Actions</Text>
          </Box>

          {/* Rows */}
          {filtered.length > 0 ? (
            <Box display="flex" flexDirection="column">
              {filtered.map((ev, idx) => {
                const EvIcon = getEventIcon(ev.eventType);
                const iconColor = getEventIconColor(ev.result, ev.severity);
                const isSelected = selectedEvent?.id === ev.id;
                return (
                  <Box
                    key={ev.id}
                    display="grid"
                    gridTemplateColumns="1.6fr 2.4fr 1.2fr 1.2fr 1.4fr 0.9fr 0.9fr 0.9fr 0.5fr"
                    gap="spacing.3"
                    paddingY="spacing.3"
                    paddingX="spacing.4"
                    alignItems="center"
                    borderBottomWidth={idx !== filtered.length - 1 ? 'thin' : 'none'}
                    borderBottomColor="surface.border.gray.muted"
                    backgroundColor={isSelected ? 'surface.background.primary.subtle' : 'transparent'}
                  >
                    <Text size="xsmall" color="surface.text.gray.muted">{ev.time}</Text>

                    <Box display="flex" alignItems="flex-start" gap="spacing.2">
                      <Box
                        width="28px" height="28px" borderRadius="small"
                        backgroundColor={`surface.background.${ev.result === 'Failed' ? 'negative' : ev.result === 'Warning' ? 'notice' : 'positive'}.subtle` as any}
                        display="flex" alignItems="center" justifyContent="center"
                        flexShrink={0}
                      >
                        <EvIcon size="small" color={iconColor} />
                      </Box>
                      <Box display="flex" flexDirection="column" gap="spacing.1">
                        <Button variant="tertiary" size="small" onClick={() => setSelectedEvent(ev)}>
                          {ev.eventType}
                        </Button>
                        <Text size="xsmall" color="surface.text.gray.subtle">{ev.eventSubtext}</Text>
                      </Box>
                    </Box>

                    <Text size="xsmall" color="interactive.text.primary.normal">
                      {ev.sessionId ?? '—'}
                    </Text>

                    <Text size="xsmall" color={ev.orderId ? 'interactive.text.primary.normal' : 'surface.text.gray.muted'}>
                      {ev.orderId ?? '—'}
                    </Text>

                    <Box display="flex" flexDirection="column" gap="spacing.1">
                      <Text size="xsmall" weight="semibold">{ev.actor}</Text>
                      <Text size="xsmall" color="surface.text.gray.subtle">{ev.actorType === 'AI' ? 'AI Assistant' : ev.actorType === 'System' ? 'Payment Gateway' : ev.actorType === 'User' ? 'Customer' : 'Policy Engine'}</Text>
                    </Box>

                    <Badge color={resultConfig[ev.result].color} size="small">{ev.result}</Badge>

                    <Badge color={severityConfig[ev.severity].color} size="small">{ev.severity}</Badge>

                    <Text size="xsmall" color="surface.text.gray.muted">{ev.source}</Text>

                    <Box display="flex" justifyContent="center">
                      <IconButton
                        icon={MoreVerticalIcon}
                        accessibilityLabel="Event options"
                        size="small"
                        onClick={() => setSelectedEvent(ev)}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            /* Empty State */
            <Box
              padding="spacing.8"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap="spacing.3"
            >
              <ShieldIcon size="large" color="surface.icon.gray.subtle" />
              <Heading size="small">No events match your filters</Heading>
              <Text size="small" color="surface.text.gray.subtle">
                Try resetting your search or filter criteria to view all audit events.
              </Text>
              <Button variant="secondary" size="small" onClick={reset}>Reset all filters</Button>
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
              Showing 1 to {filtered.length} of 12,842 events
            </Text>
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Button variant="primary" size="small">1</Button>
              <Button variant="tertiary" size="small">2</Button>
              <Button variant="tertiary" size="small">3</Button>
              <Text size="small" color="surface.text.gray.muted">...</Text>
              <Button variant="tertiary" size="small">1285</Button>
              <Button variant="tertiary" size="small" icon={ChevronRightIcon} />
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Event Detail Drawer */}
      {selectedEvent && (
        <EventDetailDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </Box>
  );
}
