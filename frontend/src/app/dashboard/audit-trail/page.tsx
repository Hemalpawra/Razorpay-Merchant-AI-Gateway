'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  CloseIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  Alert,
  SparklesIcon,
  RefreshIcon,
  FileTextIcon,
  ShoppingBagIcon,
  ZapIcon
} from '@razorpay/blade/components';

type EventResult = 'Success' | 'Failed' | 'Warning' | 'Info';

interface AuditLogItem {
  id: string;
  time: string;
  eventType: string;
  sessionId: string | null;
  orderId: string | null;
  rawSessionId?: string | null;
  rawOrderId?: string | null;
  actor: string;
  actorType: string;
  result: EventResult;
  title: string;
  description: string;
  reason?: string | null;
  rawLog?: any;
}

const resultConfig: Record<EventResult, { color: 'positive' | 'negative' | 'notice' | 'information', label: string }> = {
  Success: { color: 'positive', label: 'Success' },
  Failed: { color: 'negative', label: 'Failed' },
  Warning: { color: 'notice', label: 'Warning' },
  Info: { color: 'information', label: 'Info' },
};

function EventDetailDrawer({
  event,
  chainFilter,
  onOpenFullChain,
  onClose,
}: {
  event: AuditLogItem;
  chainFilter: string | null;
  onOpenFullChain: (sessionId: string) => void;
  onClose: () => void;
}) {
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
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.5">
        <Heading size="medium" weight="semibold">Event Details</Heading>
        <IconButton icon={CloseIcon} accessibilityLabel="Close drawer" size="medium" onClick={onClose} />
      </Box>

      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.2">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Heading size="small" weight="semibold">{event.title}</Heading>
              <Badge color={resultConfig[event.result].color} size="small">{event.result}</Badge>
            </Box>
            <Text size="small" color="surface.text.gray.muted">{event.description}</Text>
            {event.reason && (
              <Alert color="negative" title="Reason" description={event.reason} />
            )}
            <Text size="xsmall" color="surface.text.gray.subtle">{event.time}</Text>
          </Box>
        </CardBody>
      </Card>

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.4" marginBottom="spacing.5">
        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Session ID</Text>
          <Text size="small" weight="semibold" marginTop="spacing.1">{event.sessionId || '—'}</Text>
        </Box>
        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Order ID</Text>
          <Text size="small" weight="semibold" marginTop="spacing.1">{event.orderId || '—'}</Text>
        </Box>
        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Actor</Text>
          <Text size="small" weight="semibold" marginTop="spacing.1">{event.actor}</Text>
        </Box>
        <Box>
          <Text size="xsmall" color="surface.text.gray.muted">Event Type</Text>
          <Text size="small" weight="semibold" marginTop="spacing.1">{event.eventType}</Text>
        </Box>
      </Box>

      <Box marginTop="auto" display="flex" flexDirection="column" gap="spacing.3">
        {event.rawSessionId && (
          <Button variant="secondary" isFullWidth href={`/dashboard/ai-agent?session=${event.rawSessionId}`}>
            View Related Conversation
          </Button>
        )}
        {event.rawOrderId && (
          <Button variant="secondary" isFullWidth href={`/dashboard/orders?order=${event.rawOrderId}`}>
            View Related Order
          </Button>
        )}
        {event.rawSessionId && event.rawSessionId !== chainFilter && (
          <Button variant="primary" isFullWidth onClick={() => onOpenFullChain(event.rawSessionId!)}>
            Open Full Chain ({event.sessionId})
          </Button>
        )}
        <Button variant="tertiary" onClick={onClose} isFullWidth>Close</Button>
      </Box>
    </Box>
  );
}

export default function AuditTrailPage() {
  return (
    <Suspense
      fallback={
        <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
          <Text size="small" color="surface.text.gray.muted">Loading audit trail...</Text>
        </Box>
      }
    >
      <AuditTrailPageInner />
    </Suspense>
  );
}

function AuditTrailPageInner() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AuditLogItem | null>(null);
  const [chainFilter, setChainFilter] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.audit_logs) {
        const mapped: AuditLogItem[] = data.audit_logs.map((log: any) => ({
          id: log.id,
          time: new Date(log.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'medium' }),
          eventType: log.event_type,
          sessionId: log.session_id ? log.session_id.substring(0, 8).toUpperCase() : null,
          orderId: log.order_id ? log.order_id.substring(0, 8).toUpperCase() : null,
          rawSessionId: log.session_id,
          rawOrderId: log.order_id,
          actor: log.actor_type,
          actorType: log.actor_type,
          result:
            log.result === 'success'
              ? 'Success'
              : log.result === 'failure' || log.result === 'error'
                ? 'Failed'
                : log.result === 'warning'
                  ? 'Warning'
                  : 'Info',
          title: log.title,
          description: log.description || log.title,
          reason: log.meta_json?.reason || (log.result === 'failure' ? log.description : null),
          rawLog: log
        }));
        setLogs(mapped);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    const sessionParam = searchParams.get('session');
    if (sessionParam) setChainFilter(sessionParam);
  }, []);

  const visibleLogs = chainFilter
    ? logs.filter((log) => log.rawSessionId === chainFilter)
    : logs;

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Audit Trail</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Review every important AI commerce event and API gateway transaction in real-time.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="primary" icon={RefreshIcon} iconPosition="left" onClick={fetchAuditLogs}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, 1fr)', l: 'repeat(5, 1fr)' }} gap="spacing.4" marginBottom="spacing.6">
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Total Events</Text>
            <Heading size="xlarge">{visibleLogs.length}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Success</Text>
            <Heading size="xlarge">{visibleLogs.filter(l => l.result === 'Success').length}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Failed</Text>
            <Heading size="xlarge">{visibleLogs.filter(l => l.result === 'Failed').length}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Sessions with Events</Text>
            <Heading size="xlarge">{new Set(visibleLogs.filter(l => l.rawSessionId).map(l => l.rawSessionId)).size}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Orders with Events</Text>
            <Heading size="xlarge">{new Set(visibleLogs.filter(l => l.rawOrderId).map(l => l.rawOrderId)).size}</Heading>
          </CardBody>
        </Card>
      </Box>

      {chainFilter && (
        <Box display="flex" alignItems="center" justifyContent="space-between" padding="spacing.3" marginBottom="spacing.4" backgroundColor="surface.background.gray.intense" borderRadius="medium">
          <Text size="small">Showing full event chain for session {chainFilter.substring(0, 8).toUpperCase()}</Text>
          <Button variant="secondary" size="small" onClick={() => setChainFilter(null)}>Show All Events</Button>
        </Box>
      )}

      {/* Audit Logs Table */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box overflowX="auto">
          <Box 
            display="grid" 
            minWidth="900px"
            gridTemplateColumns="1.5fr 2fr 1.2fr 1.2fr 1fr 1fr auto" 
            gap="spacing.4" 
            paddingY="spacing.3" 
            paddingX="spacing.4"
            backgroundColor="surface.background.gray.subtle"
            borderRadius="small"
            marginBottom="spacing.2"
          >
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">TIME</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">TITLE &amp; DESCRIPTION</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">SESSION ID</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">ORDER ID</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">ACTOR</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">RESULT</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" textAlign="right">ACTIONS</Text>
          </Box>

          {isLoading ? (
            <Box padding="spacing.4"><Text size="small" color="surface.text.gray.muted">Loading audit logs from DB...</Text></Box>
          ) : visibleLogs.length === 0 ? (
            <Box padding="spacing.4"><Text size="small" color="surface.text.gray.muted">No audit events logged yet.</Text></Box>
          ) : (
            <Box display="flex" flexDirection="column" minWidth="900px">
              {visibleLogs.map((log, index) => (
                <Box 
                  key={log.id}
                  paddingY="spacing.4"
                  paddingX="spacing.4"
                  borderBottomWidth={index !== visibleLogs.length - 1 ? 'thin' : 'none'}
                  borderBottomColor="surface.border.gray.muted"
                  display="grid"
                  gridTemplateColumns="1.5fr 2fr 1.2fr 1.2fr 1fr 1fr auto"
                  gap="spacing.4"
                  alignItems="center"
                >
                  <Text size="xsmall" color="surface.text.gray.muted">{log.time}</Text>
                  <Box flex={1}>
                    <Text size="small" weight="semibold">{log.title}</Text>
                    <Text size="xsmall" color="surface.text.gray.subtle">{log.description}</Text>
                  </Box>
                  <Text size="xsmall" weight="semibold" color="interactive.text.primary.normal">{log.sessionId || '—'}</Text>
                  <Text size="xsmall" weight="semibold" color="interactive.text.primary.normal">{log.orderId || '—'}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">{log.actor}</Text>
                  <Box>
                    <Badge color={resultConfig[log.result].color} size="small">
                      {resultConfig[log.result].label}
                    </Badge>
                  </Box>
                  <Box display="flex" alignItems="center" gap="spacing.2" justifyContent="flex-end">
                    <Button variant="secondary" size="small" onClick={() => setSelectedEvent(log)}>
                      View
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          </Box>
        </CardBody>
      </Card>

      {selectedEvent && (
        <EventDetailDrawer
          event={selectedEvent}
          chainFilter={chainFilter}
          onOpenFullChain={(sessionId) => {
            setChainFilter(sessionId);
            setSelectedEvent(null);
          }}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Box>
  );
}
