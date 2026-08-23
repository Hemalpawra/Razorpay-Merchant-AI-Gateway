'use client';

import React, { useState } from 'react';
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
  MoreVerticalIcon,
  CloseIcon,
  SearchIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  SparklesIcon,
  UserIcon,
  ChevronRightIcon
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

interface Session {
  id: string;
  customerAI: string;
  assistantType: string;
  summary: string;
  budget: string;
  status: SessionStatus;
  assignedTo: string;
  updated: string;
}

const mockSessions: Session[] = [
  { id: 'S-78291', customerAI: 'ShopSmart AI', assistantType: 'Customer Assistant', summary: 'Looking for noise cancelling headphones under ₹5,000', budget: '₹5,000 INR', status: 'Awaiting Confirmation', assignedTo: 'Arjun Mehta (you)', updated: '2m ago' },
  { id: 'S-78290', customerAI: 'BudgetBuy AI', assistantType: 'Customer Assistant', summary: 'Smartwatch with heart rate monitor and GPS', budget: '₹8,000 INR', status: 'Matching', assignedTo: 'Unassigned', updated: '3m ago' },
  { id: 'S-78289', customerAI: 'GadgetGenie AI', assistantType: 'Customer Assistant', summary: 'Gaming chair with lumbar support', budget: '₹12,000 INR', status: 'Awaiting Details', assignedTo: 'Neha Sharma', updated: '5m ago' },
  { id: 'S-78288', customerAI: 'DealFinder AI', assistantType: 'Customer Assistant', summary: 'Looking for iPhone 15 128GB best price', budget: '₹65,000 INR', status: 'Checkout Ready', assignedTo: 'Rohit Verma', updated: '8m ago' },
  { id: 'S-78287', customerAI: 'ValueSeeker AI', assistantType: 'Customer Assistant', summary: 'Bluetooth speaker for outdoor use', budget: '₹3,000 INR', status: 'Payment Pending', assignedTo: 'Arjun Mehta (you)', updated: '10m ago' },
  { id: 'S-78286', customerAI: 'TechEagle AI', assistantType: 'Customer Assistant', summary: 'MacBook Air M2 16GB/512GB', budget: '₹1,10,000 INR', status: 'Paid', assignedTo: 'Arjun Mehta (you)', updated: '15m ago' },
  { id: 'S-78285', customerAI: 'SmartCart AI', assistantType: 'Customer Assistant', summary: 'Canon EOS R50 with kit lens', budget: '₹55,000 INR', status: 'Failed', assignedTo: 'Unassigned', updated: '18m ago' },
  { id: 'S-78284', customerAI: 'QuickBuy AI', assistantType: 'Customer Assistant', summary: 'Wireless earbuds under ₹2,000', budget: '₹2,000 INR', status: 'Cancelled', assignedTo: 'Rohit Verma', updated: '22m ago' },
];

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

function SummaryStatCard({ title, value, trend, isPositive = true }: { title: string, value: string, trend?: string, isPositive?: boolean }) {
  return (
    <Card elevation="none" backgroundColor="surface.background.gray.intense">
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">{title}</Text>
          <Heading size="large">{value}</Heading>
          {trend && (
            <Text size="xsmall" color={isPositive ? 'interactive.text.positive.normal' : 'interactive.text.negative.normal'}>
              {isPositive ? '↑' : '↓'} {trend}
            </Text>
          )}
        </Box>
      </CardBody>
    </Card>
  );
}

function SessionDetailDrawer({ session, onClose }: { session: Session, onClose: () => void }) {
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
      {/* Header */}
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

      {/* Overview Details */}
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

      {/* AI Intent & Request */}
      <Box marginBottom="spacing.5">
        <Text size="small" weight="semibold" marginBottom="spacing.2">AI Buyer Request</Text>
        <Box padding="spacing.3" backgroundColor="surface.background.gray.subtle" borderRadius="small" borderWidth="thin" borderColor="surface.border.gray.muted">
          <Text size="small">{session.summary}</Text>
        </Box>
      </Box>

      {/* Session Timeline / Progress */}
      <Box marginBottom="spacing.6">
        <Text size="small" weight="semibold" marginBottom="spacing.3">Gateway Session Progress</Text>
        <Box display="flex" flexDirection="column" gap="spacing.3" paddingLeft="spacing.3" borderLeftWidth="thick" borderLeftColor="surface.border.primary.normal">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
              <Text size="small">Request Ingested & Verified</Text>
            </Box>
            <Text size="xsmall" color="surface.text.gray.muted">10:24 AM</Text>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <CheckCircleIcon size="small" color="interactive.icon.positive.normal" />
              <Text size="small">Catalog Matching & Stock Check</Text>
            </Box>
            <Text size="xsmall" color="surface.text.gray.muted">10:24 AM</Text>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <ClockIcon size="small" color="interactive.icon.notice.normal" />
              <Text size="small" weight="semibold">Awaiting Merchant Confirmation</Text>
            </Box>
            <Text size="xsmall" color="surface.text.gray.muted">10:25 AM</Text>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <AlertCircleIcon size="small" color="surface.icon.gray.subtle" />
              <Text size="small" color="surface.text.gray.subtle">Razorpay Instant Checkout</Text>
            </Box>
            <Text size="xsmall" color="surface.text.gray.muted">—</Text>
          </Box>
        </Box>
      </Box>

      {/* Action Footer */}
      <Box marginTop="auto" display="flex" flexDirection="column" gap="spacing.2" paddingTop="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted">
        <Button variant="primary" isFullWidth>Review & Approve Match</Button>
        <Button variant="secondary" isFullWidth>Request Specific Details</Button>
      </Box>
    </Box>
  );
}

export default function LiveSessionsPage() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box>
          <Heading size="2xlarge" marginBottom="spacing.2">Live Sessions</Heading>
          <Text color="surface.text.gray.subtle">
            Real-time AI buyer requests, negotiations, and automated order conversions.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="secondary" icon={DownloadIcon} iconPosition="left">
            Export CSV
          </Button>
          <Button variant="primary" icon={RefreshIcon} iconPosition="left">
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box display="grid" gap="spacing.4" gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)', l: 'repeat(6, 1fr)' }} marginBottom="spacing.6">
        <SummaryStatCard title="Total Sessions" value="128" trend="12% vs yesterday" isPositive={true} />
        <SummaryStatCard title="Awaiting Confirm" value="34" trend="8%" isPositive={true} />
        <SummaryStatCard title="Missing Info" value="18" trend="5%" isPositive={true} />
        <SummaryStatCard title="Payment Pending" value="22" trend="11%" isPositive={true} />
        <SummaryStatCard title="Completed Today" value="56" trend="15%" isPositive={true} />
        <SummaryStatCard title="Failed / Stopped" value="6" trend="8%" isPositive={false} />
      </Box>

      {/* Filters & Search */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          <Box display="flex" flexWrap="wrap" gap="spacing.4" alignItems="center">
            <Box width="320px">
              <TextInput 
                label="Search" 
                placeholder="Search Session ID, product or AI name..." 
              />
            </Box>
            <Dropdown>
              <SelectInput label="Status" placeholder="All Statuses" />
              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title="All Statuses" value="all" />
                  <ActionListItem title="Awaiting Confirmation" value="awaiting_confirmation" />
                  <ActionListItem title="Checkout Ready" value="checkout_ready" />
                  <ActionListItem title="Paid" value="paid" />
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <Dropdown>
              <SelectInput label="Assignment" placeholder="All Agents" />
              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title="All Agents" value="all" />
                  <ActionListItem title="Assigned to Me" value="me" />
                  <ActionListItem title="Unassigned" value="unassigned" />
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <Dropdown>
              <SelectInput label="Customer AI" placeholder="All Buyer AIs" />
              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title="All Buyer AIs" value="all" />
                  <ActionListItem title="ShopSmart AI" value="shopsmart" />
                  <ActionListItem title="BudgetBuy AI" value="budgetbuy" />
                  <ActionListItem title="GadgetGenie AI" value="gadgetgenie" />
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <Box marginTop="spacing.5">
              <Button variant="tertiary">Reset Filters</Button>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Sessions Table Card */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          {/* Table Header */}
          <Box 
            display="grid" 
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

          {/* Table Rows */}
          <Box display="flex" flexDirection="column">
            {mockSessions.map((session, index) => (
              <Box 
                key={session.id}
                paddingY="spacing.4"
                paddingX="spacing.4"
                borderBottomWidth={index !== mockSessions.length - 1 ? 'thin' : 'none'}
                borderBottomColor="surface.border.gray.muted"
                display="grid"
                gridTemplateColumns="1fr 1.2fr 2.5fr 1fr 1.3fr 1fr 1fr auto"
                gap="spacing.4"
                alignItems="center"
              >
                <Text weight="semibold" size="small" color="surface.text.primary.normal">
                  {session.id}
                </Text>

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
                  <Button 
                    variant="secondary" 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); setSelectedSession(session); }}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </CardBody>
      </Card>

      {/* Slide-out Drawer */}
      {selectedSession && (
        <SessionDetailDrawer session={selectedSession} onClose={() => setSelectedSession(null)} />
      )}
    </Box>
  );
}
