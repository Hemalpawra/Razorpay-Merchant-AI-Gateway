'use client';

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  TextInput,
  Alert,
  Spinner,
  PackageIcon,
  CheckCircleIcon,
} from '@razorpay/blade/components';
import { useRouter } from 'next/navigation';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'verified'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, phone, email }),
      });

      const data = await res.json();

      if (res.ok && data.order) {
        // Navigate to track/[orderId] with verified order data
        router.push(`/store/track/${data.order.id}?verified=true`);
      } else {
        setError(data.error || 'Verification failed');
        setStatus('error');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setStatus('error');
    }
  };

  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6" maxWidth="500px" marginX="auto">
      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap="spacing.3">
        <PackageIcon size="xlarge" color="interactive.icon.primary.normal" />
        <Heading size="2xlarge" weight="semibold">Track Your Order</Heading>
<Text size="medium" color="surface.text.gray.muted">
            Enter your order details to view tracking information
          </Text>
        </Box>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.4">
              <form onSubmit={handleSubmit}>
                <TextInput
                  label="Order ID"
                  value={orderId}
                  onChange={({ value }) => setOrderId(value || '')}
                  placeholder="ORD-12345"
                  isRequired
                  isDisabled={status === 'loading'}
                />
            <TextInput
              label="Mobile Number"
              value={phone}
              onChange={({ value }) => setPhone(value || '')}
              placeholder="9876543210"
              isRequired
              isDisabled={status === 'loading'}
            />
            <TextInput
              label="Email Address"
              value={email}
              onChange={({ value }) => setEmail(value || '')}
              placeholder="customer@example.com"
              type="email"
              isRequired
              isDisabled={status === 'loading'}
            />

            {error && (
              <Alert color="negative" title="Verification Failed" description={error} />
            )}

            <Button
              variant="primary"
              isFullWidth
              isLoading={status === 'loading'}
              isDisabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Spinner accessibilityLabel="Verifying" size="medium" />
                  Verifying...
                </>
              ) : (
                'Track Order'
              )}
            </Button>
</form>
            </Box>
          </CardBody>
      </Card>

      <Text size="small" color="surface.text.gray.muted" textAlign="center">
        Can't find your order? Check your email for the order confirmation.
      </Text>
    </Box>
  );
}