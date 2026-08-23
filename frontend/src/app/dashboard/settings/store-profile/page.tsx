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
  Alert,
  // Icons
  ChevronRightIcon,
  UploadIcon,
  InfoIcon,
  SaveIcon,
  PackageIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function StoreProfilePage() {
  const [storeName, setStoreName] = useState('Acme Electronics');
  const [businessName, setBusinessName] = useState('Acme Electronics Pvt. Ltd.');
  const [supportEmail, setSupportEmail] = useState('support@acmeelectronics.com');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [storeDesc, setStoreDesc] = useState('Your trusted store for premium laptops, accessories and smart electronics.');
  const [supportAddress, setSupportAddress] = useState('Bangalore, Karnataka, India');

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
        <Text size="small" color="surface.text.gray.subtle">Store Profile</Text>
      </Box>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Store Profile</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Update your store information that will be visible to customers and AI assistants.
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
            title="Store Profile Saved"
            description="Your store profile details have been updated."
            color="positive"
            isDismissible
            onDismiss={() => setSavedNotice(false)}
          />
        </Box>
      )}

      {/* Main Grid: Form Left (2fr), Preview Right (1fr) */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '2.2fr 1fr' }} gap="spacing.6" marginBottom="spacing.6">

        {/* Left Form Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.6">
              
              <Text size="medium" weight="semibold">Store Information</Text>

              <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.4">
                <TextInput
                  label="Store Name *"
                  value={storeName}
                  onChange={({ value }) => setStoreName(value || '')}
                />
                <TextInput
                  label="Business Name *"
                  value={businessName}
                  onChange={({ value }) => setBusinessName(value || '')}
                />
              </Box>

              <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.4">
                <TextInput
                  label="Support Email *"
                  value={supportEmail}
                  onChange={({ value }) => setSupportEmail(value || '')}
                />
                <TextInput
                  label="Support Phone *"
                  value={supportPhone}
                  onChange={({ value }) => setSupportPhone(value || '')}
                />
              </Box>

              {/* Store Logo */}
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text size="small" weight="semibold">Store Logo</Text>
                <Box display="flex" alignItems="center" gap="spacing.4">
                  <Box
                    width="72px" height="72px" borderRadius="medium"
                    backgroundColor="surface.background.primary.subtle"
                    borderWidth="thin" borderColor="surface.border.gray.muted"
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Heading size="xlarge" color="interactive.text.primary.normal">A</Heading>
                  </Box>

                  <Box display="flex" flexDirection="column" gap="spacing.1">
                    <Button variant="secondary" size="small" icon={UploadIcon} iconPosition="left">
                      Upload logo
                    </Button>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      PNG, JPG or JPEG. Max size 2MB
                    </Text>
                  </Box>
                </Box>
              </Box>

              {/* Store Description */}
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text size="small" weight="semibold">Store Description</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">{storeDesc.length}/200</Text>
                </Box>
                <TextInput
                  label=""
                  accessibilityLabel="Store description"
                  value={storeDesc}
                  onChange={({ value }) => setStoreDesc(value || '')}
                />
              </Box>

              {/* Support Address */}
              <TextInput
                label="Support Address (Optional)"
                value={supportAddress}
                onChange={({ value }) => setSupportAddress(value || '')}
              />

            </Box>
          </CardBody>
        </Card>

        {/* Right Store Preview Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <Text size="medium" weight="semibold">Store Preview</Text>
              <Text size="xsmall" color="surface.text.gray.subtle">
                This is how your store appears to customers and AI assistants.
              </Text>

              {/* Inner Preview Box */}
              <Box
                padding="spacing.5"
                borderRadius="medium"
                backgroundColor="surface.background.gray.subtle"
                borderWidth="thin"
                borderColor="surface.border.gray.muted"
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                gap="spacing.3"
              >
                <Box
                  width="60px" height="60px" borderRadius="round"
                  backgroundColor="surface.background.primary.subtle"
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Heading size="large" color="interactive.text.primary.normal">A</Heading>
                </Box>

                <Heading size="medium" weight="semibold">{storeName}</Heading>
                <Text size="xsmall" color="surface.text.gray.subtle">{businessName}</Text>

                <Box maxWidth="240px">
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {storeDesc}
                  </Text>
                </Box>

                <Box width="100%" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3" display="flex" flexDirection="column" gap="spacing.2" textAlign="left">
                  <Text size="xsmall" color="surface.text.gray.muted">✉ {supportEmail}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">📞 {supportPhone}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">📍 {supportAddress}</Text>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>

      </Box>

      {/* Bottom Info Banner */}
      <Alert
        color="information"
        title="AI Visibility Notice"
        description="These details will be visible to customers in AI conversations, invoices, and notifications."
      />

    </Box>
  );
}
