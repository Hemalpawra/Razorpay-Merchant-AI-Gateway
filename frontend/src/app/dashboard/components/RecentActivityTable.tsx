"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Text,
  Badge,
  Button,
  RefreshIcon,
  ChevronRightIcon,
} from '@razorpay/blade/components';

interface ActivityItem {
  id: string;
  time: string;
  event: string;
  source: string;
  status: 'Success' | 'Failed' | 'Warning';
  action: string;
}

export function RecentActivityTable() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard?type=recent-activity');
      const data = await res.json();
      if (data.recentActivity) {
        setActivities(data.recentActivity);
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'positive' as const;
      case 'Failed':
        return 'negative' as const;
      case 'Warning':
        return 'notice' as const;
      default:
        return 'neutral' as const;
    }
  };

  const getActionUrl = (action: string) => {
    switch (action) {
      case 'View Order':
        return '/dashboard/orders';
      case 'View Conversation':
        return '/dashboard/ai-agent';
      case 'View Product':
        return '/dashboard/products';
      default:
        return '/dashboard/audit-trail';
    }
  };

  if (isLoading) {
    return (
      <Box padding="spacing.4">
        <Text size="small" color="surface.text.gray.muted">Loading...</Text>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box padding="spacing.4">
        <Text size="small" color="surface.text.gray.muted">
          No recent activity to display.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.3">
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          TIME
        </Text>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          EVENT
        </Text>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          SOURCE
        </Text>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          STATUS
        </Text>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          ACTION
        </Text>
      </Box>
      
      {activities.map((activity, index) => (
        <Box
          key={activity.id}
          display="grid"
          gridTemplateColumns="80px 1fr 100px 80px auto"
          gap="spacing.3"
          paddingY="spacing.2"
          paddingX="spacing.2"
          borderBottomWidth={index < activities.length - 1 ? 'thin' : 'none'}
          borderBottomColor="surface.border.gray.muted"
          alignItems="center"
        >
          <Text size="xsmall" color="surface.text.gray.muted">
            {activity.time}
          </Text>
          <Text size="small" weight="medium">
            {activity.event}
          </Text>
          <Badge color="neutral" size="small">
            {activity.source}
          </Badge>
          <Badge color={getStatusColor(activity.status)} size="small">
            {activity.status}
          </Badge>
          <Link href={getActionUrl(activity.action)} style={{ textDecoration: 'none' }}>
            <Button variant="tertiary" size="xsmall" icon={ChevronRightIcon} iconPosition="right">
              {activity.action}
            </Button>
          </Link>
        </Box>
      ))}
      
      <Box marginTop="spacing.3">
        <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="small" isFullWidth icon={RefreshIcon} iconPosition="left">
            View Full Audit Trail
          </Button>
        </Link>
      </Box>
    </Box>
  );
}