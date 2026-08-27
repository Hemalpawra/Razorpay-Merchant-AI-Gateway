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
  UsersIcon,
  ShieldIcon,
  PlusIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';
import { useMerchantSettings } from '../use-merchant-settings';

export default function AccessProfilePage() {
  const { settings, merchant, loading, saving, error, savedNotice, saveSettings } = useMerchantSettings();

  const [name, setName] = useState('Hemal');
  const [email, setEmail] = useState('hemal@gmail.com');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [twoFactor, setTwoFactor] = useState(true);
  const [defaultDashboardView, setDefaultDashboardView] = useState('overview');

  const [savedLocal, setSavedLocal] = useState(false);

  const didInit = React.useRef(false);
  React.useEffect(() => {
    if (didInit.current || !merchant) return;
    didInit.current = true;
    setName(settings.profile_name || 'Hemal');
    setEmail(settings.profile_email || 'hemal@gmail.com');
    setMobile(settings.profile_mobile || '+91 98765 43210');
    setTwoFactor(settings.two_factor ?? true);
    setDefaultDashboardView(settings.default_dashboard_view || 'overview');
  }, [merchant, settings]);

  const handleSave = async () => {
    await saveSettings({
      profile_name: name,
      profile_email: email,
      profile_mobile: mobile,
      two_factor: twoFactor,
      default_dashboard_view: defaultDashboardView,
    });
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
        <Text size="small" color="surface.text.gray.subtle">Access & Profile</Text>
      </Box>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Access & Profile</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Manage your personal account, team members, roles, and security credentials.
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
            title="Profile & Access Settings Saved"
            description="Your personal information and security credentials have been updated."
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
                  { label: 'Profile Details', active: true },
                  { label: 'Team Members', active: false },
                  { label: 'Roles & Permissions', active: false },
                  { label: 'Login & Security', active: false },
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

          {/* 1. Profile Details */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">1. Profile Details</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.4">
                  <TextInput
                    label="Your Name"
                    value={name}
                    onChange={({ value }) => setName(value || '')}
                  />
                  <TextInput
                    label="Email Address"
                    value={email}
                    onChange={({ value }) => setEmail(value || '')}
                  />
                  <TextInput
                    label="Mobile Number"
                    value={mobile}
                    onChange={({ value }) => setMobile(value || '')}
                  />
                  <Dropdown selectionType="single">
                    <SelectInput label="Default Dashboard View" placeholder="Overview" value={defaultDashboardView} onChange={({ values }) => setDefaultDashboardView(values[0])} />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Overview" value="overview" />
                        <ActionListItem title="AI Agent Workspace" value="ai_agent" />
                        <ActionListItem title="Orders" value="orders" />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 2. Team Members */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text size="medium" weight="semibold">2. Team Members</Text>
                  <Button variant="secondary" size="small" icon={PlusIcon} iconPosition="left">
                    Invite member
                  </Button>
                </Box>

                <Box display="flex" flexDirection="column" gap="spacing.2">
                  {[
                    { name: 'Hemal', email: 'hemal@gmail.com', role: 'Owner', status: 'Active' },
                    { name: 'Ananya Verma', email: 'ananya@acmeelectronics.com', role: 'Admin', status: 'Active' },
                    { name: 'Rahul Kumar', email: 'rahul@acmeelectronics.com', role: 'Developer', status: 'Active' },
                  ].map((m, idx) => (
                    <Box key={idx} padding="spacing.3" borderRadius="small" backgroundColor="surface.background.gray.subtle" display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap="spacing.3">
                        <Box width="32px" height="32px" borderRadius="round" backgroundColor="surface.background.primary.subtle" display="flex" alignItems="center" justifyContent="center">
                          <Text size="small" weight="semibold">{m.name[0]}</Text>
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Text size="small" weight="semibold">{m.name}</Text>
                          <Text size="xsmall" color="surface.text.gray.muted">{m.email}</Text>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap="spacing.3">
                        <Badge color="information" size="small">{m.role}</Badge>
                        <Badge color="positive" size="small">{m.status}</Badge>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 3. Login & Security */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">3. Login & Security</Text>

                <Box display="flex" justifyContent="space-between" alignItems="center" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" flexDirection="column">
                    <Text size="small" weight="semibold">Two-Factor Authentication (2FA)</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">Require authenticator code on login.</Text>
                  </Box>
                  <Checkbox isChecked={twoFactor} onChange={({ isChecked }) => setTwoFactor(isChecked)}>Enabled</Checkbox>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" flexDirection="column">
                    <Text size="small" weight="semibold">Password</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">Last changed 30 days ago.</Text>
                  </Box>
                  <Button variant="secondary" size="small">Change password</Button>
                </Box>
              </Box>
            </CardBody>
          </Card>

        </Box>

      </Box>

    </Box>
  );
}
