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
  AlertTriangleIcon,
  TrashIcon,
  RefreshIcon,
  CloseIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function DangerZonePage() {
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const triggerAction = (actionName: string) => {
    setActionNotice(`Action executed: ${actionName}`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <Text size="small" color="interactive.text.primary.normal">Settings</Text>
        </Link>
        <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
        <Text size="small" color="interactive.text.negative.normal">Danger Zone</Text>
      </Box>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold" color="interactive.text.negative.normal">Danger Zone</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Irreversible and high-risk administrative operations for your store.
          </Text>
        </Box>
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <Button variant="tertiary">Back to Settings</Button>
        </Link>
      </Box>

      {actionNotice && (
        <Box marginBottom="spacing.6">
          <Alert
            title="Administrative Action Executed"
            description={actionNotice}
            color="notice"
            isDismissible
            onDismiss={() => setActionNotice(null)}
          />
        </Box>
      )}

      {/* Top Red Warning Banner */}
      <Box marginBottom="spacing.6">
        <Alert
          title="Proceed With Caution"
          description="Actions in this area affect live catalog data, AI memory, and integration configurations. Most actions cannot be undone."
          color="negative"
          isDismissible={false}
        />
      </Box>

      {/* Stacked Warning Cards */}
      <Box display="flex" flexDirection="column" gap="spacing.4">

        {/* 1. Delete All Test Data */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="medium" weight="semibold">Delete All Test Data</Text>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Permanently remove all test orders, conversation logs, and generated invoices created during testing.
                </Text>
              </Box>
              <Button variant="secondary" icon={TrashIcon} iconPosition="left" onClick={() => triggerAction('Delete All Test Data')}>
                Delete All Test Data
              </Button>
            </Box>
          </CardBody>
        </Card>

        {/* 2. Reset AI Agent Data */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="medium" weight="semibold">Reset AI Agent Data</Text>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Reset the AI assistant to factory defaults, clearing fine-tuned rules and prompt memory.
                </Text>
              </Box>
              <Button variant="secondary" icon={RefreshIcon} iconPosition="left" onClick={() => triggerAction('Reset AI Agent Data')}>
                Reset AI Agent Data
              </Button>
            </Box>
          </CardBody>
        </Card>

        {/* 3. Clear Cache & Temp Files */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="medium" weight="semibold">Clear Cache & Temporary Files</Text>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Purge temporary session caches and catalog indexing files to force re-synchronization.
                </Text>
              </Box>
              <Button variant="secondary" onClick={() => triggerAction('Clear Cache')}>
                Clear Cache
              </Button>
            </Box>
          </CardBody>
        </Card>

        {/* 4. Deactivate Store */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="medium" weight="semibold">Deactivate Store</Text>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Temporarily pause store operations and disable the AI assistant from accepting new orders.
                </Text>
              </Box>
              <Button variant="secondary" icon={CloseIcon} iconPosition="left" onClick={() => triggerAction('Deactivate Store')}>
                Deactivate Store
              </Button>
            </Box>
          </CardBody>
        </Card>

        {/* 5. Delete Store Permanently */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="medium" weight="semibold" color="interactive.text.negative.normal">Delete Store Permanently</Text>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Permanently delete this merchant store, products, orders, and integration credentials. This cannot be reversed.
                </Text>
              </Box>
              <Button variant="secondary" icon={TrashIcon} iconPosition="left" onClick={() => triggerAction('Delete Store Permanently')}>
                Delete Store Permanently
              </Button>
            </Box>
          </CardBody>
        </Card>

      </Box>

    </Box>
  );
}
