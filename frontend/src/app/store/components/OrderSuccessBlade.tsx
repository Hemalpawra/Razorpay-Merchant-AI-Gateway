'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Amount,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  CopyIcon,
  Divider,
  DownloadIcon,
  Heading,
  HeadsetIcon,
  IconButton,
  PackageIcon,
  PrinterIcon,
  RefreshIcon,
  ShieldIcon,
  SparklesIcon,
  Text,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { useAiChat } from "./StoreAiProvider";
import { getProduct } from "@/lib/store/catalog";

const orderItems = [
  { product: getProduct("sony-wh-1000xm5"), qty: 1 },
  { product: getProduct("boat-airdopes-131-pro"), qty: 1 },
  { product: getProduct("jbl-tune-770nc"), qty: 1 },
].filter((x): x is { product: NonNullable<ReturnType<typeof getProduct>>; qty: number } => Boolean(x.product));

export default function OrderSuccessBlade() {
  const { openChat } = useAiChat();
  const router = useRouter();

  const subtotal = orderItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <BladeRoot>
      <Box backgroundColor="surface.background.gray.subtle" paddingX="spacing.7" paddingY="spacing.7">
        <Box maxWidth="900px" margin="auto" display="flex" flexDirection="column" gap="spacing.6">
          {/* Success Banner */}
          <Card elevation="lowRaised" padding="spacing.7">
            <CardBody>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap="spacing.4">
                <Box
                  width="64px"
                  height="64px"
                  borderRadius="max"
                  backgroundColor="feedback.background.positive.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CheckCircleIcon size="large" color="feedback.icon.positive.intense" />
                </Box>

                <Heading size="medium" weight="semibold">
                  Order Confirmed!
                </Heading>
                <Text size="small" color="surface.text.gray.muted">
                  Thank you for your purchase. We have received your order and sent a confirmation to your email.
                </Text>

                <Box display="flex" gap="spacing.3" alignItems="center" backgroundColor="surface.background.gray.intense" padding="spacing.3" borderRadius="medium">
                  <Text size="xsmall" color="surface.text.gray.muted">
                    Order ID:
                  </Text>
                  <Text size="xsmall" weight="semibold">
                    #ORD-2026-87429
                  </Text>
                  <IconButton icon={CopyIcon} accessibilityLabel="Copy order ID" size="medium" onClick={() => {}} />
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* Delivery & Items details */}
          <Card elevation="lowRaised" padding="spacing.7">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.5">
                <Heading size="small" as="h2">
                  Order Details
                </Heading>

                <Box display="flex" flexDirection="row" gap="spacing.6" flexWrap="wrap">
                  <Box flex="1" minWidth="220px">
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Delivery Address
                    </Text>
                    <Text size="small" weight="semibold" marginTop="spacing.1">
                      Hemal Singh
                    </Text>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      12-5-98/A, Road No. 3, Banjara Hills, Hyderabad, Telangana - 500034
                    </Text>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Phone: +91 98765 43210
                    </Text>
                  </Box>

                  <Box flex="1" minWidth="220px">
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Payment Info
                    </Text>
                    <Text size="small" weight="semibold" marginTop="spacing.1">
                      Paid via Razorpay UPI
                    </Text>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Transaction ID: pay_P982341908
                    </Text>
                    <Badge color="positive" size="small">
                      Payment Successful
                    </Badge>
                  </Box>
                </Box>

                <Divider />

                <Text size="small" weight="semibold">
                  Items Purchased ({orderItems.length})
                </Text>

                {orderItems.map(({ product, qty }) => (
                  <Box key={product.slug} display="flex" alignItems="center" gap="spacing.4">
                    <img
                      src={product.img}
                      alt={product.name}
                      style={{ width: "48px", height: "48px", objectFit: "contain" }}
                    />
                    <Box flex="1">
                      <Text size="small" weight="semibold">
                        {product.name}
                      </Text>
                      <Text size="xsmall" color="surface.text.gray.muted">
                        {`Qty: ${qty} · ₹${product.price.toLocaleString("en-IN")} each`}
                      </Text>
                    </Box>
                    <Amount value={product.price * qty} size="small" suffix="none" />
                  </Box>
                ))}

                <Divider />

                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">
                    Subtotal
                  </Text>
                  <Amount value={subtotal} size="small" suffix="none" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">
                    Shipping
                  </Text>
                  <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                    FREE
                  </Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text size="small" color="surface.text.gray.muted">
                    Tax (18% GST)
                  </Text>
                  <Amount value={tax} size="small" suffix="none" />
                </Box>

                <Divider />

                <Box display="flex" justifyContent="space-between">
                  <Text size="medium" weight="semibold">
                    Total Amount Paid
                  </Text>
                  <Amount value={total} size="medium" type="heading" suffix="none" />
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* Next Steps & Actions */}
          <Box display="flex" flexDirection="row" gap="spacing.4" justifyContent="center">
            <Button variant="primary" icon={SparklesIcon} onClick={() => router.push('/store')}>
              Continue Shopping
            </Button>
            <Button variant="secondary" icon={HeadsetIcon} onClick={() => openChat()}>
              Track Order via AI
            </Button>
          </Box>
        </Box>
      </Box>
    </BladeRoot>
  );
}
