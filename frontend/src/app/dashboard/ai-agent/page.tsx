'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  IconButton,
  SparklesIcon,
  Text,
  CloseIcon,
} from '@razorpay/blade/components';

type Message = { id: string; role: string; content: string; created_at?: string };
type Session = {
  id: string;
  external_ai_name?: string | null;
  buyer_request_text?: string | null;
  customer_query?: string | null;
  status?: string | null;
  created_at: string;
  updated_at?: string | null;
  ai_conversation_messages?: Message[];
};

const statusLabel = (status?: string | null) => (status || 'active').replaceAll('_', ' ');

function SessionDrawer({ session, onClose }: { session: Session; onClose: () => void }) {
  const messages = session.ai_conversation_messages ?? [];
  return (
    <Box position="fixed" top="spacing.1" right="spacing.1" bottom="spacing.1" width={{ base: '100%', m: '440px' }} backgroundColor="surface.background.gray.intense" borderLeftWidth="thin" borderLeftColor="surface.border.gray.muted" zIndex={10} display="flex" flexDirection="column">
      <Box padding="spacing.5" display="flex" justifyContent="space-between" alignItems="center" borderBottomWidth="thin" borderBottomColor="surface.border.gray.muted">
        <Box display="flex" alignItems="center" gap="spacing.3"><SparklesIcon color="interactive.icon.primary.normal" /><Box><Heading size="medium">Session details</Heading><Text size="xsmall" color="surface.text.gray.subtle">{session.id.slice(0, 8).toUpperCase()}</Text></Box></Box>
        <IconButton icon={CloseIcon} accessibilityLabel="Close session details" onClick={onClose} />
      </Box>
      <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.4" overflow="auto" flex={1}>
        <Card elevation="none"><CardBody><Box display="flex" flexDirection="column" gap="spacing.2"><Text size="small" weight="semibold">Customer request</Text><Text size="small">{session.customer_query || session.buyer_request_text || 'No request recorded.'}</Text></Box></CardBody></Card>
        {messages.length === 0 ? <Alert color="information" title="No messages recorded" description="This session exists, but no conversation turns have been stored yet." /> : messages.map((message) => <Box key={message.id} display="flex" flexDirection="column" gap="spacing.1" alignItems={message.role === 'user' || message.role === 'customer' ? 'flex-end' : 'flex-start'}><Text size="xsmall" color="surface.text.gray.subtle">{message.role}</Text><Box padding="spacing.3" backgroundColor={message.role === 'user' || message.role === 'customer' ? 'surface.background.primary.subtle' : 'surface.background.gray.subtle'} borderRadius="medium" maxWidth="90%"><Text size="small">{message.content}</Text></Box></Box>)}
      </Box>
    </Box>
  );
}

export default function AIAgentPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/sessions?status=all')
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not load sessions'); return data; })
      .then((data) => { if (!cancelled) setSessions(data.sessions ?? []); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load sessions'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const activeCount = useMemo(() => sessions.filter((session) => session.status === 'active').length, [sessions]);
  return (
    <Box padding={{ base: 'spacing.4', m: 'spacing.8' }} backgroundColor="surface.background.gray.subtle" minHeight="100%">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6"><Box display="flex" flexDirection="column" gap="spacing.1"><Heading size="2xlarge" weight="semibold">AI Agent</Heading><Text size="small" color="surface.text.gray.subtle">Monitor real customer conversations, recommendations, and checkout handoffs.</Text></Box><Button variant="secondary" href="/dashboard/settings/ai-defaults">AI Agent Settings</Button></Box>
      <Box display="flex" gap="spacing.4" marginBottom="spacing.6"><Card elevation="none"><CardBody><Text size="xsmall" color="surface.text.gray.subtle">Total sessions</Text><Heading size="large">{sessions.length}</Heading></CardBody></Card><Card elevation="none"><CardBody><Text size="xsmall" color="surface.text.gray.subtle">Active now</Text><Heading size="large">{activeCount}</Heading></CardBody></Card></Box>
      {error && <Alert color="negative" title="Unable to load conversations" description={error} marginBottom="spacing.5" />}
      <Card elevation="none"><CardBody><Box display="flex" flexDirection="column" gap="spacing.1"><Heading size="medium">Conversations</Heading><Text size="small" color="surface.text.gray.subtle">Only sessions recorded by the live gateway appear here.</Text></Box><Box marginTop="spacing.5">{loading ? <Text size="small">Loading conversations…</Text> : sessions.length === 0 ? <Alert color="information" title="No conversations yet" description="When a customer or external AI uses the storefront assistant, its session will appear here." /> : sessions.map((session) => <Box key={session.id} display="flex" alignItems="center" justifyContent="space-between" gap="spacing.4" paddingY="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted"><Box display="flex" alignItems="center" gap="spacing.3" flex={1}><Box width="40px" height="40px" borderRadius="round" backgroundColor="surface.background.primary.subtle" display="flex" alignItems="center" justifyContent="center"><SparklesIcon color="interactive.icon.primary.normal" /></Box><Box display="flex" flexDirection="column" gap="spacing.1"><Text size="small" weight="semibold">{session.external_ai_name || 'Customer session'}</Text><Text size="xsmall" color="surface.text.gray.subtle">{session.customer_query || session.buyer_request_text || 'No request recorded.'}</Text></Box></Box><Box display="flex" alignItems="center" gap="spacing.3"><Text size="xsmall" color="surface.text.gray.subtle">{statusLabel(session.status)}</Text><Button variant="secondary" size="small" onClick={() => setSelected(session)}>View</Button></Box></Box>)}</Box></CardBody></Card>
      {selected && <SessionDrawer session={selected} onClose={() => setSelected(null)} />}
    </Box>
  );
}

