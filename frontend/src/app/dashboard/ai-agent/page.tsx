'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownOverlay,
  Heading,
  IconButton,
  SparklesIcon,
  Text,
  CloseIcon,
  ArrowRightIcon,
  ClockIcon,
  Amount,
} from '@razorpay/blade/components';

type Message = { id: string; role: string; content: string; created_at?: string };
type MatchedProduct = { product?: { id: string; name: string; price: number; stock_qty?: number; image_url?: string | null; sku?: string; slug?: string | null } };
type AuditEvent = {
  id: string;
  event_type: string;
  title: string;
  description?: string | null;
  result?: string | null;
  created_at: string;
};
type RelatedOrder = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  invoices?: Array<{ invoice_number: string; grand_total?: number }>;
  created_at: string;
};
type Session = {
  id: string;
  external_ai_name?: string | null;
  buyer_request_text?: string | null;
  customer_query?: string | null;
  channel?: string | null;
  status?: string | null;
  created_at: string;
  updated_at?: string | null;
  ai_conversation_messages?: Message[];
  product_matches?: MatchedProduct[];
};

const statusTone: Record<string, 'positive' | 'negative' | 'notice' | 'neutral' | 'information'> = {
  active: 'information',
  checkout_ready: 'notice',
  paid: 'positive',
  completed: 'positive',
  failed: 'negative',
  cancelled: 'neutral',
};

const statusLabel = (status?: string | null) => (status || 'active').replaceAll('_', ' ');

const TRACKING_STAGES = ['Preparing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card elevation="none" marginBottom="spacing.4">
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Text size="small" weight="semibold">{title}</Text>
          {children}
        </Box>
      </CardBody>
    </Card>
  );
}

function ConversationDrawer({
  session,
  auditEvents,
  relatedOrder,
  onClose,
}: {
  session: Session;
  auditEvents: AuditEvent[];
  relatedOrder: RelatedOrder | null;
  onClose: () => void;
}) {
  const messages = session.ai_conversation_messages ?? [];
  const matched = (session.product_matches ?? []).map((m) => m.product).filter(Boolean);
  const invoice = relatedOrder?.invoices?.[0];
  const trackingStage = !relatedOrder ? -1 : relatedOrder.status === 'paid' ? 0 : -1;

  return (
    <Box position="fixed" top="spacing.1" right="spacing.1" bottom="spacing.1" width={{ base: '100%', m: '480px' }} backgroundColor="surface.background.gray.intense" borderLeftWidth="thin" borderLeftColor="surface.border.gray.muted" zIndex={10} display="flex" flexDirection="column">
      <Box padding="spacing.5" display="flex" justifyContent="space-between" alignItems="center" borderBottomWidth="thin" borderBottomColor="surface.border.gray.muted">
        <Box display="flex" alignItems="center" gap="spacing.3">
          <SparklesIcon color="interactive.icon.primary.normal" />
          <Box>
            <Heading size="medium">Conversation details</Heading>
            <Text size="xsmall" color="surface.text.gray.subtle">Session {session.id.slice(0, 8).toUpperCase()} · {statusLabel(session.status)}</Text>
          </Box>
        </Box>
        <IconButton icon={CloseIcon} accessibilityLabel="Close conversation details" onClick={onClose} />
      </Box>

      <Box padding="spacing.5" display="flex" flexDirection="column" flex={1} overflowY="auto">
        {/* A. Conversation */}
        <SectionCard title="A. Conversation">
          <Text size="xsmall" color="surface.text.gray.subtle">
            Intent: {session.customer_query || session.buyer_request_text || 'No request recorded.'}
          </Text>
          <Divider />
          {messages.length === 0 ? (
            <Alert color="information" title="No messages recorded" description="No conversation turns have been stored yet for this session." />
          ) : (
            messages.map((message) => (
              <Box key={message.id} display="flex" flexDirection="column" gap="spacing.1" alignItems={message.role === 'user' || message.role === 'customer' ? 'flex-end' : 'flex-start'}>
                <Box padding="spacing.3" backgroundColor={message.role === 'user' || message.role === 'customer' ? 'surface.background.primary.subtle' : 'surface.background.gray.subtle'} borderRadius="medium" maxWidth="90%">
                  <Text size="small">{message.content}</Text>
                </Box>
              </Box>
            ))
          )}
        </SectionCard>

        {/* B. AI Actions timeline */}
        <SectionCard title="B. AI Actions">
          {auditEvents.length === 0 ? (
            <Text size="xsmall" color="surface.text.gray.subtle">No gateway actions recorded yet.</Text>
          ) : (
            auditEvents.map((event, index) => (
              <Box key={event.id} display="flex" gap="spacing.3" alignItems="flex-start">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box width="8px" height="8px" borderRadius="round" backgroundColor={event.result === 'success' ? 'feedback.background.positive.subtle' : event.result === 'failure' ? 'feedback.background.negative.subtle' : 'surface.background.primary.subtle'} />
                  {index < auditEvents.length - 1 && <Box width="2px" height="spacing.6" backgroundColor="surface.background.gray.moderate" />}
                </Box>
                <Box display="flex" flexDirection="column" gap="spacing.1" paddingBottom={index < auditEvents.length - 1 ? 'spacing.3' : 'spacing.0'}>
                  <Text size="small" weight="semibold">{event.title}</Text>
                  {event.description && <Text size="xsmall" color="surface.text.gray.subtle">{event.description}</Text>}
                  <Text size="xsmall" color="surface.text.gray.subtle">{new Date(event.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</Text>
                </Box>
              </Box>
            ))
          )}
        </SectionCard>

        {/* C. Related Product */}
        <SectionCard title="C. Related Product">
          {matched.length === 0 ? (
            <Text size="xsmall" color="surface.text.gray.subtle">No product recommendations recorded.</Text>
          ) : (
            matched.map((product) => (
              <Box key={product!.id} display="flex" justifyContent="space-between" alignItems="center" gap="spacing.3">
                <Box display="flex" flexDirection="column" gap="spacing.1">
                  <Text size="small" weight="semibold">{product!.name}</Text>
                  <Text size="xsmall" color="surface.text.gray.subtle">
                    Stock: {(product!.stock_qty ?? 0) > 0 ? `${product!.stock_qty} available` : 'Out of stock'}
                  </Text>
                </Box>
                <Amount value={Number(product!.price)} currency="INR" size="small" />
                {product!.slug && (
                  <Button variant="secondary" size="small" href={`/store/products/${product!.slug}`}>
                    Open
                  </Button>
                )}
              </Box>
            ))
          )}
        </SectionCard>

        {/* D. Related Order */}
        <SectionCard title="D. Related Order">
          {!relatedOrder ? (
            <Text size="xsmall" color="surface.text.gray.subtle">No order created from this conversation yet.</Text>
          ) : (
            <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.3">
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="small" weight="semibold">{relatedOrder.id.slice(0, 8).toUpperCase()}</Text>
                <Badge color={relatedOrder.status === 'paid' ? 'positive' : 'notice'} size="small">{relatedOrder.status === 'paid' ? 'Paid' : 'Pending Payment'}</Badge>
              </Box>
              <Box display="flex" alignItems="center" gap="spacing.3">
                <Amount value={Number(relatedOrder.amount)} currency={(relatedOrder.currency || 'INR') as 'INR'} size="small" />
                <Button variant="secondary" size="small" iconPosition="right" icon={ArrowRightIcon} href={`/dashboard/orders?order=${relatedOrder.id}`}>Open</Button>
              </Box>
            </Box>
          )}
        </SectionCard>

        {/* E. Invoice */}
        <SectionCard title="E. Invoice">
          {!invoice ? (
            <Text size="xsmall" color="surface.text.gray.subtle">Invoice is generated after payment succeeds.</Text>
          ) : (
            <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.3">
              <Text size="small" weight="semibold">{invoice.invoice_number}</Text>
              <Button variant="secondary" size="small" href={relatedOrder ? `/store/order-success/${relatedOrder.id}` : '/dashboard/orders'}>View Invoice</Button>
            </Box>
          )}
        </SectionCard>

        {/* F. Dummy Tracking */}
        <SectionCard title="F. Shipment Tracking">
          {trackingStage < 0 ? (
            <Text size="xsmall" color="surface.text.gray.subtle">Tracking starts after the order is paid.</Text>
          ) : (
            <Box display="flex" flexDirection="column" gap="spacing.2">
              {TRACKING_STAGES.map((stage, index) => (
                <Box key={stage} display="flex" alignItems="center" gap="spacing.3">
                  <Box width="8px" height="8px" borderRadius="round" backgroundColor={index <= trackingStage ? 'feedback.background.positive.subtle' : 'surface.background.gray.moderate'} />
                  <Text size="small" color={index <= trackingStage ? 'surface.text.gray.normal' : 'surface.text.gray.subtle'}>{stage}</Text>
                  {index === trackingStage && <Badge color="notice" size="small">Current</Badge>}
                </Box>
              ))}
            </Box>
          )}
        </SectionCard>

        {/* G. Audit Trail */}
        <SectionCard title="G. Audit Trail">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text size="small">{auditEvents.length} event{auditEvents.length === 1 ? '' : 's'} recorded</Text>
            <Button variant="secondary" size="small" href="/dashboard/audit-trail" icon={ClockIcon} iconPosition="left">Open Audit Trail</Button>
          </Box>
        </SectionCard>
      </Box>
    </Box>
  );
}

export default function AIAgentPage() {
  return (
    <Suspense fallback={<Box padding={{ base: 'spacing.4', m: 'spacing.8' }}><Text size="small">Loading conversations…</Text></Box>}>
      <AIAgentPageInner />
    </Suspense>
  );
}

function AIAgentPageInner() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<Session | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [relatedOrder, setRelatedOrder] = useState<RelatedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/sessions?status=all')
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not load sessions'); return data; })
      .then((data) => {
        if (!cancelled) {
          setSessions(data.sessions ?? []);
          const deepLink = searchParams.get('session');
          if (deepLink) {
            const match = (data.sessions ?? []).find((s: Session) => s.id === deepLink);
            if (match) setSelected(match);
          }
        }
      })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load sessions'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [searchParams]);

  // Load related audit events + order whenever a session is selected
  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setAuditEvents([]);
    setRelatedOrder(null);
    Promise.all([
      fetch(`/api/audit?session_id=${selected.id}&limit=100`).then((r) => r.json()),
      fetch(`/api/orders?session_id=${selected.id}`).then((r) => r.json()),
    ])
      .then(([auditData, orderData]) => {
        if (cancelled) return;
        setAuditEvents(auditData.audit_logs ?? []);
        const orders = orderData.orders ?? [];
        setRelatedOrder(orders[0] ?? null);
      })
      .catch(() => { if (!cancelled) { setAuditEvents([]); setRelatedOrder(null); } });
    return () => { cancelled = true; };
  }, [selected]);

  const activeCount = useMemo(() => sessions.filter((session) => ['active', 'checkout_ready'].includes(session.status || '')).length, [sessions]);

  return (
    <Box padding={{ base: 'spacing.4', m: 'spacing.8' }} backgroundColor="surface.background.gray.subtle" minHeight="100%">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6"><Box display="flex" flexDirection="column" gap="spacing.1"><Heading size="2xlarge" weight="semibold">Conversations</Heading><Text size="small" color="surface.text.gray.subtle">Every customer and AI-agent conversation handled by your storefront assistant.</Text></Box><Button variant="secondary" href="/dashboard/settings/ai-defaults">AI Assistant Settings</Button></Box>
      <Box display="flex" gap="spacing.4" marginBottom="spacing.6">
        <Card elevation="none"><CardBody><Text size="xsmall" color="surface.text.gray.muted">Total conversations</Text><Heading size="large">{sessions.length}</Heading></CardBody></Card>
        <Card elevation="none"><CardBody><Text size="xsmall" color="surface.text.gray.muted">Active now</Text><Heading size="large">{activeCount}</Heading></CardBody></Card>
        <Card elevation="none"><CardBody><Text size="xsmall" color="surface.text.gray.muted">Converted to orders</Text><Heading size="large">{sessions.filter((s) => s.status === 'paid').length}</Heading></CardBody></Card>
      </Box>
      {error && <Alert color="negative" title="Unable to load conversations" description={error} marginBottom="spacing.5" />}
      <Card elevation="none"><CardBody><Box display="flex" flexDirection="column" gap="spacing.1"><Heading size="medium">All Conversations</Heading><Text size="small" color="surface.text.gray.subtle">Click a conversation to see messages, AI actions, order, invoice and tracking.</Text></Box><Box marginTop="spacing.5">{loading ? <Text size="small">Loading conversations…</Text> : sessions.length === 0 ? <Alert color="information" title="No conversations yet" description="When a customer chats with the storefront assistant, their session will appear here automatically." /> : sessions.map((session, index) => <Box key={session.id} display="flex" alignItems="center" justifyContent="space-between" gap="spacing.4" paddingY="spacing.4" borderTopWidth={index === 0 ? 'none' : 'thin'} borderTopColor="surface.border.gray.muted"><Box display="flex" alignItems="center" gap="spacing.3" flex={1}><Box width="40px" height="40px" borderRadius="round" backgroundColor="surface.background.primary.subtle" display="flex" alignItems="center" justifyContent="center"><SparklesIcon color="interactive.icon.primary.normal" /></Box><Box display="flex" flexDirection="column" gap="spacing.1"><Text size="small" weight="semibold">{session.external_ai_name || 'Customer'}</Text><Text size="xsmall" color="surface.text.gray.subtle">{session.customer_query || session.buyer_request_text || 'No request recorded.'}</Text></Box></Box><Box display="flex" alignItems="center" gap="spacing.3"><Badge color={statusTone[session.status || 'active'] ?? 'neutral'} size="small">{statusLabel(session.status)}</Badge><Text size="xsmall" color="surface.text.gray.subtle">{new Date(session.updated_at || session.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</Text><Button variant="secondary" size="small" onClick={() => setSelected(session)}>View</Button></Box></Box>)}</Box></CardBody></Card>
      {selected && <ConversationDrawer session={selected} auditEvents={auditEvents} relatedOrder={relatedOrder} onClose={() => setSelected(null)} />}
    </Box>
  );
}
