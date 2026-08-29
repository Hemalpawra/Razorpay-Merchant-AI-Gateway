"use client";

import React, { useState, useEffect } from 'react';
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
  Alert,
  TextInput,
  CheckCircleIcon,
  RupeeIcon,
} from '@razorpay/blade/components';

interface RefundDrawerProps {
  order: {
    id: string;
    amount: number;
    status: string;
    customerName: string;
  };
  onClose: () => void;
  onRefundComplete?: () => void;
}

export function RefundDrawer({ order, onClose, onRefundComplete }: RefundDrawerProps) {
  const [refundAmount, setRefundAmount] = useState(order.amount.toString());
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [refundHistory, setRefundHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ refundId: string; amount: number } | null>(null);

  useEffect(() => {
    fetchRefundHistory();
  }, []);

  const fetchRefundHistory = async () => {
    try {
      const res = await fetch(`/api/refund?order_id=${order.id}`);
      const data = await res.json();
      if (data.refunds) {
        setRefundHistory(data.refunds);
      }
    } catch (err) {
      console.error('Error fetching refund history:', err);
    }
  };

  const handleRefund = async () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      setError('Please enter a valid refund amount');
      return;
    }
    if (parseFloat(refundAmount) > order.amount) {
      setError('Refund amount cannot exceed order amount');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for the refund');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          type: 'refund',
          amount: parseFloat(refundAmount),
          reason
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess({ refundId: data.refund_id, amount: data.amount });
        await fetchRefundHistory();
        if (onRefundComplete) onRefundComplete();
      } else {
        setError(data.error || 'Failed to process refund');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process refund');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box
      position="fixed"
      top="56px"
      right="spacing.0"
      width={{ base: '100%', m: '480px' }}
      height="calc(100vh - 56px)"
      backgroundColor="surface.background.gray.intense"
      borderLeftWidth="thin"
      borderLeftColor="surface.border.gray.muted"
      padding="spacing.6"
      display="flex"
      flexDirection="column"
      zIndex={100}
      overflow="auto"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.5">
        <Box display="flex" alignItems="center" gap="spacing.2">
          <Heading size="medium" weight="semibold">Refund Order</Heading>
          <Badge color="negative" size="small">Action</Badge>
        </Box>
        <IconButton icon={CloseIcon} accessibilityLabel="Close drawer" size="medium" onClick={onClose} />
      </Box>

      {success && (
        <Alert
          color="positive"
          title="Refund Processed Successfully"
          description={`Refund ID: ${success.refundId} for ₹${success.amount} has been processed.`}
          marginBottom="spacing.4"
        />
      )}

      {error && (
        <Alert
          color="negative"
          title="Error"
          description={error}
          marginBottom="spacing.4"
        />
      )}

      <Card elevation="none" backgroundColor="surface.background.gray.subtle" marginBottom="spacing.4">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.2">
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">ORDER DETAILS</Text>
            <Text size="small" weight="semibold">{order.id}</Text>
            <Text size="small" color="surface.text.gray.subtle">{order.customerName}</Text>
            <Box display="flex" alignItems="center" gap="spacing.2" marginTop="spacing.1">
              <RupeeIcon size="small" />
              <Text size="medium" weight="semibold">₹{order.amount.toLocaleString('en-IN')}</Text>
            </Box>
            <Badge color="neutral" size="small" alignSelf="flex-start">{order.status}</Badge>
          </Box>
        </CardBody>
      </Card>

      {!success && (
        <Box display="flex" flexDirection="column" gap="spacing.3" marginBottom="spacing.4">
          <TextInput
            label="Refund Amount"
            value={refundAmount}
            onChange={({ value }) => setRefundAmount(value || '')}
            placeholder="0.00"
          />
          <Text size="xsmall" color="surface.text.gray.muted" marginTop="spacing.1">
            Maximum: ₹{order.amount.toLocaleString('en-IN')}
          </Text>
          
          <TextInput
            label="Reason for Refund"
            value={reason}
            onChange={({ value }) => setReason(value || '')}
            placeholder="e.g., Customer requested cancellation"
          />

          <Button
            variant="primary"
            onClick={handleRefund}
            isDisabled={isProcessing}
            isLoading={isProcessing}
            isFullWidth
          >
            {isProcessing ? 'Processing Refund...' : 'Process Refund'}
          </Button>
        </Box>
      )}

      {refundHistory.length > 0 && (
        <Box>
          <Text size="small" weight="semibold" marginBottom="spacing.2">
            Refund History
          </Text>
          <Box display="flex" flexDirection="column" gap="spacing.2">
            {refundHistory.map((refund) => (
              <Card key={refund.id} elevation="none" backgroundColor="surface.background.gray.subtle">
                <CardBody>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Text size="small" weight="semibold">₹{Number(refund.amount).toLocaleString('en-IN')}</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">
                        {new Date(refund.processed_at).toLocaleString()}
                      </Text>
                      {refund.reason && (
                        <Text size="xsmall" color="surface.text.gray.subtle" marginTop="spacing.1">
                          {refund.reason}
                        </Text>
                      )}
                    </Box>
                    <Badge color="positive" size="small">
                      <CheckCircleIcon size="small" /> Processed
                    </Badge>
                  </Box>
                </CardBody>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      <Box marginTop="auto" display="flex" gap="spacing.3">
        <Button variant="tertiary" onClick={onClose} isFullWidth>
          {success ? 'Close' : 'Cancel'}
        </Button>
      </Box>
    </Box>
  );
}