'use client';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Amount,
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  Divider,
  Spinner,
  CheckCircleIcon,
  DownloadIcon,
  PackageIcon,
  FileTextIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type OrderItem = {
  id: string;
  sku: string;
  name: string;
  image_url: string | null;
  unit_price: number;
  qty: number;
  line_total: number;
};

type Invoice = {
  invoice_number: string;
  grand_total: number;
};

type CustomerDetail = {
  full_name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
};

type OrderRecord = {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  currency: string;
  status: string;
  order_items: OrderItem[];
  invoices: Invoice[];
  customer_details: CustomerDetail[];
  refund_status?: string | null;
  refund_amount?: number | null;
  refunded_at?: string | null;
  tracking_stage?: string | null;
};

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || '';

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }
    fetch(`/api/orders?order_id=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.orders || data.orders.length === 0) {
          throw new Error(data.error || 'Order not found');
        }
        setOrder(data.orders[0]);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [orderId]);

  const handlePrintInvoice = () => {
    if (!order || !order.invoices?.[0]) return;
    const invoice = order.invoices[0];
    const customer = order.customer_details?.[0];
    const items = order.order_items ?? [];

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; color: #1a1a1a; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #0066FF; }
    .logo { font-size: 24px; font-weight: bold; color: #0066FF; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { margin: 0; font-size: 28px; color: #1a1a1a; }
    .invoice-title p { margin: 5px 0; color: #666; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .detail-box h3 { margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; }
    .detail-box p { margin: 5px 0; font-size: 14px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .items-table th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: 600; border-bottom: 1px solid #ddd; }
    .items-table td { padding: 12px; border-bottom: 1px solid #eee; }
    .items-table .text-right { text-align: right; }
    .totals { width: 300px; margin-left: auto; }
    .totals .row { display: flex; justify-content: space-between; padding: 8px 0; }
    .totals .row.total { font-weight: bold; font-size: 16px; border-top: 2px solid #0066FF; padding-top: 15px; margin-top: 10px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ElectroStore</div>
      <div class="invoice-title">
        <h1>Tax Invoice</h1>
        <p>Invoice #: ${invoice.invoice_number}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>

    <div class="details-grid">
      <div class="detail-box">
        <h3>Bill To</h3>
        <p><strong>${customer?.full_name || 'Customer'}</strong></p>
        <p>${customer?.email || ''}</p>
        <p>${customer?.phone || ''}</p>
        <p>${customer?.line1 || ''}</p>
        <p>${customer?.city || ''}, ${customer?.state || ''} ${customer?.pincode || ''}</p>
      </div>
      <div class="detail-box">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Razorpay Order:</strong> ${order.razorpay_order_id}</p>
        <p><strong>Payment ID:</strong> ${order.razorpay_payment_id || 'N/A'}</p>
        <p><strong>Payment Status:</strong> ${order.status === 'paid' ? 'Paid' : order.status}</p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td class="text-right">${item.qty}</td>
            <td class="text-right">₹${item.unit_price.toLocaleString('en-IN')}</td>
            <td class="text-right">₹${item.line_total.toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="row">
        <span>Subtotal</span>
        <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div class="row">
        <span>Shipping</span>
        <span>₹${order.shipping_amount.toLocaleString('en-IN')}</span>
      </div>
      <div class="row">
        <span>Tax (GST)</span>
        <span>₹${order.tax_amount.toLocaleString('en-IN')}</span>
      </div>
      <div class="row total">
        <span>Grand Total</span>
        <span>₹${order.amount.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for shopping with ElectroStore!</p>
      <p>This is a computer-generated invoice and does not require a signature.</p>
    </div>
  </div>
  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (status === 'loading') {
    return (
      <Box padding="spacing.8" display="flex" justifyContent="center">
        <Spinner accessibilityLabel="Loading order" />
      </Box>
    );
  }

  if (status === 'error' || !order) {
    return (
      <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.4" maxWidth="700px" marginX="auto">
        <Alert
          color="negative"
          isFullWidth
          title="Order not found"
          description="We couldn't find this order. If you just completed a payment, please check your email for a confirmation, or contact support."
        />
        <Link href="/store" style={{ textDecoration: 'none' }}>
          <Button variant="secondary">Back to Store</Button>
        </Link>
      </Box>
    );
  }

  const invoice = order.invoices?.[0];
  const items = order.order_items ?? [];
  const isPaid = order.status === 'paid';

  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6" maxWidth="800px" marginX="auto">
      {/* Success / Pending Hero */}
      <Box backgroundColor="surface.background.primary.subtle" borderRadius="medium">
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" padding="spacing.6" gap="spacing.3">
            <Box
              width="48px" height="48px" borderRadius="round"
              backgroundColor="surface.background.sea.subtle"
              display="flex" alignItems="center" justifyContent="center"
            >
              <CheckCircleIcon size="large" color="interactive.icon.positive.normal" />
            </Box>

            <Heading size="2xlarge" weight="semibold">
              {isPaid ? 'Payment Successful!' : 'Order Received'}
            </Heading>
            <Text size="medium" color="surface.text.gray.muted">
              {isPaid
                ? 'Thank you! Your payment has been verified and your order is confirmed.'
                : 'Your order is being processed. We will confirm once payment is verified.'}
            </Text>

            <Badge color={isPaid ? 'positive' : 'information'} size="medium">
              {isPaid ? 'Razorpay Payment Verified' : order.status}
            </Badge>

            {order.refund_status === 'processed' && order.refund_amount && (
              <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.2" marginTop="spacing.2">
                <Badge color="notice" size="medium">
                  Refund Processed
                </Badge>
                <Text size="small" color="surface.text.gray.muted">
                  ₹{Number(order.refund_amount).toLocaleString('en-IN')} refunded on{' '}
                  {order.refunded_at ? new Date(order.refunded_at).toLocaleDateString() : 'N/A'}
                </Text>
              </Box>
            )}
          </Box>
        </Box>

      {/* Details Grid */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.6">
        {/* Order Details */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Heading size="medium" weight="semibold">Order Summary</Heading>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Order ID</Text>
                <Text size="small" weight="semibold">{order.id}</Text>
              </Box>

              <Divider />

              {items.map((item) => (
                <Box key={item.id} display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">{`${item.name} x${item.qty}`}</Text>
                  <Amount value={item.line_total} size="small" suffix="none" />
                </Box>
              ))}

              <Divider />

              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Subtotal</Text>
                <Amount value={order.subtotal} size="small" suffix="none" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Shipping</Text>
                <Amount value={order.shipping_amount} size="small" suffix="none" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.muted">Tax (GST)</Text>
                <Amount value={order.tax_amount} size="small" suffix="none" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" weight="semibold">Amount Paid</Text>
                <Amount value={order.amount} size="small" weight="semibold" color="interactive.text.primary.normal" suffix="none" />
              </Box>
<Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">Payment Method</Text>
                  <Text size="small" weight="semibold">Razorpay</Text>
                </Box>

                {order.refund_status === 'processed' && order.refund_amount && (
                  <>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Text size="small" color="surface.text.gray.muted">Refund Status</Text>
                      <Badge color="notice" size="small">Processed</Badge>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Text size="small" color="surface.text.gray.muted">Refund Amount</Text>
                      <Amount value={Number(order.refund_amount)} size="small" suffix="none" />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Text size="small" color="surface.text.gray.muted">Refunded At</Text>
                      <Text size="small" color="surface.text.gray.muted">
                        {order.refunded_at ? new Date(order.refunded_at).toLocaleString() : 'N/A'}
                      </Text>
                    </Box>
                  </>
                )}

              {invoice && (
                <Box borderTopWidth="thin" borderTopColor="surface.border.gray.muted" paddingTop="spacing.3" display="flex" gap="spacing.2">
                  <Button variant="secondary" isFullWidth icon={DownloadIcon} iconPosition="left" isDisabled>
                    {`Tax Invoice (${invoice.invoice_number})`}
                  </Button>
                  <Button variant="tertiary" isFullWidth icon={FileTextIcon} iconPosition="left" onClick={handlePrintInvoice}>
                    Print / Save PDF
                  </Button>
                </Box>
              )}
            </Box>
          </CardBody>
        </Card>

        {/* Shipment Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Heading size="medium" weight="semibold">Shipment</Heading>
              <Text size="xsmall" color="surface.text.gray.muted">
                {isPaid
                  ? 'Your order has been confirmed and is being prepared for dispatch.'
                  : 'Shipment tracking will be available once payment is confirmed.'}
              </Text>

              <Link href={`/store/track/${order.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" isFullWidth icon={PackageIcon} iconPosition="left">
                  Track Shipment
                </Button>
              </Link>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Navigation Buttons */}
      <Box display="flex" justifyContent="center" gap="spacing.4">
        <Link href="/store" style={{ textDecoration: 'none' }}>
          <Button variant="tertiary">Continue Shopping</Button>
        </Link>
        <Link href="/dashboard/orders" style={{ textDecoration: 'none' }}>
          <Button variant="secondary">View Merchant Dashboard</Button>
        </Link>
      </Box>
    </Box>
  );
}
