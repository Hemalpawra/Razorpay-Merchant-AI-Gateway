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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  // Icons
  ChevronRightIcon,
  AlertTriangleIcon,
  TrashIcon,
  RefreshIcon,
  CloseIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

const DANGER_ACTIONS = [
  {
    key: 'Delete All Test Data',
    desc: 'Permanently remove all test orders, conversation logs, and generated invoices created during testing.',
    icon: TrashIcon,
  },
  {
    key: 'Reset AI Agent Data',
    desc: 'Reset the AI assistant to factory defaults, clearing fine-tuned rules and prompt memory.',
    icon: RefreshIcon,
  },
  {
    key: 'Clear Cache',
    desc: 'Purge temporary session caches and catalog indexing files to force re-synchronization.',
    icon: RefreshIcon,
  },
  {
    key: 'Deactivate Store',
    desc: 'Temporarily pause store operations and disable the AI assistant from accepting new orders.',
    icon: CloseIcon,
  },
  {
    key: 'Delete Store Permanently',
    desc: 'Permanently delete this merchant store, products, orders, and integration credentials. This cannot be reversed.',
    icon: TrashIcon,
  },
];

export default function DangerZonePage() {
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const confirm = () => {
    if (confirmText !== pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);
    setConfirmText('');
    setNotice(action);
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

      {notice && (
        <Box marginBottom="spacing.6">
          <Alert
            title="Action not executed (Demo mode)"
            description={`No backend handler is wired for "${notice}", so nothing was changed. Implement an API route to perform this action for real.`}
            color="notice"
            isDismissible
            onDismiss={() => setNotice(null)}
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
        {DANGER_ACTIONS.map((action) => (
          <Card key={action.key} elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" flexDirection="column" gap="spacing.1">
                  <Text size="medium" weight="semibold">{action.key}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">{action.desc}</Text>
                </Box>
                <Button
                  variant="secondary"
                  color="negative"
                  icon={action.icon}
                  iconPosition="left"
                  onClick={() => {
                    setNotice(null);
                    setConfirmText('');
                    setPendingAction(action.key);
                  }}
                >
                  {action.key}
                </Button>
              </Box>
            </CardBody>
          </Card>
        ))}
      </Box>

      <Modal
        isOpen={!!pendingAction}
        onDismiss={() => setPendingAction(null)}
        accessibilityLabel="Confirm dangerous action"
      >
        <ModalHeader
          title={`Confirm: ${pendingAction ?? ''}`}
          subtitle="This is a high-risk, potentially irreversible action."
        />
        <ModalBody>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <Text size="small" color="surface.text.gray.normal">
              Type <Text weight="semibold">{pendingAction}</Text> below to enable the confirm button.
            </Text>
            <TextInput
              label="Confirmation"
              placeholder={pendingAction ?? ''}
              value={confirmText}
              onChange={({ value }) => setConfirmText(value || '')}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="tertiary" onClick={() => setPendingAction(null)}>Cancel</Button>
          <Button
            variant="secondary"
            color="negative"
            isDisabled={confirmText !== pendingAction}
            onClick={confirm}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>

    </Box>
  );
}
