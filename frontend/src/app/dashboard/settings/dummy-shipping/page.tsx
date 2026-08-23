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
  SelectInput,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  Checkbox,
  Alert,
  // Icons
  ChevronRightIcon,
  SaveIcon,
  PackageIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function DummyShippingPage() {
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [shippingTime, setShippingTime] = useState('2-3 Business Days');
  const [cutoffTime, setCutoffTime] = useState('04:00 PM');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <Text size="small" color="interactive.text.primary.normal">Settings</Text>
        </Link>
        <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
        <Text size="small" color="surface.text.gray.subtle">Dummy Shipping</Text>
      </Box>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Dummy Shipping</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Configure test-mode shipping and tracking stages for Buildathon demonstration.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
            <Button variant="tertiary">Cancel</Button>
          </Link>
          <Button variant="primary" icon={SaveIcon} iconPosition="left" onClick={handleSave}>
            Save changes
          </Button>
        </Box>
      </Box>

      {savedNotice && (
        <Box marginBottom="spacing.6">
          <Alert
            title="Dummy Shipping Settings Saved"
            description="Your tracking timeline and shipment simulation parameters have been updated."
            color="positive"
            isDismissible
            onDismiss={() => setSavedNotice(false)}
          />
        </Box>
      )}

      {/* Main Grid: Left Menu (1fr), Right Panel (3fr) */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '240px 1fr' }} gap="spacing.6">

        {/* Left Navigation */}
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.1">
                {[
                  { label: 'Shipping Settings', active: true },
                  { label: 'Tracking Stages', active: false },
                  { label: 'Tracking Preview', active: false },
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

        {/* Main Settings Panel */}
        <Box display="flex" flexDirection="column" gap="spacing.5">

          {/* 1. Shipping Settings */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">1. Shipping Settings</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Control overall dummy shipping simulation behavior.</Text>

                <Box display="flex" justifyContent="space-between" alignItems="center" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" flexDirection="column">
                    <Text size="small" weight="semibold">Enable Dummy Shipping Simulation</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">Simulate tracking events for orders created by AI.</Text>
                  </Box>
                  <Checkbox isChecked={shippingEnabled} onChange={({ isChecked }) => setShippingEnabled(isChecked)}>Active</Checkbox>
                </Box>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <TextInput
                    label="Default Shipping Time"
                    value={shippingTime}
                    onChange={({ value }) => setShippingTime(value || '')}
                  />

                  <Dropdown>
                    <SelectInput label="Business Days" placeholder="Monday - Saturday" />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Monday - Saturday" value="mon_sat" onClick={() => {}} />
                        <ActionListItem title="Monday - Friday" value="mon_fri" onClick={() => {}} />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>

                  <TextInput
                    label="Cut-off Time"
                    value={cutoffTime}
                    onChange={({ value }) => setCutoffTime(value || '')}
                  />
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 2. Tracking Stages */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">2. Tracking Stages</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">The 5 stages simulated for customer order tracking.</Text>

                <Box display="flex" flexDirection="column" gap="spacing.3" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  {[
                    { stage: '1. Preparing', desc: 'Item allocated & quality checked at fulfillment hub' },
                    { stage: '2. Packed', desc: 'Securely packaged with Razorpay AI tamper proof seal' },
                    { stage: '3. Shipped', desc: 'Handed over to Express Logistics partner' },
                    { stage: '4. Out for Delivery', desc: 'Courier agent assigned for final mile delivery' },
                    { stage: '5. Delivered', desc: 'Package delivered to customer address' },
                  ].map((s, idx) => (
                    <Box key={idx} padding="spacing.3" borderRadius="small" backgroundColor="surface.background.gray.subtle" display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="spacing.3">
                        <PackageIcon size="small" color="interactive.icon.primary.normal" />
                        <Box display="flex" flexDirection="column">
                          <Text size="small" weight="semibold">{s.stage}</Text>
                          <Text size="xsmall" color="surface.text.gray.muted">{s.desc}</Text>
                        </Box>
                      </Box>
                      <Badge color="positive" size="small">Active Stage</Badge>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 3. Tracking Preview */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">3. Tracking Preview</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">How the live shipment tracker appears to buyers.</Text>

                <Box padding="spacing.4" borderRadius="medium" backgroundColor="surface.background.gray.subtle" borderLeftWidth="thick" borderLeftColor="surface.border.primary.normal" display="flex" flexDirection="column" gap="spacing.3">
                  <Box display="flex" justifyContent="space-between">
                    <Text size="small" weight="semibold">Order ORD-10231 (Asus TUF F15)</Text>
                    <Text size="xsmall" color="interactive.text.positive.normal">Est. Delivery: Tomorrow</Text>
                  </Box>
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Box width="10px" height="10px" borderRadius="round" backgroundColor="surface.background.sea.intense" />
                    <Text size="xsmall" weight="semibold">Stage 3: Shipped via BlueDart Express</Text>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

        </Box>

      </Box>

    </Box>
  );
}
