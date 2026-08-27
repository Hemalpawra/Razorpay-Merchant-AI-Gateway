'use client';

import React from 'react';
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
  Spinner,
  ChevronRightIcon,
  SaveIcon,
  SparklesIcon,
  InfoIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';
import { useMerchantSettings } from '../use-merchant-settings';

export default function AIDefaultsPage() {
  const { settings, merchant, loading, saving, error, savedNotice, saveSettings } = useMerchantSettings();

  const [aiEnabled, setAiEnabled] = React.useState(settings.ai_enabled ?? true);
  const [askAddress, setAskAddress] = React.useState(settings.ask_address ?? true);
  const [askEmail, setAskEmail] = React.useState(settings.ask_email ?? true);
  const [askPhone, setAskPhone] = React.useState(settings.ask_phone ?? true);
  const [askPaymentConfirm, setAskPaymentConfirm] = React.useState(settings.ask_payment_confirm ?? true);
  const [askNotes, setAskNotes] = React.useState(settings.ask_notes ?? false);
  const [enableUpsell, setEnableUpsell] = React.useState(settings.enable_upsell ?? true);
  const [enableCrossSell, setEnableCrossSell] = React.useState(settings.enable_cross_sell ?? true);
  const [showComparisons, setShowComparisons] = React.useState(settings.show_comparisons ?? false);
  const [highlightOffers, setHighlightOffers] = React.useState(settings.highlight_offers ?? true);
  const [autoCreateOrder, setAutoCreateOrder] = React.useState(settings.auto_create_order ?? true);
  const [autoCapturePayment, setAutoCapturePayment] = React.useState(settings.auto_capture_payment ?? false);
  const [responseLanguage, setResponseLanguage] = React.useState(settings.response_language ?? 'en_in');
  const [responseStyle, setResponseStyle] = React.useState(settings.response_style ?? 'balanced');

  const [localSaved, setLocalSaved] = React.useState(false);

  const didInit = React.useRef(false);
  React.useEffect(() => {
    if (didInit.current || !merchant) return;
    didInit.current = true;
    setAiEnabled(settings.ai_enabled ?? true);
    setAskAddress(settings.ask_address ?? true);
    setAskEmail(settings.ask_email ?? true);
    setAskPhone(settings.ask_phone ?? true);
    setAskPaymentConfirm(settings.ask_payment_confirm ?? true);
    setAskNotes(settings.ask_notes ?? false);
    setEnableUpsell(settings.enable_upsell ?? true);
    setEnableCrossSell(settings.enable_cross_sell ?? true);
    setShowComparisons(settings.show_comparisons ?? false);
    setHighlightOffers(settings.highlight_offers ?? true);
    setAutoCreateOrder(settings.auto_create_order ?? true);
    setAutoCapturePayment(settings.auto_capture_payment ?? false);
    setResponseLanguage(settings.response_language ?? 'en_in');
    setResponseStyle(settings.response_style ?? 'balanced');
  }, [merchant, settings]);

  const handleSave = async () => {
    await saveSettings({
      ai_enabled: aiEnabled,
      ask_address: askAddress,
      ask_email: askEmail,
      ask_phone: askPhone,
      ask_payment_confirm: askPaymentConfirm,
      ask_notes: askNotes,
      enable_upsell: enableUpsell,
      enable_cross_sell: enableCrossSell,
      show_comparisons: showComparisons,
      highlight_offers: highlightOffers,
      auto_create_order: autoCreateOrder,
      auto_capture_payment: autoCapturePayment,
      response_language: responseLanguage,
      response_style: responseStyle,
    });
    setLocalSaved(true);
    setTimeout(() => setLocalSaved(false), 3000);
  };

  if (loading) {
    return (
      <Box padding="spacing.8" display="flex" justifyContent="center">
        <Spinner accessibilityLabel="Loading settings" />
      </Box>
    );
  }

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">

      <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <Text size="small" color="interactive.text.primary.normal">Settings</Text>
        </Link>
        <ChevronRightIcon size="small" color="surface.icon.gray.subtle" />
        <Text size="small" color="surface.text.gray.subtle">AI Defaults</Text>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">AI Defaults</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Control how your AI assistant behaves and communicates.
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
            title="AI Defaults Saved"
            description="Your AI assistant behavior configuration has been updated."
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

      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '240px 1fr' }} gap="spacing.6">

        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.1">
                {[
                  { label: 'General Behaviour', active: true },
                  { label: 'Information Collection', active: false },
                  { label: 'Sales & Recommendations', active: false },
                  { label: 'Order & Payment', active: false },
                  { label: 'Communication Tone', active: false },
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

          <Card elevation="none" backgroundColor="surface.background.gray.subtle">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <SparklesIcon size="small" color="interactive.icon.primary.normal" />
                  <Text size="xsmall" weight="semibold">AI Defaults Note</Text>
                </Box>
                <Text size="xsmall" color="surface.text.gray.muted">
                  These settings define the default behaviour of your AI assistant across all channels and conversations.
                </Text>
              </Box>
            </CardBody>
          </Card>
        </Box>

        <Box display="flex" flexDirection="column" gap="spacing.5">

          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">1. General Behaviour</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Enable or disable the core AI assistant and configure its overall behaviour.</Text>

                <Box display="flex" justifyContent="space-between" alignItems="center" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" flexDirection="column">
                    <Text size="small" weight="semibold">Enable AI assistant</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">Turn on the AI assistant for your store.</Text>
                  </Box>
                  <Checkbox isChecked={aiEnabled} onChange={({ isChecked }) => setAiEnabled(isChecked)}>Active</Checkbox>
                </Box>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Dropdown selectionType="single">
                    <SelectInput
                      label="Default response language"
                      placeholder="English (India)"
                      value={responseLanguage}
                      onChange={({ values }) => setResponseLanguage(values[0])}
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="English (India)" value="en_in" />
                        <ActionListItem title="Hindi" value="hi" />
                        <ActionListItem title="Hinglish" value="hinglish" />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>

                  <Dropdown selectionType="single">
                    <SelectInput
                      label="Response style"
                      placeholder="Balanced (Short & Clear)"
                      value={responseStyle}
                      onChange={({ values }) => setResponseStyle(values[0])}
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Balanced (Short & Clear)" value="balanced" />
                        <ActionListItem title="Detailed & Technical" value="detailed" />
                        <ActionListItem title="Concise & Direct" value="concise" />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">2. Information Collection</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Choose what information the AI assistant should ask from customers.</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Ask for shipping address</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Collect shipping address during conversation.</Text>
                    </Box>
                    <Checkbox isChecked={askAddress} onChange={({ isChecked }) => setAskAddress(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Ask for payment confirmation</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Confirm before creating payment.</Text>
                    </Box>
                    <Checkbox isChecked={askPaymentConfirm} onChange={({ isChecked }) => setAskPaymentConfirm(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Ask for email</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Collect customer email address.</Text>
                    </Box>
                    <Checkbox isChecked={askEmail} onChange={({ isChecked }) => setAskEmail(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Ask for order notes</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Allow AI to ask for order notes (optional).</Text>
                    </Box>
                    <Checkbox isChecked={askNotes} onChange={({ isChecked }) => setAskNotes(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Ask for phone number</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Collect customer phone number.</Text>
                    </Box>
                    <Checkbox isChecked={askPhone} onChange={({ isChecked }) => setAskPhone(isChecked)} />
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">3. Sales & Recommendations</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Control how AI recommends and promotes products.</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Enable upsell</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Suggest better or premium variants.</Text>
                    </Box>
                    <Checkbox isChecked={enableUpsell} onChange={({ isChecked }) => setEnableUpsell(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Show product comparisons</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Allow AI to show comparisons between products.</Text>
                    </Box>
                    <Checkbox isChecked={showComparisons} onChange={({ isChecked }) => setShowComparisons(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Enable cross-sell</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Suggest related or complementary products.</Text>
                    </Box>
                    <Checkbox isChecked={enableCrossSell} onChange={({ isChecked }) => setEnableCrossSell(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Highlight offers & discounts</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Let AI highlight coupons and discounts.</Text>
                    </Box>
                    <Checkbox isChecked={highlightOffers} onChange={({ isChecked }) => setHighlightOffers(isChecked)} />
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">4. Order & Payment</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Control how orders are created and payments are handled.</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Auto create Razorpay order</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Automatically create a Razorpay order when ready.</Text>
                    </Box>
                    <Checkbox isChecked={autoCreateOrder} onChange={({ isChecked }) => setAutoCreateOrder(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Auto capture payment (if applicable)</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Capture payment automatically after success.</Text>
                    </Box>
                    <Checkbox isChecked={autoCapturePayment} onChange={({ isChecked }) => setAutoCapturePayment(isChecked)} />
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