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
  ShoppingBagIcon,
  ShieldIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function CheckoutPreferencesPage() {
  const [checkoutMode, setCheckoutMode] = useState<'one' | 'multi'>('one');
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [autoCoupons, setAutoCoupons] = useState(true);

  const [reqName, setReqName] = useState(true);
  const [reqEmail, setReqEmail] = useState(true);
  const [reqPhone, setReqPhone] = useState(true);
  const [reqAddress, setReqAddress] = useState(true);

  const [payCards, setPayCards] = useState(true);
  const [payUPI, setPayUPI] = useState(true);
  const [payNetbanking, setPayNetbanking] = useState(true);
  const [payWallets, setPayWallets] = useState(true);
  const [payBNPL, setPayBNPL] = useState(true);

  const [showThumbnails, setShowThumbnails] = useState(true);
  const [editableCart, setEditableCart] = useState(true);
  const [showDelivery, setShowDelivery] = useState(true);
  const [showTrustBadges, setShowTrustBadges] = useState(true);

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
        <Text size="small" color="surface.text.gray.subtle">Checkout Preferences</Text>
      </Box>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Checkout Preferences</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Customize your checkout experience and payment flow.
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
            title="Checkout Preferences Saved"
            description="Your customer checkout flow and Razorpay payment options have been updated."
            color="positive"
            isDismissible
            onDismiss={() => setSavedNotice(false)}
          />
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
                  { label: 'General Settings', active: true },
                  { label: 'Customer Information', active: false },
                  { label: 'Payment Options', active: false },
                  { label: 'Order Review', active: false },
                  { label: 'Trust & Compliance', active: false },
                  { label: 'Advanced Settings', active: false },
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

          {/* 1. General Settings */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">1. General Settings</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.4">
                  <Box
                    padding="spacing.4" borderRadius="small"
                    backgroundColor={checkoutMode === 'one' ? 'surface.background.primary.subtle' : 'surface.background.gray.subtle'}
                    borderWidth="thin" borderColor={checkoutMode === 'one' ? 'surface.border.primary.normal' : 'surface.border.gray.muted'}
                  >
                    <Text size="small" weight="semibold">One step checkout</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">All details on a single step.</Text>
                  </Box>

                  <Box
                    padding="spacing.4" borderRadius="small"
                    backgroundColor={checkoutMode === 'multi' ? 'surface.background.primary.subtle' : 'surface.background.gray.subtle'}
                    borderWidth="thin" borderColor={checkoutMode === 'multi' ? 'surface.border.primary.normal' : 'surface.border.gray.muted'}
                  >
                    <Text size="small" weight="semibold">Multi step checkout</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">Breakdown into multiple steps.</Text>
                  </Box>

                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Text size="small" weight="semibold">Guest checkout</Text>
                      <Checkbox isChecked={guestCheckout} onChange={({ isChecked }) => setGuestCheckout(isChecked)} />
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.muted">Allow orders without sign up.</Text>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 2. Customer Information */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">2. Customer Information</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Text size="small" weight="semibold">Required information</Text>
                    <Checkbox isChecked={reqName} onChange={({ isChecked }) => setReqName(isChecked)}>Full name</Checkbox>
                    <Checkbox isChecked={reqEmail} onChange={({ isChecked }) => setReqEmail(isChecked)}>Email address</Checkbox>
                    <Checkbox isChecked={reqPhone} onChange={({ isChecked }) => setReqPhone(isChecked)}>Phone number</Checkbox>
                    <Checkbox isChecked={reqAddress} onChange={({ isChecked }) => setReqAddress(isChecked)}>Shipping address</Checkbox>
                  </Box>

                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Dropdown>
                      <SelectInput label="Address options" placeholder="Show saved addresses" />
                      <DropdownOverlay>
                        <ActionList>
                          <ActionListItem title="Show saved addresses" value="saved" onClick={() => {}} />
                          <ActionListItem title="Allow new address entry" value="new" onClick={() => {}} />
                        </ActionList>
                      </DropdownOverlay>
                    </Dropdown>

                    <Checkbox isChecked={true} onChange={() => {}}>Phone number validation</Checkbox>
                    <Checkbox isChecked={true} onChange={() => {}}>Email validation</Checkbox>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 3. Payment Options */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">3. Payment Options (Razorpay)</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Text size="small" weight="semibold">Accepted Payment Methods</Text>
                    <Checkbox isChecked={payCards} onChange={({ isChecked }) => setPayCards(isChecked)}>Cards (Credit / Debit)</Checkbox>
                    <Checkbox isChecked={payUPI} onChange={({ isChecked }) => setPayUPI(isChecked)}>UPI</Checkbox>
                    <Checkbox isChecked={payNetbanking} onChange={({ isChecked }) => setPayNetbanking} >Net Banking</Checkbox>
                    <Checkbox isChecked={payWallets} onChange={({ isChecked }) => setPayWallets(isChecked)}>Wallets</Checkbox>
                    <Checkbox isChecked={payBNPL} onChange={({ isChecked }) => setPayBNPL(isChecked)}>Buy Now, Pay Later</Checkbox>
                  </Box>

                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Dropdown>
                      <SelectInput label="Default payment method" placeholder="UPI" />
                      <DropdownOverlay>
                        <ActionList>
                          <ActionListItem title="UPI" value="upi" onClick={() => {}} />
                          <ActionListItem title="Cards" value="cards" onClick={() => {}} />
                        </ActionList>
                      </DropdownOverlay>
                    </Dropdown>
                  </Box>

                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Text size="small" weight="semibold">Save card / UPI details</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">PCI compliance is managed automatically via Razorpay SDK.</Text>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 4. Order Review & Trust */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">4. Order Review & Trust</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Checkbox isChecked={showThumbnails} onChange={({ isChecked }) => setShowThumbnails(isChecked)}>Show product thumbnails</Checkbox>
                  <Checkbox isChecked={editableCart} onChange={({ isChecked }) => setEditableCart(isChecked)}>Editable cart at checkout</Checkbox>
                  <Checkbox isChecked={showTrustBadges} onChange={({ isChecked }) => setShowTrustBadges(isChecked)}>Show Razorpay trust badges</Checkbox>
                </Box>
              </Box>
            </CardBody>
          </Card>

        </Box>

      </Box>

    </Box>
  );
}
