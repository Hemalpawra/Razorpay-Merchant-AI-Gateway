'use client';

import { useMemo, useState } from "react";
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
  ClockIcon,
  Divider,
  Heading,
  HeartIcon,
  IconButton,
  Indicator,
  Link,
  LockIcon,
  MinusIcon,
  PlusIcon,
  ProgressBar,
  RefreshIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingBagIcon,
  Skeleton,
  SparklesIcon,
  TagIcon,
  Text,
  TextInput,
  TrashIcon,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { useAiChat } from "./StoreAiProvider";
import { discountPct, getProduct, type Product } from "@/lib/store/catalog";

type CartLine = { product: Product; qty: number; variant: string };

const initialSlugs: { slug: string; qty: number; variant: string }[] = [
  { slug: "sony-wh-1000xm5", qty: 1, variant: "Color: Black · Over-Ear" },
  { slug: "boat-airdopes-131-pro", qty: 1, variant: "Color: Black" },
  { slug: "jbl-tune-770nc", qty: 1, variant: "Color: Blue" },
];

const COUPONS: Record<string, number> = { ACME1500: 1500, SAVE500: 500 };
const FREE_DELIVERY_THRESHOLD = 1499;

const trust = [
  { icon: ShieldIcon, title: "Secure Payments", sub: "Powered by Razorpay" },
  { icon: RefreshIcon, title: "Easy Returns", sub: "10 days return policy" },
  { icon: ClockIcon, title: "Fast Delivery", sub: "On orders above ₹1,499" },
  { icon: SearchIcon, title: "Order Tracking", sub: "Track your order in real-time" },
];

const aiPrompts = [
  "Is this cart good for office work?",
  "Show me a cheaper option for any item",
  "Should I buy this now or wait?",
];

function SummaryRow({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
      {typeof label === "string" ? (
        <Text size="small" color="surface.text.gray.muted">
          {label}
        </Text>
      ) : (
        label
      )}
      {children}
    </Box>
  );
}

function CartRow({
  line,
  onQty,
  onRemove,
}: {
  line: CartLine;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const { product, qty } = line;
  const off = discountPct(product);

  return (
    <Box display="flex" flexDirection="row" gap="spacing.5" flexWrap="wrap" alignItems="flex-start">
      <Box
        width="112px"
        height="112px"
        borderWidth="thin"
        borderColor="surface.border.gray.muted"
        borderRadius="medium"
        backgroundColor="surface.background.gray.intense"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          style={{ maxWidth: "88px", maxHeight: "88px", objectFit: "contain" }}
        />
      </Box>

      <Box flex="1" minWidth="220px" display="flex" flexDirection="column" gap="spacing.2">
        <Link href={`/store/products/${product.slug}`} size="medium">
          {product.name}
        </Link>
        <Text size="small" color="surface.text.gray.muted">
          {product.subtitle}
        </Text>
        <Text size="xsmall" color="surface.text.gray.muted">
          {line.variant}
        </Text>
        <Box>
          <Indicator color={product.stock === "In stock" ? "positive" : "notice"} size="small">
            {product.stock}
          </Indicator>
        </Box>
        <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
          <Button variant="tertiary" size="xsmall" icon={HeartIcon}>
            Save for later
          </Button>
          <Divider orientation="vertical" height="16px" />
          <Button variant="tertiary" size="xsmall" icon={TrashIcon} onClick={onRemove}>
            Remove
          </Button>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap="spacing.3"
        alignItems="flex-end"
        minWidth="180px"
      >
        <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
          {product.mrp ? (
            <Amount
              value={product.mrp}
              size="small"
              suffix="none"
              isStrikethrough
              color="surface.text.gray.disabled"
            />
          ) : null}
          {off ? (
            <Badge color="notice" size="small">
              {`${off}% OFF`}
            </Badge>
          ) : null}
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="spacing.4"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          borderRadius="medium"
          paddingX="spacing.3"
          paddingY="spacing.2"
        >
          <IconButton
            icon={MinusIcon}
            accessibilityLabel={`Decrease quantity of ${product.name}`}
            onClick={() => onQty(Math.max(1, qty - 1))}
          />
          <Text size="medium" weight="semibold">
            {String(qty)}
          </Text>
          <IconButton
            icon={PlusIcon}
            accessibilityLabel={`Increase quantity of ${product.name}`}
            onClick={() => onQty(Math.min(10, qty + 1))}
          />
        </Box>

        <Amount value={product.price * qty} size="medium" type="heading" suffix="none" />
      </Box>
    </Box>
  );
}

export default function CartBlade({
  state = "ready",
}: {
  state?: "ready" | "loading" | "error";
}) {
  const { openChat } = useAiChat();
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>(() =>
    initialSlugs
      .map(({ slug, qty, variant }) => {
        const product = getProduct(slug);
        return product ? { product, qty, variant } : null;
      })
      .filter((x): x is CartLine => x !== null),
  );
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; value: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
    const discount = applied ? Math.min(applied.value, subtotal) : 0;
    const taxable = subtotal - discount;
    const tax = Math.round(taxable * 0.18);
    const shipping = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 99;
    return {
      subtotal,
      discount,
      tax,
      shipping,
      total: taxable + tax + shipping,
      itemCount: lines.reduce((n, l) => n + l.qty, 0),
    };
  }, [lines, applied]);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const value = COUPONS[code];
    if (value) {
      setApplied({ code, value });
      setCouponError("");
    } else {
      setApplied(null);
      setCouponError("This coupon code is not valid");
    }
  };

  const shell = (children: React.ReactNode) => (
    <BladeRoot>
      <Box
        backgroundColor="surface.background.gray.subtle"
        paddingX="spacing.7"
        paddingY="spacing.7"
      >
        <Box maxWidth="1200px" margin="auto" display="flex" flexDirection="column" gap="spacing.6">
          {children}
        </Box>
      </Box>
    </BladeRoot>
  );

  const title = (
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="baseline">
        <Heading size="large" as="h1">
          Your Cart
        </Heading>
        <Text size="small" color="surface.text.gray.muted">
          {`(${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"})`}
        </Text>
      </Box>
      <Text size="small" color="surface.text.gray.muted">
        Review your items and proceed to checkout.
      </Text>
    </Box>
  );

  if (lines.length === 0)
    return shell(
      <>
        {title}
        <Card elevation="lowRaised" padding="spacing.7">
          <CardBody>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.4"
              paddingY="spacing.7"
            >
              <ShoppingBagIcon size="2xlarge" color="surface.icon.gray.muted" />
              <Heading size="medium">Your cart is empty</Heading>
              <Text size="small" color="surface.text.gray.muted" textAlign="center">
                Add items from our products page and they will show up here for checkout.
              </Text>
              <Button variant="primary" onClick={() => router.push('/store/products')}>
                Browse products
              </Button>
            </Box>
          </CardBody>
        </Card>
      </>,
    );

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - totals.subtotal);

  return shell(
    <>
      {title}

      <Box display="flex" flexDirection="row" gap="spacing.7" flexWrap="wrap" alignItems="flex-start">
        {/* Items column */}
        <Box flex="2" minWidth="320px" display="flex" flexDirection="column" gap="spacing.5">
          <Card elevation="lowRaised" padding="spacing.0">
            <CardBody>
              <Box display="flex" flexDirection="column">
                {lines.map((line, i) => (
                  <Box key={line.product.slug}>
                    <Box padding="spacing.5">
                      <CartRow
                        line={line}
                        onQty={(qty) =>
                          setLines((prev) =>
                            prev.map((l, idx) => (idx === i ? { ...l, qty } : l)),
                          )
                        }
                        onRemove={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
                      />
                    </Box>
                    <Divider />
                  </Box>
                ))}

                <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.3">
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="spacing.4"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <ShieldIcon size="small" color="surface.icon.gray.subtle" />
                    <Text size="small" weight="semibold">
                      {remaining > 0
                        ? `Add ₹${remaining.toLocaleString("en-IN")} more to get free delivery`
                        : "You have unlocked free delivery"}
                    </Text>
                  </Box>
                  <ProgressBar
                    value={Math.min(100, (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100)}
                    color="positive"
                    showPercentage={false}
                  />
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* Trust strip */}
          <Card elevation="lowRaised" padding="spacing.5">
            <CardBody>
              <Box display="flex" flexDirection="row" gap="spacing.6" flexWrap="wrap">
                {trust.map(({ icon: Icon, title: t, sub }) => (
                  <Box
                    key={t}
                    display="flex"
                    flexDirection="row"
                    gap="spacing.4"
                    alignItems="center"
                    flex="1"
                    minWidth="180px"
                  >
                    <Icon size="medium" color="surface.icon.gray.subtle" />
                    <Box>
                      <Text size="small" weight="semibold">
                        {t}
                      </Text>
                      <Text size="xsmall" color="surface.text.gray.muted">
                        {sub}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Summary column */}
        <Box flex="1" minWidth="300px" display="flex" flexDirection="column" gap="spacing.5">
          <Card elevation="lowRaised" padding="spacing.7">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Heading size="small" as="h2">
                  Order Summary
                </Heading>

                <SummaryRow label={`Subtotal (${totals.itemCount} items)`}>
                  <Amount value={totals.subtotal} size="small" suffix="none" />
                </SummaryRow>
                <SummaryRow label="Discount">
                  <Amount
                    value={totals.discount}
                    size="small"
                    suffix="none"
                    color="feedback.text.positive.intense"
                  />
                </SummaryRow>
                <SummaryRow label="Shipping">
                  {totals.shipping === 0 ? (
                    <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                      FREE
                    </Text>
                  ) : (
                    <Amount value={totals.shipping} size="small" suffix="none" />
                  )}
                </SummaryRow>
                <SummaryRow label="Tax (18% GST)">
                  <Amount value={totals.tax} size="small" suffix="none" />
                </SummaryRow>

                <Divider />

                <SummaryRow
                  label={
                    <Text size="medium" weight="semibold">
                      Total Amount
                    </Text>
                  }
                >
                  <Amount value={totals.total} size="medium" type="heading" suffix="none" />
                </SummaryRow>

                {totals.discount > 0 ? (
                  <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
                    <TagIcon size="small" color="feedback.icon.positive.intense" />
                    <Text size="xsmall" color="feedback.text.positive.intense">
                      {`You will save ₹${totals.discount.toLocaleString("en-IN")} on this order`}
                    </Text>
                  </Box>
                ) : null}

                <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="flex-start">
                  <Box flex="1">
                    <TextInput
                      label=""
                      accessibilityLabel="Coupon code"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={({ value }) => setCoupon(value ?? "")}
                      {...(couponError ? { validationState: "error" as const, errorText: couponError } : {})}
                      {...(applied ? { successText: `${applied.code} applied`, validationState: "success" as const } : {})}
                    />
                  </Box>
                  <Button variant="primary" onClick={applyCoupon}>
                    Apply
                  </Button>
                </Box>

                <Button variant="primary" size="large" icon={LockIcon} isFullWidth onClick={() => router.push('/store/checkout')}>
                  Proceed to Checkout
                </Button>

                <Box
                  display="flex"
                  flexDirection="row"
                  gap="spacing.3"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CheckCircleIcon size="small" color="surface.icon.gray.subtle" />
                  <Text size="xsmall" color="surface.text.gray.muted">
                    Safe and secure payments. Easy returns.
                  </Text>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* AI helper */}
          <Card elevation="lowRaised" padding="spacing.7" backgroundColor="surface.background.gray.subtle">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
                  <SparklesIcon size="medium" color="interactive.icon.primary.normal" />
                  <Heading size="small" as="h2">
                    Need help deciding?
                  </Heading>
                </Box>
                <Text size="small" color="surface.text.gray.muted">
                  Our AI assistant can review this cart, suggest cheaper alternatives, and compare
                  options for you.
                </Text>
                <Box display="flex" flexDirection="column" gap="spacing.3">
                  {aiPrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="secondary"
                      size="small"
                      isFullWidth
                      onClick={() => openChat()}
                    >
                      {prompt}
                    </Button>
                  ))}
                </Box>
                <Button
                  variant="secondary"
                  icon={SparklesIcon}
                  isFullWidth
                  onClick={() => openChat()}
                >
                  Ask AI about this cart
                </Button>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </>,
  );
}
