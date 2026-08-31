"use client";

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  IconButton,
  CloseIcon,
  EditIcon,
} from '@razorpay/blade/components';

interface BulkActionPanelProps {
  selectedProducts: string[];
  onClose: () => void;
  onActionComplete?: () => void;
}

const ACTIONS = [
  { label: 'Archive Products', value: 'archive' },
  { label: 'Activate Products', value: 'activate' },
  { label: 'Show to AI', value: 'update_ai_visibility' },
  { label: 'Hide from AI', value: 'update_ai_visibility_hide' },
];

export function BulkActionPanel({ selectedProducts, onClose, onActionComplete }: BulkActionPanelProps) {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAction = async () => {
    if (!selectedAction) {
      setError('Please select an action');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: selectedProducts,
          action: selectedAction === 'update_ai_visibility_hide' ? 'update_ai_visibility' : selectedAction,
          value: selectedAction === 'update_ai_visibility_hide' ? false : undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        if (onActionComplete) onActionComplete();
        setTimeout(onClose, 2000);
      } else {
        setError(data.error || 'Failed to perform bulk action');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to perform bulk action');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', minWidth: '500px', zIndex: 100 }}>
      <Card backgroundColor="surface.background.gray.intense">
        <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="spacing.3">
              <Badge color="information" size="small">{selectedProducts.length} selected</Badge>
              <Heading size="small">Bulk Actions</Heading>
            </Box>
            <IconButton icon={CloseIcon} accessibilityLabel="Close" size="small" onClick={onClose} />
          </Box>

          {error && (
            <Text size="small" color="feedback.text.negative.intense">{error}</Text>
          )}

          {success && (
            <Text size="small" color="feedback.text.positive.intense">{success}</Text>
          )}

          {!success && (
            <Box display="flex" gap="spacing.3" alignItems="flex-end">
              <Box flex={1}>
                <Text size="small" weight="semibold" marginBottom="spacing.2">Select Action</Text>
                <Box display="flex" flexWrap="wrap" gap="spacing.2">
                  {ACTIONS.map((action) => (
                    <Button
                      key={action.value}
                      variant={selectedAction === action.value ? 'primary' : 'secondary'}
                      size="small"
                      onClick={() => setSelectedAction(action.value)}
                      icon={EditIcon}
                      iconPosition="left"
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Button
                variant="primary"
                onClick={handleAction}
                isDisabled={isProcessing || !selectedAction}
                isLoading={isProcessing}
              >
                Apply
              </Button>
            </Box>
          )}
        </Box>
      </CardBody>
    </Card>
  </div>
  );
}