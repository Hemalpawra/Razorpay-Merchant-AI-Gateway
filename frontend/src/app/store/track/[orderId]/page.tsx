'use client';

import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  // Icons
  PackageIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  FileTextIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function TrackShipmentPage({ params }: { params: { orderId: string } }) {
  const orderId = params?.orderId || 'ORD-10231';

  const steps = [
    { title: 'Preparing Order', desc: 'Item allocated & quality checked at Bengaluru Hub', time: '21 Jun, 10:35 AM', done: true },
    { title: 'Packed', desc: 'Securely packaged with Razorpay AI tamper proof seal', time: '21 Jun, 01:15 PM', done: true },
    { title: 'Shipped', desc: 'Handed over to Express Logistics partner', time: '21 Jun, 04:30 PM', done: true },
    { title: 'Out for Delivery', desc: 'Courier agent assigned for final mile delivery', time: '22 Jun, 09:00 AM (Est.)', done: false },
    { title: 'Delivered', desc: 'Package delivered to customer address', time: '22 Jun, 07:00 PM (Est.)', done: false },
  ];

  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6" maxWidth="800px" marginX="auto">

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Shipment Tracking</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Tracking order <Text as="span" size="small" weight="semibold">{orderId}</Text>
          </Text>
        </Box>
        <Badge color="notice" size="medium">In Transit • Expedited</Badge>
      </Box>

      {/* Simulated Tracking Card */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.6">

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap="spacing.3">
                <PackageIcon size="medium" color="interactive.icon.primary.normal" />
                <Box display="flex" flexDirection="column">
                  <Text size="small" weight="semibold">Asus TUF F15 Gaming Laptop</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">Courier: BlueDart Express • Tracking ID: BD9823145IN</Text>
                </Box>
              </Box>
              <Text size="small" weight="semibold" color="interactive.text.positive.normal">Est. Delivery: Tomorrow</Text>
            </Box>

            {/* Timeline */}
            <Box display="flex" flexDirection="column" gap="spacing.4" paddingLeft="spacing.4" borderLeftWidth="thick" borderLeftColor="surface.border.primary.normal">
              {steps.map((s, idx) => (
                <Box key={idx} display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" gap="spacing.3" alignItems="flex-start">
                    <Box
                      width="16px" height="16px" borderRadius="round"
                      backgroundColor={s.done ? 'surface.background.sea.intense' : 'surface.background.gray.subtle'}
                      marginTop="spacing.1"
                      flexShrink={0}
                    />
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight={s.done ? 'semibold' : 'regular'} color={s.done ? 'surface.text.gray.normal' : 'surface.text.gray.muted'}>
                        {s.title}
                      </Text>
                      <Text size="xsmall" color="surface.text.gray.subtle">{s.desc}</Text>
                    </Box>
                  </Box>
                  <Text size="xsmall" color="surface.text.gray.muted">{s.time}</Text>
                </Box>
              ))}
            </Box>

          </Box>
        </CardBody>
      </Card>

      {/* Audit Log & Admin Navigation */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Link href={`/store/order-success/${orderId}`} style={{ textDecoration: 'none' }}>
          <Button variant="tertiary">Back to Order Confirmation</Button>
        </Link>
        <Link href="/dashboard/audit-trail" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" icon={FileTextIcon} iconPosition="left">
            View Audit Chain for this Shipment
          </Button>
        </Link>
      </Box>

    </Box>
  );
}
