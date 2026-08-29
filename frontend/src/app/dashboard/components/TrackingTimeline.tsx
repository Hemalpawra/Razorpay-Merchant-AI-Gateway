"use client";

import React from 'react';
import {
  Box,
  Text,
  Badge,
  CheckCircleIcon,
  PackageIcon,
} from '@razorpay/blade/components';

interface TrackingTimelineProps {
  status?: string;
  currentStage?: number;
}

const STAGES = [
  { key: 'preparing', label: 'Preparing' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' }
];

const STAGE_KEY_MAP: Record<string, number> = {
  'preparing': 0,
  'packed': 1,
  'shipped': 2,
  'out_for_delivery': 3,
  'delivered': 4
};

export function TrackingTimeline({ status, currentStage }: TrackingTimelineProps) {
  const activeIndex = currentStage !== undefined 
    ? currentStage 
    : STAGE_KEY_MAP[status?.toLowerCase() ?? ''] ?? 0;

  return (
    <Box display="flex" flexDirection="column" gap="spacing.3">
      <Text size="small" weight="semibold" color="surface.text.gray.muted">
        Shipment Status
      </Text>
      
      <Box position="relative" display="flex" justifyContent="space-between" alignItems="flex-start">
        {STAGES.map((stage, index) => {
          const isCompleted = index <= activeIndex;
          const isActive = index === activeIndex;
          
          return (
            <Box
              key={stage.key}
              display="flex"
              flexDirection="column"
              alignItems="center"
              flex={1}
              position="relative"
            >
              {index < STAGES.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    right: '-50%',
                    height: '2px',
                    backgroundColor: isCompleted && index < activeIndex ? '#22c55e' : '#e2e8f0',
                    zIndex: 0,
                  }}
                />
              )}
              
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#dcfce7' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  border: isActive ? '2px solid #22c55e' : 'none',
                }}
              >
                {isCompleted ? (
                  <CheckCircleIcon size="small" color="feedback.icon.positive.intense" />
                ) : (
                  <PackageIcon size="small" color="interactive.icon.gray.muted" />
                )}
              </div>
              
              <div style={{ maxWidth: '80px', textAlign: 'center' }}>
                <Text
                  size="xsmall"
                  textAlign="center"
                  marginTop="spacing.1"
                  color={isActive ? 'feedback.text.positive.intense' : isCompleted ? 'surface.text.gray.normal' : 'surface.text.gray.muted'}
                  weight={isActive ? 'semibold' : 'regular'}
                >
                  {stage.label}
                </Text>
              </div>
              
              {isActive && (
                <Badge color="positive" size="small" marginTop="spacing.1">
                  Current
                </Badge>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}