'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  Badge, 
  SelectInput, 
  ActionList, 
  ActionListItem, 
  TextInput, 
  Dropdown, 
  DropdownOverlay,
  RefreshIcon,
  DownloadIcon,
  CloseIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  SparklesIcon,
  UserIcon
} from '@razorpay/blade/components';

type SessionStatus = 
  | 'New' 
  | 'Matching' 
  | 'Awaiting Details' 
  | 'Awaiting Confirmation' 
  | 'Checkout Ready' 
  | 'Payment Pending' 
  | 'Paid' 
  | 'Failed' 
  | 'Cancelled';

interface SessionItem {
  id: string;
  customerAI: string;
  assistantType: string;
  summary: string;
  budget: string;
  status: SessionStatus;
  assignedTo: string;
  updated: string;
  rawSession?: any;
}

const statusConfig: Record<SessionStatus, { color: 'primary' | 'notice' | 'information' | 'positive' | 'negative' | 'neutral', label: string }> = {
  'New': { color: 'primary', label: 'New' },
  'Matching': { color: 'notice', label: 'Matching' },
  'Awaiting Details': { color: 'notice', label: 'Awaiting Details' },
  'Awaiting Confirmation': { color: 'notice', label: 'Awaiting Confirmation' },
  'Checkout Ready': { color: 'information', label: 'Checkout Ready' },
  'Payment Pending': { color: 'information', label: 'Payment Pending' },
  'Paid': { color: 'positive', label: 'Paid' },
  'Failed': { color: 'negative', label: 'Failed' },
  'Cancelled': { color: 'neutral', label: 'Cancelled' },
};

function mapDbStatusToUi(dbStatus: string): SessionStatus {
  if (dbStatus === 'created' || dbStatus === 'active') return 'New';
  if (dbStatus === 'searching') return 'Matching';
  if (dbStatus === 'awaiting_confirmation') return 'Awaiting Confirmation';
  if (dbStatus === 'claimed') return 'Awaiting Details';
  if (dbStatus === 'completed') return 'Checkout Ready';
  if (dbStatus === 'checkout_ready') return 'Checkout Ready';
  if (dbStatus === 'paid') return 'Paid';
  return 'Matching';
}

function SessionDetailDrawer({ 
  session, 
  onClose, 
  onClaim 
}: { 
  session: SessionItem, 
  onClose: () => void, 
  onClaim: (id: string) => void 
}) {
  return (
    <Box 
      position="fixed" 
      top="56px" 
      right="spacing.0" 
      width="440px" 
      height="calc(100vh - 56px)" 
      backgroundColor="surface.background.gray.intense"
      borderLeftWidth="thin"
      borderLeftColor="surface.border.gray.muted"
      padding="spacing.6"
      display="flex"
      flexDirection="column"
      zIndex={100}
      overflow="auto"
      elevation="none"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.5">
        <Box display="flex" alignItems="center" gap="spacing.3">
          <Heading size="medium">{session.id}</Heading>
          <Badge color={statusConfig[session.status].color} size="small">
            {statusConfig[session.status].label}
          </Badge>
        </Box>
        <Button variant="tertiary" size="small" icon={CloseIcon} onClick={onClose}>
          Close
        </Button>
      </Box>

      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.5">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Customer AI</Text>
                <Box display="flex" alignItems="center" gap="spacing.2" marginTop="spacing.1">
                  <SparklesIcon size="small" color="interactive.icon.primary.normal" />
                  <Text size="small" weight="semibold">{session.customerAI}</Text>
                </Box>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">Assigned Merchant Agent</Text>
                <Box display="flex" alignItems="center" gap="spacing.2" marginTop="spacing.1">
                  <UserIcon size="small" color="surface.icon.gray.subtle" />
                  <Text size="small" weight="semibold">{session.assignedTo.replace(' (you)', '')}</Text>
                </Box>
              </Box>
            </Box>

            <Box borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
              <Text size="xsmall" color="surface.text.gray.muted">Budget Limit</Text>
              <Heading size="small" color="interactive.text.primary.normal">{session.budget}</Heading>
            </Box>
          </Box>
        </CardBody>
      </Card>

      <Box marginBottom="spacing.5">
        <Text size="small" weight="semibold" marginBottom="spacing.2">AI Buyer Request</Text>
        <Box padding="spacing.3" backgroundColor="surface.background.gray.subtle" borderRadius="small" borderWidth="thin" borderColor="surface.border.gray.muted">
          <Text size="small">{session.summary}</Text>
        </Box>
      </Box>

      <Box marginBottom="spacing.6">
        <Text size="small" weight="semibold" marginBottom="spacing.3">Gateway Session Progress</Text>
        <Box display="flex" flexDirection="column" gap="spacing.3" paddingLeft="spacing.3" borderLeftWidth="thick" borderLeftColor="surface.border.primary.normal">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
              <Text size="small">Request Ingested &amp; Verified</Text>
            </Box>
            <Text size="xsmall" color="surface.text.gray.muted">{session.updated}</Text>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
              <Text size="small">Catalog Matching &amp; Stock Check</Text>
            </Box>
            <Text size="xsmall" color="surface.text.gray.muted">{session.updated}</Text>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <ClockIcon size="small" color="interactive.icon.notice.normal" />
              <Text size="small" weight="semibold">{session.status}</Text>
            </Box>
            <Text size="xsmall" color="surface.text.gray.muted">Now</Text>
          </Box>
        </Box>
      </Box>

      <Box marginTop="auto" display="flex" flexDirection="column" gap="spacing.2" paddingTop="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted">
        <Button variant="primary" isFullWidth onClick={() => onClaim(session.rawSession?.id || session.id)}>
          Claim &amp; Approve Match
        </Button>
        <Button variant="secondary" isFullWidth onClick={onClose}>Dismiss</Button>
      </Box>
    </Box>
  );
}

export default function LiveSessionsPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      if (data.sessions) {
        const mapped: SessionItem[] = data.sessions.map((s: any) => ({
          id: s.id.substring(0, 8).toUpperCase(),
          customerAI: s.external_ai_name || 'Customer AI',
          assistantType: 'AI Assistant',
          summary: s.buyer_request_text,
          budget: s.budget_max ? `₹${Number(s.budget_max).toLocaleString('en-IN')}` : 'Flexible',
          status: mapDbStatusToUi(s.status),
          assignedTo: s.claimed_by || 'Unassigned',
          updated: new Date(s.updated_at || s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawSession: s
        }));
        setSessions(mapped);
      }
    } catch (err) {
      console.error('Error fetching live sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleClaimSession = async (rawId: string) => {
    try {
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: rawId,
          status: 'claimed',
          claimed_by: 'Arjun Mehta'
        })
      });
      setSelectedSession(null);
      fetchSessions();
    } catch (err) {
      console.error('Error claiming session:', err);
    }
  };

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box>
          <Heading size="2xlarge" marginBottom="spacing.2">Live Sessions</Heading>
          <Text color="surface.text.gray.subtle">
            Real-time AI buyer requests, negotiations, and automated order conversions.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="primary" icon={RefreshIcon} iconPosition="left" onClick={fetchSessions}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box display="grid" gap="spacing.4" gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)', l: 'repeat(4, 1fr)' }} marginBottom="spacing.6">
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Total Sessions</Text>
            <Heading size="large">{sessions.length}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Awaiting Confirm</Text>
            <Heading size="large">{sessions.filter(s => s.status === 'Awaiting Confirmation').length}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Matching</Text>
            <Heading size="large">{sessions.filter(s => s.status === 'Matching').length}</Heading>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Paid / Completed</Text>
            <Heading size="large">{sessions.filter(s => s.status === 'Paid' || s.status === 'Checkout Ready').length}</Heading>
          </CardBody>
        </Card>
      </Box>

      {/* Sessions Table */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box overflowX="auto">
          <Box 
            display="grid" 
            minWidth="900px"
            gridTemplateColumns="1fr 1.2fr 2.5fr 1fr 1.3fr 1fr 1fr auto" 
            gap="spacing.4" 
            paddingY="spacing.3" 
            paddingX="spacing.4"
            backgroundColor="surface.background.gray.subtle"
            borderRadius="small"
            marginBottom="spacing.2"
          >
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">SESSION ID</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">BUYER AI</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">REQUEST SUMMARY</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">BUDGET</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">STATUS</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">ASSIGNED TO</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">UPDATED</Text>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" textAlign="right">ACTIONS</Text>
          </Box>

          {isLoading ? (
            <Box padding="spacing.4"><Text size="small" color="surface.text.gray.muted">Loading live sessions from DB...</Text></Box>
          ) : sessions.length === 0 ? (
            <Box padding="spacing.4"><Text size="small" color="surface.text.gray.muted">No active buyer sessions found.</Text></Box>
          ) : (
            <Box display="flex" flexDirection="column" minWidth="900px">
              {sessions.map((session, index) => (
                <Box 
                  key={session.id}
                  paddingY="spacing.4"
                  paddingX="spacing.4"
                  borderBottomWidth={index !== sessions.length - 1 ? 'thin' : 'none'}
                  borderBottomColor="surface.border.gray.muted"
                  display="grid"
                  gridTemplateColumns="1fr 1.2fr 2.5fr 1fr 1.3fr 1fr 1fr auto"
                  gap="spacing.4"
                  alignItems="center"
                >
                  <Text weight="semibold" size="small" color="surface.text.primary.normal">{session.id}</Text>
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <SparklesIcon size="xsmall" color="interactive.icon.primary.normal" />
                    <Text size="small" weight="semibold">{session.customerAI}</Text>
                  </Box>
                  <Box overflow="hidden" whiteSpace="nowrap">
                    <Text size="small" color="surface.text.gray.subtle">{session.summary}</Text>
                  </Box>
                  <Text size="small" weight="semibold">{session.budget}</Text>
                  <Box>
                    <Badge color={statusConfig[session.status].color} size="small">
                      {statusConfig[session.status].label}
                    </Badge>
                  </Box>
                  <Text size="small" color="surface.text.gray.subtle">{session.assignedTo}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">{session.updated}</Text>
                  <Box display="flex" alignItems="center" gap="spacing.2" justifyContent="flex-end">
                    <Button variant="secondary" size="small" onClick={() => setSelectedSession(session)}>
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

      {selectedSession && (
        <SessionDetailDrawer 
          session={selectedSession} 
          onClose={() => setSelectedSession(null)} 
          onClaim={handleClaimSession}
        />
      )}
    </Box>
  );
}
