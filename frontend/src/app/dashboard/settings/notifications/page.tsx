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
  TextInput,
  Checkbox,
  Alert,
  // Icons
  ChevronRightIcon,
  SaveIcon,
  ZapIcon,
  ClockIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';
import { useMerchantSettings } from '../use-merchant-settings';

const DEFAULT_EVENTS = [
  { name: 'New AI conversation', email: true, sms: false, inApp: true },
  { name: 'Order created', email: true, sms: true, inApp: true },
  { name: 'Payment failed', email: true, sms: true, inApp: true },
  { name: 'Product low stock', email: true, sms: false, inApp: true },
  { name: 'Order completed', email: true, sms: false, inApp: true },
  { name: 'Human support requested', email: true, sms: true, inApp: true },
  { name: 'Daily summary report', email: true, sms: false, inApp: false },
];

export default function NotificationsPage() {
  const { settings, merchant, loading, saving, error, savedNotice, saveSettings } = useMerchantSettings();

  const [savedLocal, setSavedLocal] = useState(false);

  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [quietHours, setQuietHours] = useState(true);

  const didInit = React.useRef(false);
  React.useEffect(() => {
    if (didInit.current || !merchant) return;
    didInit.current = true;
    if (Array.isArray(settings.notification_events) && settings.notification_events.length) {
      setEvents(settings.notification_events);
    }
    setQuietHours(settings.quiet_hours ?? true);
  }, [merchant, settings]);

  const toggleEventChannel = (idx: number, channel: 'email' | 'sms' | 'inApp') => {
    const updated = [...events];
    updated[idx][channel] = !updated[idx][channel];
    setEvents(updated);
  };

  const handleSave = async () => {
    await saveSettings({ notification_events: events, quiet_hours: quietHours });
    setSavedLocal(true);
    setTimeout(() => setSavedLocal(false), 3000);
  };

  if (loading) {
    return (
      <Box padding="spacing.8" display="flex" justifyContent="center">
        <Text size="small" color="surface.text.gray.subtle">Loading…</Text>
      </Box>
    );
  }

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <Text size="small" color="interactive.text.primary.normal">Settings</Text>
        </Link>
        <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
        <Text size="small" color="surface.text.gray.subtle">Notifications</Text>
      </Box>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Notifications</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Choose what events you want to be notified about and select delivery channels.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
            <Button variant="tertiary">Cancel</Button>
          </Link>
          <Button variant="primary" icon={SaveIcon} iconPosition="left" onClick={handleSave} isLoading={saving}>
            Save changes
          </Button>
        </Box>
      </Box>

      {(savedNotice || savedLocal) && (
        <Box marginBottom="spacing.6">
          <Alert
            title="Notification Preferences Saved"
            description="Your notification matrix and alert delivery settings have been updated."
            color="positive"
            isDismissible
            onDismiss={() => setSavedLocal(false)}
          />
        </Box>
      )}

      {error && (
        <Box marginBottom="spacing.6">
          <Alert title="Error" description={error} color="negative" isDismissible />
        </Box>
      )}

      {/* Main Grid: Left Menu (1fr), Right Panel (3fr) */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '240px 1fr' }} gap="spacing.6">

        {/* Left Menu */}
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.1">
                {[
                  { label: 'Notification Preferences', active: true },
                  { label: 'Delivery Channels', active: false },
                  { label: 'Quiet Hours', active: false },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    padding="spacing.3"
                    borderRadius="small"
                    backgroundColor={item.active ? 'surface.background.primary.subtle' : 'transparent'}
                  >
                    <Text size="small" weight={item.active ? 'semibold' : 'regular'} color={item.active ? 'interactive.text.primary.normal' : 'surface.text.gray.normal'}>
                      ● {item.label}
                    </Text>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Main Panel */}
        <Box display="flex" flexDirection="column" gap="spacing.5">

          {/* 1. Notification Event Table */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">1. Notification Matrix</Text>

                {/* Table Header */}
                <Box display="grid" gridTemplateColumns="2fr 1fr 1fr 1fr" gap="spacing.4" paddingY="spacing.2" borderBottomWidth="thin" borderBottomColor="surface.border.gray.muted">
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Event Type</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" textAlign="center">Email</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" textAlign="center">SMS</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" textAlign="center">In-App</Text>
                </Box>

                {/* Table Rows */}
                {events.map((ev, idx) => (
                  <Box key={idx} display="grid" gridTemplateColumns="2fr 1fr 1fr 1fr" gap="spacing.4" paddingY="spacing.2" alignItems="center" borderBottomWidth={idx !== events.length - 1 ? 'thin' : 'none'} borderBottomColor="surface.border.gray.muted">
                    <Text size="small" weight="semibold">{ev.name}</Text>
                    <Box display="flex" justifyContent="center">
                      <Checkbox isChecked={ev.email} onChange={() => toggleEventChannel(idx, 'email')} />
                    </Box>
                    <Box display="flex" justifyContent="center">
                      <Checkbox isChecked={ev.sms} onChange={() => toggleEventChannel(idx, 'sms')} />
                    </Box>
                    <Box display="flex" justifyContent="center">
                      <Checkbox isChecked={ev.inApp} onChange={() => toggleEventChannel(idx, 'inApp')} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>

          {/* 2. Delivery Channels */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">2. Delivery Channels</Text>
                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.4">
                  <Box padding="spacing.4" borderRadius="small" backgroundColor="surface.background.gray.subtle" display="flex" flexDirection="column" gap="spacing.1">
                    <Text size="small" weight="semibold">Email Channel</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">support@acmeelectronics.com</Text>
                    <Badge color="positive" size="small">Verified</Badge>
                  </Box>
                  <Box padding="spacing.4" borderRadius="small" backgroundColor="surface.background.gray.subtle" display="flex" flexDirection="column" gap="spacing.1">
                    <Text size="small" weight="semibold">SMS Channel</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">+91 98765 43210</Text>
                    <Badge color="positive" size="small">Active</Badge>
                  </Box>
                  <Box padding="spacing.4" borderRadius="small" backgroundColor="surface.background.gray.subtle" display="flex" flexDirection="column" gap="spacing.1">
                    <Text size="small" weight="semibold">In-App Alerts</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">Merchant Dashboard Bell</Text>
                    <Badge color="positive" size="small">Enabled</Badge>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 3. Quiet Hours */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">3. Quiet Hours</Text>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" flexDirection="column">
                    <Text size="small" weight="semibold">Enable Quiet Hours</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">Pause non-critical alerts between 10:00 PM and 08:00 AM.</Text>
                  </Box>
                  <Checkbox isChecked={quietHours} onChange={({ isChecked }) => setQuietHours(isChecked)}>Active</Checkbox>
                </Box>
              </Box>
            </CardBody>
          </Card>

        </Box>

      </Box>

    </Box>
  );
}
