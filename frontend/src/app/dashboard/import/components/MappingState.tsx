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
  Dropdown, 
  SelectInput, 
  DropdownOverlay, 
  ActionList, 
  ActionListItem,
  ArrowLeftIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  CheckIcon
} from '@razorpay/blade/components';

interface MappingRow {
  id: string;
  fileCol: string;
  preview: string;
  mapTo: string;
  required: boolean;
  mapped: boolean;
}

const INITIAL_MAPPING: MappingRow[] = [
  { id: '1', fileCol: 'Product Name', preview: 'Wireless Noise Cancelling Earbuds', mapTo: 'name', required: true, mapped: true },
  { id: '2', fileCol: 'SKU', preview: 'WE-100-BLK', mapTo: 'sku', required: true, mapped: true },
  { id: '3', fileCol: 'Category Name', preview: 'Electronics > Audio', mapTo: 'category', required: true, mapped: true },
  { id: '4', fileCol: 'Price (INR)', preview: '1,999.00', mapTo: 'price', required: true, mapped: true },
  { id: '5', fileCol: 'Stock', preview: '50', mapTo: 'stock', required: true, mapped: true },
  { id: '6', fileCol: 'Image Link', preview: 'https://cdn.store.com/img1.jpg', mapTo: 'image_url', required: false, mapped: true },
  { id: '7', fileCol: 'Tags', preview: 'audio, wireless, bluetooth', mapTo: 'tags', required: false, mapped: true },
  { id: '8', fileCol: 'Description', preview: 'High quality spatial audio earbuds...', mapTo: 'description', required: false, mapped: true },
  { id: '9', fileCol: 'Shipping Note', preview: '2-4 business days delivery', mapTo: 'unmapped', required: false, mapped: false },
  { id: '10', fileCol: 'Return Note', preview: '7 days replacement warranty', mapTo: 'unmapped', required: false, mapped: false },
  { id: '11', fileCol: 'Status', preview: 'Active', mapTo: 'status', required: true, mapped: true },
];

const TARGET_FIELDS = [
  { value: 'name', title: 'Product Name' },
  { value: 'sku', title: 'SKU (Stock Keeping Unit)' },
  { value: 'category', title: 'Category' },
  { value: 'price', title: 'Price (INR)' },
  { value: 'stock', title: 'Inventory Stock' },
  { value: 'image_url', title: 'Product Image URL' },
  { value: 'tags', title: 'Product Tags' },
  { value: 'description', title: 'Description' },
  { value: 'shipping_notes', title: 'Shipping Notes' },
  { value: 'return_notes', title: 'Return Policy Notes' },
  { value: 'status', title: 'Status (Active/Inactive)' },
  { value: 'custom_metadata', title: 'Custom Metadata' },
  { value: 'unmapped', title: 'Do not import this column' }
];

export function MappingState({ 
  onNext, 
  onBack 
}: { 
  onNext: () => void; 
  onBack: () => void; 
}) {
  const [mappings, setMappings] = useState<MappingRow[]>(INITIAL_MAPPING);

  const handleSelect = (rowId: string, value?: string) => {
    if (!value) return;
    setMappings(prev => prev.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          mapTo: value,
          mapped: value !== 'unmapped'
        };
      }
      return row;
    }));
  };

  const mappedCount = mappings.filter(m => m.mapped).length;
  const requiredCount = mappings.filter(m => m.required).length;
  const requiredMapped = mappings.filter(m => m.required && m.mapped).length;

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Header Info */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="medium" weight="semibold">Map columns to product fields</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Verify how columns from <Text size="small" weight="semibold">products_import.csv</Text> correspond to Merchant AI Gateway attributes.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3" alignItems="center">
          <Badge color={requiredMapped === requiredCount ? 'positive' : 'notice'} size="medium">
            {requiredMapped}/{requiredCount} Required Fields Mapped
          </Badge>
          <Badge color="neutral" size="medium">
            {mappedCount}/{mappings.length} Total Columns
          </Badge>
        </Box>
      </Box>

      {/* Mapping Table Card */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column">
            {/* Table Header */}
            <Box 
              display="grid" 
              gridTemplateColumns="2.5fr 3fr 3fr 1.5fr 1.5fr" 
              padding="spacing.4" 
              paddingX="spacing.5"
              backgroundColor="surface.background.gray.subtle"
              borderBottomWidth="thin"
              borderBottomColor="surface.border.gray.muted"
              borderRadius="small"
            >
              <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">FILE COLUMN</Text>
              <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">PREVIEW VALUE</Text>
              <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">MAP TO GATEWAY FIELD</Text>
              <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">FIELD TYPE</Text>
              <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">STATUS</Text>
            </Box>

            {/* Table Rows */}
            {mappings.map((row, idx) => {
              const selectedField = TARGET_FIELDS.find(f => f.value === row.mapTo);
              return (
                <Box 
                  key={row.id}
                  display="grid" 
                  gridTemplateColumns="2.5fr 3fr 3fr 1.5fr 1.5fr" 
                  paddingY="spacing.3"
                  paddingX="spacing.5"
                  borderBottomWidth={idx === mappings.length - 1 ? 'none' : 'thin'}
                  borderBottomColor="surface.border.gray.muted"
                  alignItems="center"
                >
                  {/* File Column */}
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Text size="small" weight="semibold">{row.fileCol}</Text>
                  </Box>

                  {/* Preview */}
                  <Box paddingRight="spacing.4">
                    <Text size="small" color="surface.text.gray.subtle" truncateAfterLines={1}>
                      {row.preview}
                    </Text>
                  </Box>

                  {/* Map To Dropdown */}
                  <Box paddingRight="spacing.5">
                    <Dropdown>
                      <SelectInput 
                        label=""
                        accessibilityLabel={`Map ${row.fileCol}`}
                        value={selectedField?.title || 'Select field'}
                      />
                      <DropdownOverlay>
                        <ActionList>
                          {TARGET_FIELDS.map(field => (
                            <ActionListItem 
                              key={field.value}
                              title={field.title}
                              value={field.value}
                              onClick={() => handleSelect(row.id, field.value)}
                            />
                          ))}
                        </ActionList>
                      </DropdownOverlay>
                    </Dropdown>
                  </Box>

                  {/* Field Type */}
                  <Box>
                    {row.required ? (
                      <Badge color="negative" size="small">Required</Badge>
                    ) : (
                      <Badge color="neutral" size="small">Optional</Badge>
                    )}
                  </Box>

                  {/* Status */}
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    {row.mapped ? (
                      <Badge color="positive" size="small" icon={CheckCircleIcon}>Mapped</Badge>
                    ) : (
                      <Badge color="notice" size="small" icon={AlertTriangleIcon}>Not mapped</Badge>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardBody>
      </Card>

      {/* Footer Navigation Actions */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        paddingTop="spacing.4"
        borderTopWidth="thin"
        borderTopColor="surface.border.gray.muted"
      >
        <Button variant="secondary" icon={ArrowLeftIcon} iconPosition="left" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" icon={CheckIcon} iconPosition="left" onClick={onNext}>
          Save mapping & validate
        </Button>
      </Box>
    </Box>
  );
}
