"use client";

import React from 'react';
import {
  Box,
  Text,
  Card,
  CardBody,
  Badge,
  ShieldIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon
} from '@razorpay/blade/components';

interface AIBound {
  action: string;
  maxDiscount: string;
  maxFreeShipping: string;
  requireApproval: boolean;
}

interface AIBoundsCardProps {
  bounds?: AIBound;
}

const DEFAULT_BOUNDS: AIBound = {
  action: 'AI Commerce Agent',
  maxDiscount: '10%',
  maxFreeShipping: '₹500',
  requireApproval: true
};

export function AIBoundsCard({ bounds = DEFAULT_BOUNDS }: AIBoundsCardProps) {
  return (
    <Card elevation="none" backgroundColor="surface.background.gray.intense">
      <CardBody>
        <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
          <ShieldIcon size="small" color="interactive.icon.primary.normal" />
          <Text size="small" weight="semibold">AI Commerce Boundaries</Text>
          <Badge color="positive" size="small">Active</Badge>
        </Box>
        
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Box display="flex" justifyContent="space-between" alignItems="center" padding="spacing.2" backgroundColor="surface.background.gray.subtle" borderRadius="small">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <CheckCircleIcon size="small" color="feedback.icon.positive.intense" />
              <Text size="xsmall">Max Discount</Text>
            </Box>
            <Text size="xsmall" weight="semibold">{bounds.maxDiscount}</Text>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" padding="spacing.2" backgroundColor="surface.background.gray.subtle" borderRadius="small">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <CheckCircleIcon size="small" color="feedback.icon.positive.intense" />
              <Text size="xsmall">Max Free Shipping</Text>
            </Box>
            <Text size="xsmall" weight="semibold">{bounds.maxFreeShipping}</Text>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" padding="spacing.2" backgroundColor="surface.background.gray.subtle" borderRadius="small">
            <Box display="flex" alignItems="center" gap="spacing.2">
              {bounds.requireApproval ? (
                <AlertCircleIcon size="small" color="feedback.icon.notice.intense" />
              ) : (
                <CheckCircleIcon size="small" color="feedback.icon.positive.intense" />
              )}
              <Text size="xsmall">High-Value Approval</Text>
            </Box>
            <Text size="xsmall" weight="semibold">{bounds.requireApproval ? 'Required' : 'Auto'}</Text>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="flex-start" gap="spacing.2" marginTop="spacing.3" padding="spacing.2" backgroundColor="surface.background.primary.subtle" borderRadius="small">
          <InfoIcon size="small" color="interactive.icon.primary.normal" />
          <Text size="xsmall" color="surface.text.gray.subtle">
            AI cannot exceed these boundaries without your approval. All money actions are logged.
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
}