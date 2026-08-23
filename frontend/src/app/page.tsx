'use client';

import { Box, Heading, Text, Button, Card, CardBody, Badge, SparklesIcon, ShoppingBagIcon, ShieldIcon } from '@razorpay/blade/components';
import Link from 'next/link';

export default function Home() {
  return (
    <Box minHeight="100vh" backgroundColor="surface.background.gray.subtle" display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding="spacing.8">

      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" padding="spacing.8" gap="spacing.4" maxWidth="600px">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <SparklesIcon size="medium" color="interactive.icon.primary.normal" />
              <Badge color="information" size="medium">Razorpay Buildathon Track 01</Badge>
            </Box>

            <Heading size="2xlarge" weight="semibold">Merchant AI Gateway</Heading>
            <Text size="medium" color="surface.text.gray.muted">
              Enable AI Assistants & Human buyers to transact directly on your store with Razorpay Order Creation, Checkout, Invoicing & Audit Traceability.
            </Text>

            <Box display="flex" flexWrap="wrap" justifyContent="center" gap="spacing.4" marginTop="spacing.4">
              <Link href="/store" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="large" icon={ShoppingBagIcon} iconPosition="left">
                  Customer Store Experience
                </Button>
              </Link>
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="large" icon={ShieldIcon} iconPosition="left">
                  Merchant AI Workspace
                </Button>
              </Link>
            </Box>
          </Box>
        </CardBody>
      </Card>

    </Box>
  );
}
