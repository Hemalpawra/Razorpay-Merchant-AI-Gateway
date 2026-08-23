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
  InfoIcon,
  SettingsIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function BusinessRulesPage() {
  const [minOrder, setMinOrder] = useState('500');
  const [maxOrder, setMaxOrder] = useState('500000');
  const [orderPrefix, setOrderPrefix] = useState('ORD');
  const [approvalThreshold, setApprovalThreshold] = useState('50000');
  const [maxDiscount, setMaxDiscount] = useState('10');
  const [taxRate, setTaxRate] = useState('18');

  const [highValueApproval, setHighValueApproval] = useState(true);
  const [manualReviewNew, setManualReviewNew] = useState(true);
  const [allowDiscounts, setAllowDiscounts] = useState(true);
  const [outOfStockOrder, setOutOfStockOrder] = useState(false);
  const [backorder, setBackorder] = useState(false);
  const [showStock, setShowStock] = useState(true);

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
        <Text size="small" color="surface.text.gray.subtle">Business Rules</Text>
      </Box>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Business Rules</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Set currency, tax, order rules and approval thresholds for your store.
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
            title="Business Rules Saved"
            description="Your store currency, tax, and order policy rules have been updated."
            color="positive"
            isDismissible
            onDismiss={() => setSavedNotice(false)}
          />
        </Box>
      )}

      {/* Main Grid: Left Inner Menu (1fr), Right Panel (3fr) */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', l: '240px 1fr' }} gap="spacing.6">

        {/* Left Inner Navigation Menu */}
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.1">
                {[
                  { label: 'General', active: true },
                  { label: 'Tax & Currency', active: false },
                  { label: 'Order Rules', active: false },
                  { label: 'Approval & Controls', active: false },
                  { label: 'Inventory & Availability', active: false },
                  { label: 'Returns & Cancellations', active: false },
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

          {/* Helper Card */}
          <Card elevation="none" backgroundColor="surface.background.gray.subtle">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <SettingsIcon size="small" color="interactive.icon.primary.normal" />
                  <Text size="xsmall" weight="semibold">About Business Rules</Text>
                </Box>
                <Text size="xsmall" color="surface.text.gray.muted">
                  These rules help your AI assistant and store operate consistently and ensure orders follow your business policies.
                </Text>
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Main Settings Panel */}
        <Box display="flex" flexDirection="column" gap="spacing.5">

          {/* 1. General */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">1. General</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Basic business information that affects orders and transactions.</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Dropdown>
                    <SelectInput label="Store currency" placeholder="INR (₹) - Indian Rupee" />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="INR (₹) - Indian Rupee" value="inr" onClick={() => {}} />
                        <ActionListItem title="USD ($) - US Dollar" value="usd" onClick={() => {}} />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>

                  <Dropdown>
                    <SelectInput label="Timezone" placeholder="Asia/Kolkata (IST)" />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Asia/Kolkata (IST)" value="ist" onClick={() => {}} />
                        <ActionListItem title="UTC" value="utc" onClick={() => {}} />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>

                  <Dropdown>
                    <SelectInput label="Date format" placeholder="DD MMM YYYY" />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="DD MMM YYYY" value="dd_mmm_yyyy" onClick={() => {}} />
                        <ActionListItem title="YYYY-MM-DD" value="iso" onClick={() => {}} />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 2. Tax & Currency */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">2. Tax & Currency</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Configure tax display and calculation behaviour.</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Dropdown>
                    <SelectInput label="Tax display in store" placeholder="Inclusive of tax" />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Inclusive of tax" value="inclusive" onClick={() => {}} />
                        <ActionListItem title="Exclusive of tax" value="exclusive" onClick={() => {}} />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>

                  <TextInput
                    label="Default tax rate (%)"
                    value={taxRate}
                    onChange={({ value }) => setTaxRate(value || '')}
                  />

                  <Dropdown>
                    <SelectInput label="Tax calculation basis" placeholder="On order total" />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="On order total" value="total" onClick={() => {}} />
                        <ActionListItem title="Per item" value="item" onClick={() => {}} />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 3. Order Rules */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">3. Order Rules</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Define order related rules and constraints.</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(4,1fr)' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <TextInput
                    label="Minimum order (₹)"
                    value={minOrder}
                    onChange={({ value }) => setMinOrder(value || '')}
                  />
                  <TextInput
                    label="Maximum order (₹)"
                    value={maxOrder}
                    onChange={({ value }) => setMaxOrder(value || '')}
                  />
                  <Dropdown>
                    <SelectInput label="Order numbering" placeholder="Auto (ORD-10001...)" />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Auto (ORD-10001...)" value="auto" onClick={() => {}} />
                        <ActionListItem title="Custom Format" value="custom" onClick={() => {}} />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                  <TextInput
                    label="Order ID prefix"
                    value={orderPrefix}
                    onChange={({ value }) => setOrderPrefix(value || '')}
                  />
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 4. Approval & Controls */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">4. Approval & Controls</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Set approval thresholds and manual review requirements.</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Text size="small" weight="semibold">Human approval (high value)</Text>
                      <Checkbox isChecked={highValueApproval} onChange={({ isChecked }) => setHighValueApproval(isChecked)} />
                    </Box>
                    <TextInput
                      label="Approval threshold (₹)"
                      value={approvalThreshold}
                      onChange={({ value }) => setApprovalThreshold(value || '')}
                    />
                  </Box>

                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Text size="small" weight="semibold">Manual review (new users)</Text>
                      <Checkbox isChecked={manualReviewNew} onChange={({ isChecked }) => setManualReviewNew(isChecked)} />
                    </Box>
                    <Text size="xsmall" color="surface.text.gray.muted">Review orders from first time customers.</Text>
                  </Box>

                  <Box display="flex" flexDirection="column" gap="spacing.2">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Text size="small" weight="semibold">Allow AI discounts</Text>
                      <Checkbox isChecked={allowDiscounts} onChange={({ isChecked }) => setAllowDiscounts(isChecked)} />
                    </Box>
                    <TextInput
                      label="Maximum discount allowed (%)"
                      value={maxDiscount}
                      onChange={({ value }) => setMaxDiscount(value || '')}
                    />
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* 5. Inventory & Availability */}
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Text size="medium" weight="semibold">5. Inventory & Availability</Text>
                <Text size="xsmall" color="surface.text.gray.subtle">Control how inventory availability is handled.</Text>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)' }} gap="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Out of stock orders</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Allow AI to take order for out of stock.</Text>
                    </Box>
                    <Checkbox isChecked={outOfStockOrder} onChange={({ isChecked }) => setOutOfStockOrder(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Backorder allowed</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Allow backorders for products.</Text>
                    </Box>
                    <Checkbox isChecked={backorder} onChange={({ isChecked }) => setBackorder(isChecked)} />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">Show stock quantity</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">Display real-time stock availability.</Text>
                    </Box>
                    <Checkbox isChecked={showStock} onChange={({ isChecked }) => setShowStock(isChecked)} />
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
