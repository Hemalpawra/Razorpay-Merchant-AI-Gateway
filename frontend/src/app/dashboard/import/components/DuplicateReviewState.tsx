'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  Alert, 
  RadioGroup, 
  Radio, 
  Badge,
  ArrowLeftIcon,
  ChevronRightIcon
} from '@razorpay/blade/components';

export function DuplicateReviewState({ 
  onNext, 
  onBack 
}: { 
  onNext: () => void; 
  onBack: () => void; 
}) {
  const [duplicateAction, setDuplicateAction] = useState('skip');

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Blade Notice Alert */}
      <Alert
        title="30 duplicate products found"
        description="These products already exist in your Merchant AI Gateway catalog with matching SKU or product title."
        color="notice"
        isFullWidth
        isDismissible={false}
      />

      {/* Handling Mode Card */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.6">
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Heading size="small" weight="semibold">Choose how to handle duplicates</Heading>
              <Text size="small" color="surface.text.gray.subtle">
                Select how the import engine should resolve matching SKUs against existing catalog items.
              </Text>
            </Box>

            {/* Native Blade RadioGroup */}
            <Box padding="spacing.4" backgroundColor="surface.background.gray.subtle" borderRadius="medium">
              <RadioGroup
                label="Duplicate Resolution Strategy"
                value={duplicateAction}
                onChange={({ value }) => setDuplicateAction(value)}
              >
                <Radio 
                  value="skip" 
                  helpText="Only new products with unique SKUs will be created. Existing items remain untouched."
                >
                  Skip duplicates (Recommended)
                </Radio>
                <Radio 
                  value="update" 
                  helpText="Existing products will be updated with new prices, stock, and metadata from this file."
                >
                  Update existing (Overwrite)
                </Radio>
                <Radio 
                  value="review" 
                  helpText="Inspect each conflict individually after the initial import completes."
                >
                  Review manually (Side-by-side conflict resolution)
                </Radio>
              </RadioGroup>
            </Box>

            {/* Affected SKU summary list */}
            <Box 
              padding="spacing.4" 
              backgroundColor="surface.background.gray.subtle" 
              borderRadius="small" 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
            >
              <Text size="small" color="surface.text.gray.subtle">
                Affected SKUs: <Text size="small" weight="semibold">WE-100, BS-300, SW-200, GM-400</Text> (+26 more)
              </Text>
              <Badge color="notice" size="small">30 rows affected</Badge>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Footer Navigation */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        paddingTop="spacing.4"
        borderTopWidth="thin"
        borderTopColor="surface.border.gray.muted"
      >
        <Button variant="secondary" icon={ArrowLeftIcon} iconPosition="left" onClick={onBack}>
          Back to preview
        </Button>
        <Button variant="primary" icon={ChevronRightIcon} iconPosition="right" onClick={onNext}>
          Proceed to import
        </Button>
      </Box>
    </Box>
  );
}
