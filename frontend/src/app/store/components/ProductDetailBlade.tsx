'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Amount,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CheckCircleIcon,
  ChevronRightIcon,
  Divider,
  Heading,
  HeartIcon,
  IconButton,
  Indicator,
  List,
  ListItem,
  MaximizeIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  SparklesIcon,
  StarIcon,
  Tabs,
  TabItem,
  TabList,
  TabPanel,
  Text,
  ZapIcon,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { useAiChat } from "./StoreAiProvider";
import { categoryName, discountPct, type Product } from "@/lib/store/catalog";

type Props = { product: Product; related: Product[] };

const assurances = [
  { icon: PackageIcon, title: "Free Delivery", sub: "On orders above ₹499" },
  { icon: RefreshIcon, title: "Easy Returns", sub: "10 days return policy" },
  { icon: ShieldIcon, title: "Secure Payments", sub: "Powered by Razorpay" },
  { icon: CheckCircleIcon, title: "2 Year Warranty", sub: "Brand warranty" },
  { icon: StarIcon, title: "100% Original", sub: "Sourced directly" },
];

const railTrust = [
  { icon: ShieldIcon, title: "Secure Payments", sub: "Powered by Razorpay" },
  { icon: RefreshIcon, title: "Easy Returns", sub: "Hassle-free returns within 10 days" },
  { icon: SparklesIcon, title: "24/7 Customer Support", sub: "We're here to help anytime" },
  { icon: SearchIcon, title: "Order Tracking", sub: "Track your order in real-time" },
];

const aiPrompts = [
  "Is this better than the other one?",
  "Show me a cheaper option",
  "What is the best choice for office work?",
];

function Assurance({
  icon: Icon,
  title,
  sub,
}: {
  icon: typeof ShieldIcon;
  title: string;
  sub: string;
}) {
  return (
    <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center" flex="1">
      <Icon size="medium" color="surface.icon.gray.subtle" />
      <Box>
        <Text size="small" weight="semibold">
          {title}
        </Text>
        <Text size="xsmall" color="surface.text.gray.muted">
          {sub}
        </Text>
      </Box>
    </Box>
  );
}

function RelatedCard({ item }: { item: Product }) {
  const router = useRouter();
  const off = discountPct(item);
  return (
    <Link href={`/store/products/${item.slug}`} style={{ flex: 1, minWidth: "180px", maxWidth: "220px", textDecoration: "none" }}>
      <Box
        borderWidth="thin"
        borderColor="surface.border.gray.muted"
        borderRadius="medium"
        padding="spacing.4"
        display="flex"
        flexDirection="column"
        gap="spacing.3"
        backgroundColor="surface.background.gray.intense"
      >
        <Box display="flex" flexDirection="row" gap="spacing.2">
          {off ? (
            <Badge color="notice" size="small">
              {`${off}% OFF`}
            </Badge>
          ) : item.badge ? (
            <Badge color="positive" size="small">
              {item.badge}
            </Badge>
          ) : null}
        </Box>
        <Box height="112px" display="flex" alignItems="center" justifyContent="center">
          <img
            src={item.img}
            alt={item.name}
            loading="lazy"
            style={{ maxHeight: "112px", maxWidth: "100%", objectFit: "contain" }}
          />
        </Box>
        <Text size="small" weight="semibold">
          {item.name}
        </Text>
        <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
          <StarIcon size="small" color="feedback.icon.notice.intense" />
          <Text size="xsmall" color="surface.text.gray.muted">
            {`${item.rating} (${item.reviews})`}
          </Text>
        </Box>
        <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="baseline">
          <Amount value={item.price} size="small" type="heading" suffix="none" />
          {item.mrp ? (
            <Amount
              value={item.mrp}
              size="small"
              suffix="none"
              isStrikethrough
              color="surface.text.gray.disabled"
            />
          ) : null}
        </Box>
        <Button variant="secondary" size="xsmall" icon={ShoppingCartIcon} isFullWidth onClick={(e) => { e.preventDefault(); router.push('/store/cart'); }}>
          Add to Cart
        </Button>
      </Box>
    </Link>
  );
}

export default function ProductDetailBlade({ product, related }: Props) {
  const { openChat } = useAiChat();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const off = discountPct(product);
  const gallery = [product.img, product.img, product.img, product.img];

  return (
    <BladeRoot>
      <Box
        backgroundColor="surface.background.gray.subtle"
        paddingX="spacing.7"
        paddingY="spacing.6"
      >
        <Box maxWidth="1200px" margin="auto" display="flex" flexDirection="column" gap="spacing.7">
          {/* Breadcrumb */}
          <Breadcrumb size="medium">
            <BreadcrumbItem href="/store">Home</BreadcrumbItem>
            <BreadcrumbItem href="/store/products">Products</BreadcrumbItem>
            <BreadcrumbItem href={`/store/products?category=${product.category}`}>
              {categoryName(product.category)}
            </BreadcrumbItem>
            <BreadcrumbItem href={`/store/products/${product.slug}`} isCurrentPage>
              {product.name}
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Gallery + Buy Box */}
          <Box display="flex" flexDirection="row" gap="spacing.7" flexWrap="wrap">
            <Box display="flex" flexDirection="row" gap="spacing.4" flex="1" minWidth="320px">
              <Box display="flex" flexDirection="column" gap="spacing.3">
                {gallery.map((src, i) => (
                  <Box
                    key={i}
                    width="64px"
                    height="64px"
                    borderWidth="thin"
                    borderColor={
                      activeImage === i
                        ? "interactive.border.primary.default"
                        : "surface.border.gray.muted"
                    }
                    borderRadius="medium"
                    backgroundColor="surface.background.gray.intense"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <img
                      src={src}
                      alt={`${product.name} view ${i + 1}`}
                      onClick={() => setActiveImage(i)}
                      style={{
                        maxWidth: "48px",
                        maxHeight: "48px",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Box
                flex="1"
                borderWidth="thin"
                borderColor="surface.border.gray.muted"
                borderRadius="medium"
                backgroundColor="surface.background.gray.intense"
                padding="spacing.7"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap="spacing.5"
                minHeight="420px"
              >
                <img
                  src={gallery[activeImage]}
                  alt={product.name}
                  style={{ maxHeight: "320px", maxWidth: "100%", objectFit: "contain" }}
                />
                <Box display="flex" flexDirection="row" gap="spacing.4">
                  <Button variant="tertiary" size="small" icon={MaximizeIcon}>
                    View in 3D
                  </Button>
                  <Button variant="tertiary" size="small" icon={SearchIcon}>
                    Zoom
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Buy Box */}
            <Box flex="1" minWidth="320px" display="flex" flexDirection="column" gap="spacing.4">
              <Box display="flex" flexDirection="row" justifyContent="space-between">
                {product.badge ? <Badge color="positive">{product.badge}</Badge> : <Box />}
                <IconButton icon={HeartIcon} accessibilityLabel="Add to wishlist" size="large" onClick={() => {}} />
              </Box>

              <Heading size="large" as="h1">
                {product.name}
              </Heading>
              <Text color="surface.text.gray.muted">{product.subtitle}</Text>

              <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
                <StarIcon size="small" color="feedback.icon.notice.intense" />
                <Text size="small" weight="semibold">
                  {product.rating}
                </Text>
                <Text size="small" color="interactive.text.primary.normal">
                  {`(${product.reviews} reviews)`}
                </Text>
                <Divider orientation="vertical" height="16px" />
                <Text size="small" color="surface.text.gray.muted">
                  2K+ bought in past month
                </Text>
              </Box>

              <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
                <Amount value={product.price} size="large" type="heading" suffix="none" />
                {product.mrp ? (
                  <Amount
                    value={product.mrp}
                    size="medium"
                    suffix="none"
                    isStrikethrough
                    color="surface.text.gray.disabled"
                  />
                ) : null}
                {off ? <Badge color="notice">{`${off}% OFF`}</Badge> : null}
              </Box>
              <Text size="xsmall" color="surface.text.gray.muted">
                Inclusive of all taxes
              </Text>

              <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
                <Indicator color={product.stock === "In stock" ? "positive" : "notice"}>
                  {product.stock}
                </Indicator>
                <Text size="small" color="surface.text.gray.muted">
                  Free delivery by
                </Text>
                <Text size="small" weight="semibold">
                  Tomorrow
                </Text>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.3">
                {[
                  { icon: RefreshIcon, label: "10 Days Replacement" },
                  { icon: ShieldIcon, label: "2 Year Warranty" },
                  { icon: CheckCircleIcon, label: "100% Original Product" },
                ].map(({ icon: Icon, label }) => (
                  <Box key={label} display="flex" flexDirection="row" gap="spacing.3">
                    <Icon size="small" color="surface.icon.gray.subtle" />
                    <Text size="small">{label}</Text>
                  </Box>
                ))}
              </Box>

              <Divider />

              <Box display="flex" flexDirection="row" gap="spacing.5" alignItems="center">
                <Text size="small" weight="semibold">
                  Quantity
                </Text>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap="spacing.4"
                  borderWidth="thin"
                  borderColor="surface.border.gray.muted"
                  borderRadius="medium"
                  paddingX="spacing.4"
                  paddingY="spacing.2"
                >
                  <IconButton
                    icon={MinusIcon}
                    accessibilityLabel="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  />
                  <Text size="medium" weight="semibold">
                    {String(qty)}
                  </Text>
                  <IconButton
                    icon={PlusIcon}
                    accessibilityLabel="Increase quantity"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                  />
                </Box>
              </Box>

              <Box display="flex" flexDirection="row" gap="spacing.4">
                <Box flex="1">
                  <Button variant="secondary" icon={ShoppingCartIcon} isFullWidth onClick={() => router.push('/store/cart')}>
                    Add to Cart
                  </Button>
                </Box>
                <Box flex="1">
                  <Button variant="primary" icon={ZapIcon} isFullWidth onClick={() => router.push('/store/checkout')}>
                    Buy Now
                  </Button>
                </Box>
              </Box>
              <Button variant="tertiary" icon={SparklesIcon} isFullWidth onClick={() => openChat(product)}>
                Ask AI about this product
              </Button>
            </Box>
          </Box>

          {/* Assurance Strip */}
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            gap="spacing.6"
            padding="spacing.5"
            borderWidth="thin"
            borderColor="surface.border.gray.muted"
            borderRadius="medium"
            backgroundColor="surface.background.gray.intense"
          >
            {assurances.map((a) => (
              <Assurance key={a.title} {...a} />
            ))}
          </Box>

          {/* Tabs + AI Rail */}
          <Box display="flex" flexDirection="row" gap="spacing.7" flexWrap="wrap">
            <Box flex="2" minWidth="360px">
              <Tabs defaultValue="description">
                <TabList>
                  <TabItem value="description">Description</TabItem>
                  <TabItem value="features">Features</TabItem>
                  <TabItem value="specifications">Specifications</TabItem>
                  <TabItem value="shipping">Shipping</TabItem>
                  <TabItem value="returns">Returns</TabItem>
                  <TabItem value="warranty">Warranty</TabItem>
                  <TabItem value="reviews">{`Reviews (${product.reviews})`}</TabItem>
                </TabList>

                <TabPanel value="description">
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="spacing.7"
                    flexWrap="wrap"
                    paddingY="spacing.5"
                  >
                    <Box flex="1" minWidth="260px" display="flex" flexDirection="column" gap="spacing.4">
                      <Heading size="small">Product Description</Heading>
                      <Text size="small" color="surface.text.gray.subtle">
                        {product.description}
                      </Text>
                      <List variant="unordered" size="small" icon={CheckCircleIcon} iconColor="feedback.icon.positive.intense">
                        {product.highlights.map((h) => (
                          <ListItem key={h}>{h}</ListItem>
                        ))}
                      </List>
                    </Box>
                    <Box
                      flex="1"
                      minWidth="260px"
                      borderWidth="thin"
                      borderColor="surface.border.gray.muted"
                      borderRadius="medium"
                      padding="spacing.5"
                      display="flex"
                      flexDirection="column"
                      gap="spacing.4"
                    >
                      {product.specs.map((s) => (
                        <Box key={s.label} display="flex" flexDirection="row" gap="spacing.4">
                          <Box flex="1">
                            <Text size="small" color="surface.text.gray.muted">
                              {s.label}
                            </Text>
                          </Box>
                          <Box flex="1">
                            <Text size="small" weight="medium">
                              {s.value}
                            </Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </TabPanel>

                <TabPanel value="features">
                  <Box paddingY="spacing.5">
                    <List variant="unordered" size="small" icon={CheckCircleIcon} iconColor="feedback.icon.positive.intense">
                      {product.highlights.map((h) => (
                        <ListItem key={h}>{h}</ListItem>
                      ))}
                    </List>
                  </Box>
                </TabPanel>

                <TabPanel value="specifications">
                  <Box
                    paddingY="spacing.5"
                    display="flex"
                    flexDirection="column"
                    gap="spacing.4"
                  >
                    {product.specs.map((s) => (
                      <Box key={s.label} display="flex" flexDirection="row" gap="spacing.4">
                        <Box flex="1">
                          <Text size="small" color="surface.text.gray.muted">
                            {s.label}
                          </Text>
                        </Box>
                        <Box flex="2">
                          <Text size="small" weight="medium">
                            {s.value}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </TabPanel>

                <TabPanel value="shipping">
                  <Box paddingY="spacing.5">
                    <Text size="small" color="surface.text.gray.subtle">
                      Free delivery on orders above ₹499. Orders placed before 4 PM are dispatched
                      the same day and delivered pan-India in 2-5 business days.
                    </Text>
                  </Box>
                </TabPanel>

                <TabPanel value="returns">
                  <Box paddingY="spacing.5">
                    <Text size="small" color="surface.text.gray.subtle">
                      Not the right fit? Raise a return within 10 days of delivery and we will pick
                      it up from your doorstep. Refunds are processed to the original payment method
                      within 5 working days.
                    </Text>
                  </Box>
                </TabPanel>

                <TabPanel value="warranty">
                  <Box paddingY="spacing.5">
                    <Text size="small" color="surface.text.gray.subtle">
                      {`${product.brand} provides a 2 year manufacturer warranty on this product, serviceable at all authorised service centres across India.`}
                    </Text>
                  </Box>
                </TabPanel>

                <TabPanel value="reviews">
                  <Box paddingY="spacing.5" display="flex" flexDirection="column" gap="spacing.4">
                    <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
                      <StarIcon size="medium" color="feedback.icon.notice.intense" />
                      <Heading size="small">{`${product.rating} out of 5`}</Heading>
                      <Text size="small" color="surface.text.gray.muted">
                        {`Based on ${product.reviews} verified reviews`}
                      </Text>
                    </Box>
                    <Text size="small" color="surface.text.gray.subtle">
                      Customers rate this product highly for build quality, battery life and
                      after-sales support.
                    </Text>
                  </Box>
                </TabPanel>
              </Tabs>
            </Box>

            {/* AI Rail */}
            <Box flex="1" minWidth="280px" display="flex" flexDirection="column" gap="spacing.5">
              <Card padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.4">
                    <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
                      <SparklesIcon size="medium" color="interactive.icon.primary.normal" />
                      <Text weight="semibold">AI Shopping Assistant</Text>
                    </Box>
                    <Text size="small" color="surface.text.gray.muted">
                      Need help choosing the right product? Ask our AI assistant anything about this
                      product.
                    </Text>
                    {aiPrompts.map((q) => (
                      <Button key={q} variant="tertiary" size="small" isFullWidth onClick={() => openChat(product)}>
                        {q}
                      </Button>
                    ))}
                    <Button variant="primary" icon={SparklesIcon} isFullWidth onClick={() => openChat(product)}>
                      Ask AI about this product
                    </Button>
                  </Box>
                </CardBody>
              </Card>

              <Box
                borderWidth="thin"
                borderColor="surface.border.gray.muted"
                borderRadius="medium"
                padding="spacing.5"
                display="flex"
                flexDirection="column"
                gap="spacing.5"
                backgroundColor="surface.background.gray.intense"
              >
                {railTrust.map((t) => (
                  <Assurance key={t.title} {...t} />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Related Products */}
          <Box display="flex" flexDirection="column" gap="spacing.5">
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
              <Heading size="small">You may also like</Heading>
              <Button variant="tertiary" size="small" icon={ChevronRightIcon} iconPosition="right" onClick={() => router.push('/store/products')}>
                View all
              </Button>
            </Box>
            <Box display="flex" flexDirection="row" gap="spacing.5" flexWrap="wrap">
              {related.map((item) => (
                <RelatedCard key={item.slug} item={item} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </BladeRoot>
  );
}
