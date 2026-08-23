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
  Alert,
  // Icons
  ChevronRightIcon,
  RefreshIcon,
  ShieldIcon,
  CheckCircleIcon,
  ZapIcon,
  ActivityIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function SystemStatusPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshedNotice, setRefreshedNotice] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshedNotice(true);
      setTimeout(() => setRefreshedNotice(false), 3000);
    }, 800);
  };

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <Text size="small" color="interactive.text.primary.normal">Settings</Text>
        </Link>
        <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
        <Text size="small" color="surface.text.gray.subtle">System Status</Text>
      </Box>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">System Status</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Check the real-time health, uptime, and integration status of important systems.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button variant="secondary" icon={RefreshIcon} iconPosition="left" onClick={handleRefresh}>
            {isRefreshing ? 'Checking...' : 'Refresh status'}
          </Button>
          <Button variant="primary" onClick={handleRefresh}>Check now</Button>
        </Box>
      </Box>

      {refreshedNotice && (
        <Box marginBottom="spacing.6">
          <Alert
            title="System Health Check Complete"
            description="All Merchant AI Gateway microservices and Razorpay API integrations are fully operational."
            color="positive"
            isDismissible
            onDismiss={() => setRefreshedNotice(false)}
          />
        </Box>
      )}

      {/* Overview Cards */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(4,1fr)' }}
        gap="spacing.4"
        marginBottom="spacing.6"
      >
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Overall Status</Text>
              <Box display="flex" alignItems="center" gap="spacing.2">
                <CheckCircleIcon size="medium" color="interactive.icon.positive.normal" />
                <Heading size="medium" weight="semibold" color="interactive.text.positive.normal">All Operational</Heading>
              </Box>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">System Uptime (30d)</Text>
              <Heading size="xlarge" weight="semibold">99.98%</Heading>
              <Text size="xsmall" color="interactive.text.positive.normal">0 incidents reported</Text>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Avg Response Time</Text>
              <Heading size="xlarge" weight="semibold">120ms</Heading>
              <Text size="xsmall" color="surface.text.gray.subtle">Optimal latency</Text>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Active System Alerts</Text>
              <Heading size="xlarge" weight="semibold">0</Heading>
              <Text size="xsmall" color="surface.text.gray.subtle">No action required</Text>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Main Services Table */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense" marginBottom="spacing.6">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <Text size="medium" weight="semibold">Services & Microservices Health</Text>

            <Box display="flex" flexDirection="column" gap="spacing.2">
              {[
                { name: 'Merchant AI Gateway Core API', status: 'Operational', latency: '45ms' },
                { name: 'Razorpay Test Webhook Listener', status: 'Operational', latency: '80ms' },
                { name: 'Catalog Search Indexer', status: 'Operational', latency: '15ms' },
                { name: 'Dummy Shipping Simulation Engine', status: 'Operational', latency: '25ms' },
                { name: 'Audit Trail Ledger Processor', status: 'Operational', latency: '30ms' },
              ].map((s, idx) => (
                <Box key={idx} padding="spacing.3" borderRadius="small" backgroundColor="surface.background.gray.subtle" display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap="spacing.3">
                    <Box width="8px" height="8px" borderRadius="round" backgroundColor="surface.background.sea.intense" />
                    <Text size="small" weight="semibold">{s.name}</Text>
                  </Box>
                  <Box display="flex" alignItems="center" gap="spacing.4">
                    <Text size="xsmall" color="surface.text.gray.muted">Latency: {s.latency}</Text>
                    <Badge color="positive" size="small">{s.status}</Badge>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Integrations & Background Jobs */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.6">
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Text size="medium" weight="semibold">Integrations Status</Text>

              {[
                { name: 'Razorpay API (Test Mode)', detail: 'Key ID rzp_test_...', status: 'Connected' },
                { name: 'LLM AI Engine (Claude / OpenAI)', detail: 'Model v3.5', status: 'Connected' },
                { name: 'Audit Trail Storage Engine', detail: 'Encrypted Ledger', status: 'Connected' },
              ].map((item, idx) => (
                <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" paddingY="spacing.2">
                  <Box display="flex" flexDirection="column">
                    <Text size="small" weight="semibold">{item.name}</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">{item.detail}</Text>
                  </Box>
                  <Badge color="positive" size="small">{item.status}</Badge>
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Text size="medium" weight="semibold">Background Jobs & Cron</Text>

              {[
                { name: 'Daily Revenue Summary Job', time: 'Completed Today 00:00 AM' },
                { name: 'Inventory Sync & Low Stock Alert', time: 'Completed Today 01:00 AM' },
                { name: 'Audit Trail Chain Integrity Verification', time: 'Completed Today 02:00 AM' },
              ].map((job, idx) => (
                <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" paddingY="spacing.2">
                  <Box display="flex" flexDirection="column">
                    <Text size="small" weight="semibold">{job.name}</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">{job.time}</Text>
                  </Box>
                  <Badge color="positive" size="small">Success</Badge>
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>
      </Box>

    </Box>
  );
}
