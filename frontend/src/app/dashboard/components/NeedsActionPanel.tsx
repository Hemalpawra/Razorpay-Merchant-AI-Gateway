"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  ClockIcon,
  AlertCircleIcon,
  ChevronRightIcon,
  RefreshIcon,
} from '@razorpay/blade/components';

interface NeedsActionItem {
  id: string;
  type: 'waiting-payment' | 'human-help' | 'out-of-stock' | 'abandoned-cart';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  action: {
    label: string;
    url: string;
  };
}

const PRIORITY_COLORS: Record<string, "surface.border.primary.normal" | "surface.border.gray.normal" | "surface.border.gray.muted"> = {
  'high': 'surface.border.primary.normal',
  'medium': 'surface.border.gray.normal',
  'low': 'surface.border.gray.muted'
};

const TYPE_LABEL: Record<string, { color: 'positive' | 'negative' | 'notice' | 'information'; label: string }> = {
  'waiting-payment': { color: 'notice', label: 'Payment' },
  'human-help': { color: 'negative', label: 'Human Help' },
  'out-of-stock': { color: 'negative', label: 'Stock' },
  'abandoned-cart': { color: 'notice', label: 'Abandoned' },
};

export function NeedsActionPanel() {
  const [items, setItems] = useState<NeedsActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNeedsAction();
  }, []);

  const fetchNeedsAction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard?type=needs-action');
      const data = await res.json();
      if (data.needsAction) {
        setItems(data.needsAction);
      }
    } catch (err) {
      console.error('Error fetching needs action:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Box padding="spacing.4">
        <Text size="small" color="surface.text.gray.muted">Loading...</Text>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box padding="spacing.4">
        <Text size="small" color="feedback.text.positive.intense">
          All caught up! No pending actions.
        </Text>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.2">
        <Heading size="small" weight="semibold">
          Needs Action ({items.length})
        </Heading>
        <Button
          variant="tertiary"
          size="xsmall"
          icon={RefreshIcon}
          onClick={fetchNeedsAction}
        />
      </Box>
      
      {items.slice(0, 5).map((item) => {
        const config = TYPE_LABEL[item.type];
        return (
          <Box
            key={item.id}
            padding="spacing.3"
            backgroundColor="surface.background.gray.intense"
            borderRadius="medium"
            borderLeftWidth="thick"
            borderLeftColor={PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.low}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box flex={1}>
                <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.1">
                  <Badge color={config.color} size="small">
                    {config.label}
                  </Badge>
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {formatTime(item.timestamp)}
                  </Text>
                </Box>
                <Text size="small" weight="semibold" marginBottom="spacing.1">
                  {item.title}
                </Text>
                <Text size="xsmall" color="surface.text.gray.subtle">
                  {item.description}
                </Text>
              </Box>
              <Link href={item.action.url} style={{ textDecoration: 'none' }}>
                <Button
                  variant="tertiary"
                  size="xsmall"
                  icon={ChevronRightIcon}
                  iconPosition="right"
                >
                  {item.action.label}
                </Button>
              </Link>
            </Box>
          </Box>
        );
      })}
      
      {items.length > 5 && (
        <Link href="/dashboard/ai-agent?filter=attention" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="small" isFullWidth>
            View All {items.length} Items
          </Button>
        </Link>
      )}
    </Box>
  );
}