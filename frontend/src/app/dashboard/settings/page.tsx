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
  FileTextIcon,
  SaveIcon,
  ChevronRightIcon,
  PackageIcon,
  SparklesIcon,
  SettingsIcon,
  ShieldIcon,
  ShoppingBagIcon,
  AlertTriangleIcon,
  ZapIcon,
  UsersIcon,
  ClockIcon,
  InfoIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

const SETTING_CARDS = [
  {
    id: 'store-profile',
    title: 'Store Profile',
    desc: 'Manage your store details, logo, support contact and description.',
    icon: PackageIcon,
    href: '/dashboard/settings/store-profile',
    color: 'primary',
  },
  {
    id: 'ai-defaults',
    title: 'AI Defaults',
    desc: 'Control how your AI assistant behaves and communicates.',
    icon: SparklesIcon,
    href: '/dashboard/settings/ai-defaults',
    color: 'primary',
  },
  {
    id: 'business-rules',
    title: 'Business Rules',
    desc: 'Set currency, tax, order rules and approval thresholds.',
    icon: SettingsIcon,
    href: '/dashboard/settings/business-rules',
    color: 'primary',
  },
  {
    id: 'dummy-shipping',
    title: 'Dummy Shipping',
    desc: 'Configure test-mode shipping and tracking stages.',
    icon: PackageIcon,
    href: '/dashboard/settings/dummy-shipping',
    color: 'primary',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    desc: 'Choose what you want to be notified about.',
    icon: ZapIcon,
    href: '/dashboard/settings/notifications',
    color: 'primary',
  },
  {
    id: 'access-profile',
    title: 'Access & Profile',
    desc: 'Manage your account, security and profile settings.',
    icon: UsersIcon,
    href: '/dashboard/settings/access-profile',
    color: 'primary',
  },
  {
    id: 'checkout-preferences',
    title: 'Checkout Preferences',
    desc: 'Control checkout behaviour and customer flow.',
    icon: ShoppingBagIcon,
    href: '/dashboard/settings/checkout-preferences',
    color: 'primary',
  },
  {
    id: 'system-status',
    title: 'System Status',
    desc: 'Check the status of important systems and integrations.',
    icon: ShieldIcon,
    href: '/dashboard/settings/system-status',
    color: 'primary',
  },
  {
    id: 'danger-zone',
    title: 'Danger Zone',
    desc: 'Perform important actions carefully.',
    icon: AlertTriangleIcon,
    href: '/dashboard/settings/danger-zone',
    color: 'negative',
  },
];

export default function SettingsHubPage() {
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveAll = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Settings</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Manage your store, AI behaviour, and business preferences.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" icon={FileTextIcon} iconPosition="left">
              View audit trail
            </Button>
          </Link>
          <Button variant="primary" icon={SaveIcon} iconPosition="left" onClick={handleSaveAll}>
            Save all changes
          </Button>
        </Box>
      </Box>

      {savedNotice && (
        <Box marginBottom="spacing.6">
          <Alert
            title="Settings Saved"
            description="All store configuration and business preferences have been updated."
            color="positive"
            isDismissible
            onDismiss={() => setSavedNotice(false)}
          />
        </Box>
      )}

      {/* 3x3 Grid of Setting Cards */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(3,1fr)' }}
        gap="spacing.6"
      >
        {SETTING_CARDS.map((card) => (
          <Link key={card.id} href={card.href} style={{ textDecoration: 'none' }}>
            <Card elevation="none" backgroundColor="surface.background.gray.intense">
              <CardBody>
                <Box display="flex" gap="spacing.4" alignItems="flex-start" padding="spacing.2">
                  <Box
                    width="44px" height="44px" borderRadius="medium"
                    backgroundColor={card.color === 'negative' ? 'surface.background.gray.subtle' : 'surface.background.primary.subtle'}
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <card.icon
                      size="medium"
                      color={card.color === 'negative' ? 'interactive.icon.negative.normal' : 'interactive.icon.primary.normal'}
                    />
                  </Box>

                  <Box flex={1} display="flex" flexDirection="column" gap="spacing.1">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Text size="medium" weight="semibold">{card.title}</Text>
                      <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.subtle">
                      {card.desc}
                    </Text>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Link>
        ))}
      </Box>

    </Box>
  );
}
