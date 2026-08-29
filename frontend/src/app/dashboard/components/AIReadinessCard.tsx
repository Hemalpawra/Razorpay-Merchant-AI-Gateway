"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Badge,
  Heading,
  CheckCircleIcon,
  AlertCircleIcon,
  SparklesIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

interface AIReadiness {
  ready: boolean;
  activeConversations: number;
  pendingActions: number;
  lastChecked: string;
}

export function AIReadinessCard() {
  const [readiness, setReadiness] = useState<AIReadiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReadiness();
  }, []);

  const fetchReadiness = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard?type=ai-readiness');
      const data = await res.json();
      if (data && !data.error) {
        setReadiness(data);
      }
    } catch (err) {
      console.error('Error fetching AI readiness:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box padding="spacing.4">
        <Text size="small" color="surface.text.gray.muted">Loading...</Text>
      </Box>
    );
  }

  if (!readiness) {
    return null;
  }

  const checks: Array<{
    label: string;
    status: 'positive' | 'negative' | 'notice' | 'information';
    text: string;
  }> = [
    {
      label: 'System Status',
      status: readiness.ready ? 'positive' : 'negative',
      text: readiness.ready ? 'AI Agent Online' : 'AI Agent Offline'
    },
    {
      label: 'Active Conversations',
      status: 'information',
      text: `${readiness.activeConversations} live now`
    },
    {
      label: 'Pending Actions',
      status: readiness.pendingActions > 0 ? 'notice' : 'positive',
      text: `${readiness.pendingActions} require attention`
    }
  ];

  return (
    <Box>
      <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
        <SparklesIcon size="medium" color="interactive.icon.primary.normal" />
        <Heading size="small" weight="semibold">
          AI Readiness
        </Heading>
        <Badge color={readiness.ready ? 'positive' : 'negative'} size="small">
          {readiness.ready ? 'Ready' : 'Offline'}
        </Badge>
      </Box>
      
      <Box display="flex" flexDirection="column" gap="spacing.2">
        {checks.map((check) => (
          <Box
            key={check.label}
            display="flex"
            alignItems="center"
            gap="spacing.2"
            padding="spacing.2"
            backgroundColor="surface.background.gray.subtle"
            borderRadius="small"
          >
            <Box>
              {check.status === 'positive' ? (
                <CheckCircleIcon size="small" color="feedback.icon.positive.intense" />
              ) : check.status === 'negative' ? (
                <AlertCircleIcon size="small" color="feedback.icon.negative.intense" />
              ) : check.status === 'notice' ? (
                <AlertCircleIcon size="small" color="feedback.icon.notice.intense" />
              ) : (
                <SparklesIcon size="small" color="feedback.icon.information.intense" />
              )}
            </Box>
            <Box flex={1}>
              <Text size="xsmall" color="surface.text.gray.muted">
                {check.label}
              </Text>
              <Text size="small" weight="medium">
                {check.text}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
      
      <Box marginTop="spacing.3">
        <Link href="/dashboard/ai-agent" style={{ textDecoration: 'none' }}>
          <Text size="xsmall" color="interactive.text.primary.normal">
            View AI Agent →
          </Text>
        </Link>
      </Box>
    </Box>
  );
}