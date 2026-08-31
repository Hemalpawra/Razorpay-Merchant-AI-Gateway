"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  Skeleton,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  SparklesIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  PackageIcon,
  CreditCardIcon
} from '@razorpay/blade/components';

interface ReasoningStep {
  id: string;
  time: string;
  action: string;
  result: 'Success' | 'Failed' | 'Warning';
  note: string;
  stepNumber: number;
  metadata?: any;
}

interface ReasoningTimelineProps {
  sessionId: string;
}

const ICON_MAP: Record<string, any> = {
  'products_searched': SparklesIcon,
  'products_compared': SparklesIcon,
  'product_recommended': ShoppingBagIcon,
  'upsell_shown': TrendingUpIcon,
  'cross_sell_shown': TrendingUpIcon,
  'missing_details_requested': AlertCircleIcon,
  'cart_created': PackageIcon,
  'order_created': ShoppingBagIcon,
  'payment_initiated': CreditCardIcon,
  'payment_completed': CheckCircleIcon,
};

const COLOR_MAP: Record<string, 'positive' | 'negative' | 'notice' | 'information'> = {
  'Success': 'positive',
  'Failed': 'negative',
  'Warning': 'notice',
};

export function ReasoningTimeline({ sessionId }: ReasoningTimelineProps) {
  const [steps, setSteps] = useState<ReasoningStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReasoning();
  }, [sessionId]);

  const fetchReasoning = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reasoning?session_id=${sessionId}`);
      const data = await res.json();
      if (data.reasoning) {
        setSteps(data.reasoning);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load reasoning timeline');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" gap="spacing.2">
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding="spacing.3" backgroundColor="surface.background.gray.subtle" borderRadius="small">
        <Text size="small" color="surface.text.gray.muted">{error}</Text>
      </Box>
    );
  }

  if (steps.length === 0) {
    return (
      <Box padding="spacing.3" backgroundColor="surface.background.gray.subtle" borderRadius="small">
        <Text size="small" color="surface.text.gray.muted">
          No AI reasoning steps recorded yet.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
        <SparklesIcon size="small" color="interactive.icon.primary.normal" />
        <Heading size="small">AI Reasoning Timeline</Heading>
        <Badge color="information" size="small">{steps.length} steps</Badge>
      </Box>
      
      <Box position="relative" paddingLeft="spacing.5">
        {steps.map((step, index) => {
          const Icon = ICON_MAP[step.metadata?.event_type as string] || ClockIcon;
          const color = COLOR_MAP[step.result] || 'neutral';
          const isLast = index === steps.length - 1;
          
          return (
            <Box key={step.id} position="relative" marginBottom={isLast ? undefined : 'spacing.4'}>
              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '-16px',
                    width: '2px',
                    height: 'calc(100% + 16px)',
                    backgroundColor: '#e2e8f0',
                  }}
                />
              )}
              
              <div
                style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '4px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: color === 'positive' ? '#dcfce7' : color === 'negative' ? '#fee2e2' : color === 'notice' ? '#fef3c7' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <Icon size="xsmall" color={`feedback.icon.${color}.intense`} />
              </div>
              
              <Box
                padding="spacing.3"
                backgroundColor="surface.background.gray.subtle"
                borderRadius="medium"
                borderWidth="thin"
                borderColor="surface.border.gray.subtle"
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.1">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">
                      Step {step.stepNumber}
                    </Text>
                    <Badge color={color} size="small">
                      {step.result}
                    </Badge>
                  </Box>
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {step.time}
                  </Text>
                </Box>
                
                <Text size="small" weight="semibold" marginBottom="spacing.1">
                  {step.action}
                </Text>
                
                {step.note && (
                  <Text size="xsmall" color="surface.text.gray.subtle">
                    {step.note}
                  </Text>
                )}
                
                {step.metadata && Object.keys(step.metadata).length > 0 && (
                  <Box marginTop="spacing.2" display="flex" flexWrap="wrap" gap="spacing.1">
                    {Object.entries(step.metadata)
                      .filter(([key]) => !['event_type', 'session_id'].includes(key))
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <Badge key={key} color="neutral" size="small">
                          {key}: {String(value).substring(0, 30)}
                        </Badge>
                      ))}
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}