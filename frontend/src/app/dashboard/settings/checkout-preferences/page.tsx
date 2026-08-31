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
import { useMerchantSettings } from '../use-merchant-settings';

export default function CheckoutPreferencesPage() {
  const { settings, merchant, loading, saving, error, savedNotice, saveSettings } = useMerchantSettings();

  const [checkoutMode, setCheckoutMode] = useState<'one' | 'multi'>(settings.checkout_mode === 'one' || settings.checkout_mode === 'multi' ? settings.checkout_mode : 'one');
  const [guestCheckout, setGuestCheckout] = useState(settings.guest_checkout ?? true);
  const [autoCoupons, setAutoCoupons] = useState(settings.auto_coupons ?? true);

  const [reqName, setReqName] = useState(settings.req_name ?? true);
  const [reqEmail, setReqEmail] = useState(settings.req_email ?? true);
  const [reqPhone, setReqPhone] = useState(settings.req_phone ?? true);
  const [reqAddress, setReqAddress] = useState(settings.req_address ?? true);

  const [payCards, setPayCards] = useState(settings.pay_cards ?? true);
  const [payUPI, setPayUPI] = useState(settings.pay_upi ?? true);
  const [payNetbanking, setPayNetbanking] = useState(settings.pay_netbanking ?? true);
  const [payWallets, setPayWallets] = useState(settings.pay_wallets ?? true);
  const [payBNPL, setPayBNPL] = useState(settings.pay_bnpl ?? true);

  const [showThumbnails, setShowThumbnails] = useState(settings.show_thumbnails ?? true);
  const [editableCart, setEditableCart] = useState(settings.editable_cart ?? true);
  const [showTrustBadges, setShowTrustBadges] = useState(settings.show_trust_badges ?? true);

  const [addressOptions, setAddressOptions] = useState(settings.address_options || 'saved');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(settings.default_payment_method || 'upi');
  const [phoneValidation, setPhoneValidation] = useState(settings.phone_validation ?? true);
  const [emailValidation, setEmailValidation] = useState(settings.email_validation ?? true);

  const [localSaved, setLocalSaved] = useState(false);

  const didInit = React.useRef(false);
  React.useEffect(() => {
    if (didInit.current || !merchant) return;
    didInit.current = true;
    setCheckoutMode(settings.checkout_mode === 'one' || settings.checkout_mode === 'multi' ? settings.checkout_mode : 'one');
    setGuestCheckout(settings.guest_checkout ?? true);
    setAutoCoupons(settings.auto_coupons ?? true);
    setReqName(settings.req_name ?? true);
    setReqEmail(settings.req_email ?? true);
    setReqPhone(settings.req_phone ?? true);
    setReqAddress(settings.req_address ?? true);
    setPayCards(settings.pay_cards ?? true);
    setPayUPI(settings.pay_upi ?? true);
    setPayNetbanking(settings.pay_netbanking ?? true);
    setPayWallets(settings.pay_wallets ?? true);
    setPayBNPL(settings.pay_bnpl ?? true);
    setShowThumbnails(settings.show_thumbnails ?? true);
    setEditableCart(settings.editable_cart ?? true);
    setShowTrustBadges(settings.show_trust_badges ?? true);
    setAddressOptions(settings.address_options || 'saved');
    setDefaultPaymentMethod(settings.default_payment_method || 'upi');
    setPhoneValidation(settings.phone_validation ?? true);
    setEmailValidation(settings.email_validation ?? true);
  }, [merchant, settings]);

  const handleSave = async () => {
    await saveSettings({
      checkout_mode: checkoutMode,
      guest_checkout: guestCheckout,
      auto_coupons: autoCoupons,
      req_name: reqName,
      req_email: reqEmail,
      req_phone: reqPhone,
      req_address: reqAddress,
      pay_cards: payCards,
      pay_upi: payUPI,
      pay_netbanking: payNetbanking,
      pay_wallets: payWallets,
      pay_bnpl: payBNPL,
      show_thumbnails: showThumbnails,
      editable_cart: editableCart,
      show_trust_badges: showTrustBadges,
      address_options: addressOptions,
      default_payment_method: defaultPaymentMethod,
      phone_validation: phoneValidation,
      email_validation: emailValidation,
    });
    setLocalSaved(true);
    setTimeout(() => setLocalSaved(false), 3000);
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
          <Button variant="primary" icon={SaveIcon} iconPosition="left" onClick={handleSave} isLoading={saving}>
            Save changes
          </Button>
        </Box>
      </Box>

      {(savedNotice || localSaved) && (
        <Box marginBottom="spacing.6">
          <Alert
            title="Checkout Preferences Saved"
            description="Your customer checkout flow and Razorpay payment options have been updated."
            color="positive"
            isDismissible
            onDismiss={() => setLocalSaved(false)}
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
                    <Dropdown selectionType="single">
                      <SelectInput label="Address options" placeholder="Show saved addresses" value={addressOptions} onChange={({ values }) => setAddressOptions(values[0])} />
                      <DropdownOverlay>
                        <ActionList>
                          <ActionListItem title="Show saved addresses" value="saved" />
                          <ActionListItem title="Allow new address entry" value="new" />
                        </ActionList>
                      </DropdownOverlay>
                    </Dropdown>

                    <Checkbox isChecked={phoneValidation} onChange={({ isChecked }) => setPhoneValidation(isChecked)}>Phone number validation</Checkbox>
                    <Checkbox isChecked={emailValidation} onChange={({ isChecked }) => setEmailValidation(isChecked)}>Email validation</Checkbox>
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
                  <Dropdown selectionType="single">
                    <SelectInput label="Default payment method" placeholder="UPI" value={defaultPaymentMethod} onChange={({ values }) => setDefaultPaymentMethod(values[0])} />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="UPI" value="upi" />
                        <ActionListItem title="Cards" value="cards" />
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
