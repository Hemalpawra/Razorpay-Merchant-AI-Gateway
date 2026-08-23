'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Tabs, 
  TabList, 
  TabItem, 
  Badge,
  UploadIcon,
  PlusIcon,
  Dropdown,
  SelectInput,
  DropdownOverlay,
  ActionList,
  ActionListItem
} from '@razorpay/blade/components';
import { ImportState, ImportMethod } from './types';

import { 
  EmptyState,
  UploadingState,
  MappingState,
  ValidationState,
  PreviewState,
  DuplicateReviewState,
  ImportingState,
  ResultState,
  ManualAddState 
} from './components';

export default function ProductImportPage() {
  const [importState, setImportState] = useState<ImportState>('empty');
  const [method, setMethod] = useState<ImportMethod>('csv');

  const handleTabChange = (val: string) => {
    setMethod(val as ImportMethod);
    if (val === 'manual') {
      // Switch to manual entry
    } else {
      setImportState('empty');
    }
  };

  const renderCurrentState = () => {
    if (method === 'manual') {
      return (
        <ManualAddState 
          onSave={() => setImportState('success')} 
          onCancel={() => setMethod('csv')} 
        />
      );
    }

    switch (importState) {
      case 'empty':
        return (
          <EmptyState 
            onNext={() => setImportState('uploading')} 
            onManualAdd={() => setMethod('manual')} 
          />
        );
      case 'uploading':
        return (
          <UploadingState 
            onNext={() => setImportState('mapping')} 
            onCancel={() => setImportState('empty')} 
          />
        );
      case 'mapping':
        return (
          <MappingState 
            onNext={() => setImportState('validation')} 
            onBack={() => setImportState('empty')} 
          />
        );
      case 'validation':
        return (
          <ValidationState 
            onNext={() => setImportState('preview')} 
            onBack={() => setImportState('mapping')} 
          />
        );
      case 'preview':
        return (
          <PreviewState 
            onNext={() => setImportState('duplicate_review')} 
            onBack={() => setImportState('validation')} 
          />
        );
      case 'duplicate_review':
        return (
          <DuplicateReviewState 
            onNext={() => setImportState('importing')} 
            onBack={() => setImportState('preview')} 
          />
        );
      case 'importing':
        return (
          <ImportingState 
            onNext={() => setImportState('success')} 
          />
        );
      case 'success':
        return (
          <ResultState 
            type="success" 
            onReset={() => setImportState('empty')} 
          />
        );
      case 'partial_success':
        return (
          <ResultState 
            type="partial" 
            onReset={() => setImportState('empty')} 
          />
        );
      case 'error':
        return (
          <ResultState 
            type="error" 
            onReset={() => setImportState('empty')} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100vh" display="flex" flexDirection="column" gap="spacing.6">
      {/* Top Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Box display="flex" alignItems="center" gap="spacing.3">
            <Heading size="2xlarge" weight="semibold">Product Import</Heading>
            <Badge color="neutral" size="small">Merchant AI Gateway</Badge>
          </Box>
          <Text size="small" color="surface.text.gray.subtle">
            Add products manually or import them in bulk to power customer AI shopping sessions.
          </Text>
        </Box>

        <Box display="flex" gap="spacing.3">
          <Button 
            variant="secondary" 
            icon={UploadIcon} 
            iconPosition="left"
            onClick={() => {
              setMethod('csv');
              setImportState('empty');
            }}
          >
            Import products
          </Button>
          <Button 
            variant="primary" 
            icon={PlusIcon} 
            iconPosition="left"
            onClick={() => setMethod('manual')}
          >
            Add product manually
          </Button>
        </Box>
      </Box>

      {/* Import Method Tabs */}
      <Box borderBottomWidth="thin" borderBottomColor="surface.border.gray.muted">
        <Tabs 
          variant="bordered" 
          value={method} 
          onChange={handleTabChange}
        >
          <TabList>
            <TabItem value="manual">Manual Add</TabItem>
            <TabItem value="csv">CSV Upload</TabItem>
            <TabItem value="excel">Excel Upload</TabItem>
            <TabItem value="json">JSON / API Sync</TabItem>
          </TabList>
        </Tabs>
      </Box>

      {/* Dynamic Screen State Body */}
      <Box flex={1}>
        {renderCurrentState()}
      </Box>

      {/* Dev State Switcher (Built with Blade Dropdown) */}
      <Box 
        position="fixed" 
        bottom="spacing.5" 
        right="spacing.5" 
        padding="spacing.4"
        backgroundColor="surface.background.gray.intense"
        borderRadius="medium"
        borderWidth="thin"
        borderColor="surface.border.gray.muted"
        display="flex"
        flexDirection="column"
        gap="spacing.2"
        zIndex={100}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.3">
          <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">DEV STATE PREVIEW</Text>
          <Badge color="information" size="small">{importState}</Badge>
        </Box>
        <Box width="200px">
          <Dropdown>
            <SelectInput 
              label=""
              accessibilityLabel="Select state"
              value={importState} 
            />
            <DropdownOverlay>
              <ActionList>
                {[
                  { label: '1. Empty State', val: 'empty' },
                  { label: '2. Uploading State', val: 'uploading' },
                  { label: '3. Mapping State', val: 'mapping' },
                  { label: '4. Validation State', val: 'validation' },
                  { label: '5. Preview State', val: 'preview' },
                  { label: '6. Duplicate Review State', val: 'duplicate_review' },
                  { label: '7. Importing State', val: 'importing' },
                  { label: '8. Success State', val: 'success' },
                  { label: '9. Partial Success State', val: 'partial_success' },
                  { label: '10. Error State', val: 'error' }
                ].map(s => (
                  <ActionListItem 
                    key={s.val} 
                    title={s.label} 
                    value={s.val} 
                    onClick={() => {
                      setMethod('csv');
                      setImportState(s.val as ImportState);
                    }} 
                  />
                ))}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>
    </Box>
  );
}
