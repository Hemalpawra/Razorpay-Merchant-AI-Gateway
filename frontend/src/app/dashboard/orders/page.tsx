"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  IconButton,
  TextInput,
  SelectInput,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  DownloadIcon,
  FileTextIcon,
  CloseIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  SparklesIcon,
  CopyIcon,
  ChevronRightIcon,
  RefreshIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  PackageIcon,
  AlertTriangleIcon,
  Alert
} from "@razorpay/blade/components";
import { SourceBadge } from '../components/SourceBadge';
import { RefundDrawer } from '../components/RefundDrawer';
import { TrackingTimeline } from '../components/TrackingTimeline';
import Link from "next/link";

export type PaymentStatus =
  "Paid" | "Pending" | "Failed" | "Refunded" | "Cancelled";
export type OrderStatus =
  | "Completed"
  | "Processing"
  | "Pending Payment"
  | "Failed"
  | "Refunded"
  | "Cancelled";

export interface OrderItem {
  id: string;
  sessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  source: string;
  product: string;
  amount: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  invoiceId: string;
  razorpayOrderId: string;
  createdAt: string;
  rawSessionId?: string | null;
  rawOrder?: any;
  refundStatus?: string;
  refundId?: string;
}

const paymentStatusConfig: Record<
  PaymentStatus,
  { color: "positive" | "negative" | "notice" | "neutral"; label: string }
> = {
  Paid: { color: "positive", label: "Paid" },
  Pending: { color: "notice", label: "Pending" },
  Failed: { color: "negative", label: "Failed" },
  Refunded: { color: "neutral", label: "Refunded" },
  Cancelled: { color: "neutral", label: "Cancelled" },
};

function OrderDetailDrawer({
  order,
  onClose,
  onRefund,
  onRetry,
}: {
  order: OrderItem;
  onClose: () => void;
  onRefund: () => void;
  onRetry: () => void;
}) {
  const payCfg = paymentStatusConfig[order.paymentStatus];

  // Calculate tax/shipping (mocked for demo - 18% GST, free shipping over 500)
  const baseAmount = parseFloat(order.amount.replace(/[^0-9.]/g, "")) || 0;
  const tax = Math.round(baseAmount * 0.18);
  const shipping = baseAmount > 500 ? 0 : 50;
  const subtotal = baseAmount - tax - shipping;

  return (
    <Box
      position="fixed"
      top="56px"
      right="spacing.0"
      width={{ base: "100%", m: "480px" }}
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="spacing.5"
      >
        <Box display="flex" alignItems="center" gap="spacing.2">
          <Heading size="medium" weight="semibold">
            Order {order.id}
          </Heading>
          <Badge color={payCfg.color} size="small">
            {payCfg.label}
          </Badge>
          {order.refundStatus && (
            <Badge color="negative" size="small">
              {order.refundStatus}
            </Badge>
          )}
        </Box>
        <IconButton
          icon={CloseIcon}
          accessibilityLabel="Close drawer"
          size="medium"
          onClick={onClose}
        />
      </Box>

      {/* Tracking Timeline */}
      {order.paymentStatus === 'Paid' && (
        <Card
          elevation="none"
          backgroundColor="surface.background.gray.subtle"
          marginBottom="spacing.5"
        >
          <CardBody>
            <TrackingTimeline status={order.orderStatus === 'Completed' ? 'delivered' : 'preparing'} />
          </CardBody>
        </Card>
      )}

      <Card
        elevation="none"
        backgroundColor="surface.background.gray.subtle"
        marginBottom="spacing.5"
      >
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Text
              size="small"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              Order Summary
            </Text>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.3">
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Order ID
                </Text>
                <Text size="small" weight="semibold" marginTop="spacing.1">
                  {order.id}
                </Text>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Session ID
                </Text>
                <Text
                  size="small"
                  weight="semibold"
                  color="interactive.text.primary.normal"
                >
                  {order.sessionId}
                </Text>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Source
                </Text>
                <Box marginTop="spacing.1">
                  <SourceBadge source={order.source} />
                </Box>
              </Box>
              <Box>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Created At
                </Text>
                <Text size="small" weight="semibold" marginTop="spacing.1">
                  {order.createdAt}
                </Text>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Amount Breakdown */}
      <Card
        elevation="none"
        backgroundColor="surface.background.gray.subtle"
        marginBottom="spacing.5"
      >
        <CardBody>
          <Text size="small" weight="semibold" color="surface.text.gray.muted" marginBottom="spacing.2">
            Amount Breakdown
          </Text>
          <Box display="flex" flexDirection="column" gap="spacing.1">
            <Box display="flex" justifyContent="space-between">
              <Text size="xsmall" color="surface.text.gray.subtle">Subtotal</Text>
              <Text size="xsmall" weight="medium">₹{subtotal.toLocaleString('en-IN')}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text size="xsmall" color="surface.text.gray.subtle">Tax (18% GST)</Text>
              <Text size="xsmall" weight="medium">₹{tax.toLocaleString('en-IN')}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text size="xsmall" color="surface.text.gray.subtle">Shipping</Text>
              <Text size="xsmall" weight="medium">
                {shipping === 0 ? <span style={{ color: 'green' }}>FREE</span> : `₹${shipping.toLocaleString('en-IN')}`}
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" paddingTop="spacing.2" borderTopWidth="thin" borderTopColor="surface.border.gray.muted" marginTop="spacing.1">
              <Text size="small" weight="semibold">Total</Text>
              <Text size="small" weight="semibold">{order.amount}</Text>
            </Box>
          </Box>
        </CardBody>
      </Card>

      <Card
        elevation="none"
        backgroundColor="surface.background.gray.subtle"
        marginBottom="spacing.5"
      >
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.2">
            <Text
              size="small"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              Customer Details
            </Text>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Text size="small" weight="semibold">
                {order.customerName}
              </Text>
              <Text size="xsmall" color="surface.text.gray.muted">
                {order.customerEmail}
              </Text>
              <Text size="xsmall" color="surface.text.gray.muted">
                {order.customerPhone}
              </Text>
            </Box>
          </Box>
        </CardBody>
      </Card>

      <Card
        elevation="none"
        backgroundColor="surface.background.gray.subtle"
        marginBottom="spacing.5"
      >
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.2">
            <Text
              size="small"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              Razorpay Details
            </Text>
            <Text size="xsmall" color="surface.text.gray.muted">
              Order ID: {order.razorpayOrderId}
            </Text>
            <Text size="xsmall" color="surface.text.gray.muted">
              Invoice ID: {order.invoiceId}
            </Text>
          </Box>
        </CardBody>
      </Card>

      <Card
        elevation="none"
        backgroundColor="surface.background.gray.subtle"
        marginBottom="spacing.5"
      >
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Text
              size="small"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              Actions
            </Text>
            
            {/* Refund button - only for paid orders */}
            {order.paymentStatus === 'Paid' && order.refundStatus !== 'processed' && (
              <Button 
                variant="tertiary" 
                size="small" 
                icon={RefreshIcon} 
                iconPosition="left" 
                isFullWidth
                onClick={onRefund}
              >
                Refund Order
              </Button>
            )}
            
            {/* Retry payment - for pending/failed */}
            {(order.paymentStatus === 'Pending' || order.paymentStatus === 'Failed') && (
              <Button 
                variant="primary" 
                size="small" 
                icon={RefreshIcon} 
                iconPosition="left" 
                isFullWidth
                onClick={onRetry}
              >
                Retry Payment
              </Button>
            )}

            {/* Refunded badge */}
            {order.refundStatus === 'processed' && (
              <Alert
                color="positive"
                title="Refund Processed"
                description={`This order has been refunded. Refund ID: ${order.refundId || 'N/A'}`}
                icon={CheckCircleIcon}
              />
            )}
            
            <Link href={`/store/order-success/${order.rawOrder?.id ?? order.id}`} passHref legacyBehavior>
              <Button variant="secondary" size="small" icon={FileTextIcon} iconPosition="left" isFullWidth>
                View Invoice &amp; Order Summary
              </Button>
            </Link>
            {order.rawSessionId && (
              <Link href={`/dashboard/ai-agent?session=${order.rawSessionId}`} passHref legacyBehavior>
                <Button variant="secondary" size="small" icon={SparklesIcon} iconPosition="left" isFullWidth>
                  Open Related Conversation
                </Button>
              </Link>
            )}
            <Link href={`/store/track/${order.rawOrder?.id ?? order.id}`} passHref legacyBehavior>
              <Button variant="secondary" size="small" icon={ShoppingBagIcon} iconPosition="left" isFullWidth>
                Track Shipment
              </Button>
            </Link>
            <Link href="/dashboard/audit-trail" passHref legacyBehavior>
              <Button variant="secondary" size="small" icon={ClockIcon} iconPosition="left" isFullWidth>
                View Audit Trail
              </Button>
            </Link>
          </Box>
        </CardBody>
      </Card>

      <Box marginTop="auto" display="flex" gap="spacing.3">
        <Button variant="tertiary" onClick={onClose} isFullWidth>
          Close
        </Button>
      </Box>
    </Box>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <Box padding="spacing.8" backgroundColor="surface.background.gray.subtle" minHeight="100%">
          <Text size="small" color="surface.text.gray.muted">Loading orders...</Text>
        </Box>
      }
    >
      <OrdersPageInner />
    </Suspense>
  );
}

function OrdersPageInner() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showRefundDrawer, setShowRefundDrawer] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        const mapped: OrderItem[] = data.orders.map((o: any) => {
          const cust = Array.isArray(o.customer_details)
            ? o.customer_details[0]
            : o.customer_details;
          const session = Array.isArray(o.buyer_sessions)
            ? o.buyer_sessions[0]
            : o.buyer_sessions;
          const source = session?.external_ai_name
            ? session.external_ai_name
            : o.session_id
              ? "Merchant AI"
              : "Human Customer";
          const isPaid = o.status === "paid";
          return {
            id: o.id.substring(0, 8).toUpperCase(),
            sessionId: o.session_id
              ? o.session_id.substring(0, 8).toUpperCase()
              : "DIRECT",
            customerName: cust?.full_name || session?.external_ai_name || "Customer",
            customerEmail: cust?.email || "customer@example.com",
            customerPhone: cust?.phone || "Not provided",
            source,
            product:
              Array.isArray(o.order_items) && o.order_items.length
                ? `${o.order_items[0].name}${o.order_items.length > 1 ? ` + ${o.order_items.length - 1} more` : ""}`
                : "Catalog Order",
            amount: `₹${Number(o.amount).toLocaleString("en-IN")}`,
            paymentStatus: isPaid
              ? "Paid"
              : o.status === "failed"
                ? "Failed"
                : o.status === "cancelled"
                  ? "Cancelled"
                  : "Pending",
            orderStatus: isPaid
              ? "Completed"
              : o.status === "failed"
                ? "Failed"
                : o.status === "cancelled"
                  ? "Cancelled"
                  : "Pending Payment",
            invoiceId:
              Array.isArray(o.invoices) && o.invoices[0]?.invoice_number
                ? o.invoices[0].invoice_number
                : "Not issued",
            razorpayOrderId: o.razorpay_order_id || "order_rzp_mock",
            createdAt: new Date(o.created_at).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            }),
            rawSessionId: o.session_id,
            rawOrder: o,
            refundStatus: o.refund_status,
            refundId: o.refund_id,
          };
        });
        setOrders(mapped);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const searchParams = useSearchParams();
  useEffect(() => {
    const target = searchParams.get('order');
    if (!target || orders.length === 0) return;
    const match = orders.find(
      (o) => o.rawOrder?.id === target || o.razorpayOrderId === target,
    );
    if (match) setSelectedOrder(match);
  }, [searchParams, orders]);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce(
      (sum, o) => sum + parseFloat(o.amount.replace(/[^0-9.]/g, "") || "0"),
      0,
    );

  const handleRefund = (orderId: string) => {
    setRefundOrderId(orderId);
    setShowRefundDrawer(true);
  };

  const handleRetry = async (orderId: string) => {
    try {
      const res = await fetch('/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          type: 'retry'
        })
      });
      const data = await res.json();
      if (data.payment_link) {
        alert(`Payment link generated: ${data.payment_link}\n\nIn production, this would be sent to the customer via email/SMS.`);
      }
      fetchOrders();
    } catch (err: any) {
      alert('Failed to retry payment: ' + err.message);
    }
  };

  return (
    <Box
      padding="spacing.8"
      backgroundColor="surface.background.gray.subtle"
      minHeight="100%"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="spacing.6"
      >
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">
            Orders
          </Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Track all orders created by customers and AI conversations.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button
            variant="primary"
            icon={RefreshIcon}
            iconPosition="left"
            onClick={fetchOrders}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          m: "repeat(2,1fr)",
          l: "repeat(5,1fr)",
        }}
        gap="spacing.4"
        marginBottom="spacing.6"
      >
        <Card
          elevation="none"
          backgroundColor="surface.background.gray.intense"
        >
          <CardBody>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              Total Orders
            </Text>
            <Heading size="xlarge">{orders.length}</Heading>
          </CardBody>
        </Card>
        <Card
          elevation="none"
          backgroundColor="surface.background.gray.intense"
        >
          <CardBody>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              Paid Orders
            </Text>
            <Heading size="xlarge">
              {orders.filter((o) => o.paymentStatus === "Paid").length}
            </Heading>
          </CardBody>
        </Card>
        <Card
          elevation="none"
          backgroundColor="surface.background.gray.intense"
        >
          <CardBody>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              Pending Orders
            </Text>
            <Heading size="xlarge">
              {orders.filter((o) => o.paymentStatus === "Pending").length}
            </Heading>
          </CardBody>
        </Card>
        <Card
          elevation="none"
          backgroundColor="surface.background.gray.intense"
        >
          <CardBody>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              Failed Orders
            </Text>
            <Heading size="xlarge">
              {orders.filter((o) => o.paymentStatus === "Failed" || o.orderStatus === "Failed").length}
            </Heading>
          </CardBody>
        </Card>
        <Card
          elevation="none"
          backgroundColor="surface.background.gray.intense"
        >
          <CardBody>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              Total Revenue
            </Text>
            <Heading size="xlarge">{`₹${totalRevenue.toLocaleString("en-IN")}`}</Heading>
          </CardBody>
        </Card>
      </Box>

      {/* Orders Table */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box overflowX="auto">
          <Box
            display="grid"
            minWidth="900px"
            gridTemplateColumns="0.8fr 1fr 0.8fr 1.4fr 0.8fr 0.8fr 0.9fr 1fr auto"
            gap="spacing.4"
            paddingY="spacing.3"
            paddingX="spacing.4"
            backgroundColor="surface.background.gray.subtle"
            borderRadius="small"
            marginBottom="spacing.2"
          >
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              ORDER ID
            </Text>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              CUSTOMER
            </Text>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              SOURCE
            </Text>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              PRODUCT
            </Text>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              AMOUNT
            </Text>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              PAYMENT
            </Text>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              ORDER STATUS
            </Text>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
            >
              DATE
            </Text>
            <Text
              size="xsmall"
              weight="semibold"
              color="surface.text.gray.muted"
              textAlign="right"
            >
              ACTIONS
            </Text>
          </Box>

          {isLoading ? (
            <Box padding="spacing.4">
              <Text size="small" color="surface.text.gray.muted">
                Loading orders from DB...
              </Text>
            </Box>
          ) : orders.length === 0 ? (
            <Box padding="spacing.4">
              <Text size="small" color="surface.text.gray.muted">
                No orders created yet.
              </Text>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" minWidth="900px">
              {orders.map((order, index) => (
                <Box
                  key={order.id}
                  paddingY="spacing.4"
                  paddingX="spacing.4"
                  borderBottomWidth={
                    index !== orders.length - 1 ? "thin" : "none"
                  }
                  borderBottomColor="surface.border.gray.muted"
                  display="grid"
                  gridTemplateColumns="0.8fr 1fr 0.8fr 1.4fr 0.8fr 0.8fr 0.9fr 1fr auto"
                  gap="spacing.4"
                  alignItems="center"
                >
                  <Text
                    weight="semibold"
                    size="small"
                    color="surface.text.primary.normal"
                  >
                    {order.id}
                  </Text>
                  <Box display="flex" flexDirection="column" gap="spacing.1">
                    <Text size="small" weight="semibold">
                      {order.customerName}
                    </Text>
                    <Text size="xsmall" color="surface.text.gray.subtle">
                      Session: {order.sessionId}
                    </Text>
                  </Box>
                  <SourceBadge source={order.source} />
                  <Text size="xsmall" color="surface.text.gray.subtle">
                    {order.product}
                  </Text>
                  <Text size="small" weight="semibold">
                    {order.amount}
                  </Text>
                  <Box>
                    <Badge
                      color={paymentStatusConfig[order.paymentStatus].color}
                      size="small"
                    >
                      {paymentStatusConfig[order.paymentStatus].label}
                    </Badge>
                  </Box>
                  <Box>
                    <Badge
                      color={
                        order.orderStatus === "Completed"
                          ? "positive"
                          : order.orderStatus === "Failed"
                            ? "negative"
                            : order.orderStatus === "Cancelled"
                              ? "neutral"
                              : "notice"
                      }
                      size="small"
                    >
                      {order.orderStatus}
                    </Badge>
                  </Box>
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {order.createdAt}
                  </Text>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="spacing.2"
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          </Box>
        </CardBody>
      </Card>

      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefund={() => handleRefund(selectedOrder.id)}
          onRetry={() => handleRetry(selectedOrder.id)}
        />
      )}

      {showRefundDrawer && refundOrderId && (
        <RefundDrawer
          order={{
            id: refundOrderId,
            amount: parseFloat(selectedOrder?.amount.replace(/[^0-9.]/g, '') || '0'),
            status: selectedOrder?.paymentStatus || 'Pending',
            customerName: selectedOrder?.customerName || ''
          }}
          onClose={() => {
            setShowRefundDrawer(false);
            setRefundOrderId(null);
            fetchOrders();
          }}
        />
      )}
    </Box>
  );
}
