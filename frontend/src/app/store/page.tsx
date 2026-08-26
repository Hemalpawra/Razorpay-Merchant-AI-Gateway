'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Amount,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CheckCircleIcon,
  ChevronRightIcon,
  Heading,
  RefreshIcon,
  ShieldIcon,
  SparklesIcon,
  StarIcon,
  Text,
  PackageIcon,
  HeadsetIcon,
  SearchIcon,
  InfoIcon,
} from "@razorpay/blade/components";

import { BladeRoot } from "./components/BladeRoot";
import { SiteHeader } from "./components/SiteHeader";
import { ProductCard } from "./components/ProductCard";
import { useAiChat } from "./components/StoreAiProvider";
import { categories, products as fallbackProducts, mapDbProduct } from "@/lib/store/catalog";

const trustItems = [
  { icon: ShieldIcon, title: "Secure Payments", sub: "Powered by Razorpay" },
  { icon: PackageIcon, title: "Fast Delivery", sub: "Pan India Delivery" },
  { icon: RefreshIcon, title: "7 Day Returns", sub: "Hassle-free returns" },
  { icon: HeadsetIcon, title: "24/7 Support", sub: "We're here to help" },
  { icon: SearchIcon, title: "Order Tracking", sub: "Track your orders" },
];

function SectionHeader({
  title,
  action,
  href = "/store/products",
}: {
  title: string;
  action: string;
  href?: string;
}) {
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="baseline" marginBottom="spacing.5">
      <Heading size="medium" weight="semibold">
        {title}
      </Heading>
      <Link href={href} style={{ textDecoration: "none" }}>
        <Box display="flex" alignItems="center" gap="spacing.2">
          <Text size="small" weight="semibold" color="interactive.text.primary.normal">
            {action}
          </Text>
          <ChevronRightIcon size="small" color="interactive.icon.primary.normal" />
        </Box>
      </Link>
    </Box>
  );
}

export default function StoreHomePage() {
  const { openChat } = useAiChat();
  const router = useRouter();
  const [products, setProducts] = useState<typeof fallbackProducts>([]);

  useEffect(() => {
    fetch('/api/products?status=active')
      .then((response) => response.json())
      .then((data) => {
        const live = (data.products ?? []).map(mapDbProduct);
        setProducts(live.length > 0 ? live : fallbackProducts);
      })
      .catch(() => setProducts(fallbackProducts));
  }, []);

  const featured = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

  return (
    <Box backgroundColor="surface.background.gray.subtle" minHeight="100vh">
      <SiteHeader />

      <Box maxWidth="1200px" margin="auto" paddingX="spacing.6" paddingBottom="spacing.8">
        <BladeRoot>
          {/* Hero Section */}
          <Box
            marginTop="spacing.6"
            borderRadius="large"
            backgroundColor="surface.background.gray.intense"
            borderWidth="thin"
            borderColor="surface.border.gray.muted"
          >
            <Box display="flex" flexDirection="row" flexWrap="wrap" alignItems="center">
              <Box flex="1" minWidth="300px" padding="spacing.8">
                <Badge color="information" size="small">
                  New Arrival
                </Badge>
                <Box marginTop="spacing.4" marginBottom="spacing.4">
                  <Heading size="xlarge" weight="semibold">
                    Technology that <Text color="interactive.text.primary.normal" size="large" weight="semibold" as="span">moves</Text> with you
                  </Heading>
                </Box>
                <Text color="surface.text.gray.muted" size="small">
                  Explore the latest electronics, smart accessories and more. Handpicked for you.
                </Text>

                <Box display="flex" flexDirection="row" gap="spacing.4" marginTop="spacing.6" flexWrap="wrap">
                  <Button
                    variant="primary"
                    size="medium"
                    icon={ChevronRightIcon}
                    iconPosition="right"
                    onClick={() => router.push('/store/products')}
                  >
                    Shop Now
                  </Button>
                  <Button
                    variant="secondary"
                    size="medium"
                    icon={SparklesIcon}
                    onClick={() => openChat()}
                  >
                    Ask AI Assistant
                  </Button>
                </Box>

                <Box display="flex" flexDirection="row" gap="spacing.6" marginTop="spacing.7" flexWrap="wrap">
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <CheckCircleIcon size="small" color="feedback.icon.positive.intense" />
                    <Text size="xsmall" color="surface.text.gray.muted">
                      100% Original Products
                    </Text>
                  </Box>
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <ShieldIcon size="small" color="surface.icon.gray.subtle" />
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Secure Payments
                    </Text>
                  </Box>
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <RefreshIcon size="small" color="surface.icon.gray.subtle" />
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Easy Returns
                    </Text>
                  </Box>
                </Box>
              </Box>

              <Box flex="1" minWidth="300px" height="360px" display="flex" alignItems="center" justifyContent="center" backgroundColor="surface.background.gray.subtle">
                <img
                  src="/store/hero-tech.jpg"
                  alt="Laptop, headphones, smartwatch and wireless earbuds on a display pedestal"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            </Box>
          </Box>

          {/* Categories */}
          <Box marginTop="spacing.8">
            <SectionHeader title="Shop by Category" action="View all categories" />
            <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
              {categories.map((c) => (
                <div
                  key={c.slug}
                  style={{ flex: 1, minWidth: "160px", maxWidth: "200px", cursor: "pointer" }}
                  onClick={() => router.push(`/store/products?category=${c.slug}`)}
                >
                  <Card elevation="lowRaised" padding="spacing.4">
                    <CardBody>
                      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap="spacing.3">
                        <Box
                          width="80px"
                          height="80px"
                          borderRadius="medium"
                          backgroundColor="surface.background.gray.subtle"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <img
                            src={c.img}
                            alt={c.name}
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        </Box>
                        <Text size="small" weight="semibold">
                          {c.name}
                        </Text>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {products.filter((p) => p.category === c.slug).length} products
                        </Text>
                      </Box>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </Box>
          </Box>

          {/* Featured Products */}
          <Box marginTop="spacing.8">
            <SectionHeader title="Featured Products" action="View all products" />
            <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
              {featured.map((p) => (
                <Box key={p.slug} flex="1" minWidth="240px" maxWidth="380px">
                  <ProductCard product={p} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* AI Assistant Banner */}
          <Box
            marginTop="spacing.8"
            borderRadius="medium"
            backgroundColor="surface.background.gray.intense"
            borderWidth="thin"
            borderColor="interactive.border.primary.default"
            padding="spacing.7"
          >
            <Box display="flex" flexDirection="row" gap="spacing.6" flexWrap="wrap" alignItems="center">
              <Box flex="1" minWidth="260px">
                <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.2">
                  <SparklesIcon size="small" color="interactive.icon.primary.normal" />
                  <Text size="xsmall" weight="semibold" color="interactive.text.primary.normal">
                    Shopping made smarter with AI
                  </Text>
                </Box>
                <Heading size="medium" weight="semibold">
                  Ask anything. Get the right answer.
                </Heading>
                <Text size="small" color="surface.text.gray.muted" marginTop="spacing.3">
                  Our AI assistant can help you find the perfect product, compare options and make confident decisions.
                </Text>
              </Box>

              <Box flex="1" minWidth="260px" display="flex" flexDirection="column" gap="spacing.3">
                {[
                  "I need a laptop under ₹60,000",
                  "Which headphones are best for travel?",
                  "Compare iPhone 15 and Samsung S24",
                ].map((q) => (
                  <Button
                    key={q}
                    variant="secondary"
                    size="small"
                    icon={InfoIcon}
                    isFullWidth
                    onClick={() => openChat()}
                  >
                    {q}
                  </Button>
                ))}
              </Box>

              <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.2">
                <Button
                  variant="primary"
                  size="medium"
                  icon={SparklesIcon}
                  onClick={() => openChat()}
                >
                  Ask AI Assistant
                </Button>
                <Text size="xsmall" color="surface.text.gray.muted">
                  Powered by Merchant AI Gateway
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Trust Strip */}
          <Box
            marginTop="spacing.8"
            borderWidth="thin"
            borderColor="surface.border.gray.muted"
            borderRadius="medium"
            backgroundColor="surface.background.gray.intense"
            padding="spacing.5"
          >
            <Box display="flex" flexDirection="row" gap="spacing.6" flexWrap="wrap">
              {trustItems.map(({ icon: Icon, title, sub }) => (
                <Box key={title} display="flex" flexDirection="row" gap="spacing.3" alignItems="center" flex="1" minWidth="180px">
                  <Box
                    width="36px"
                    height="36px"
                    borderRadius="small"
                    backgroundColor="surface.background.gray.subtle"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon size="medium" color="surface.icon.gray.normal" />
                  </Box>
                  <Box>
                    <Text size="small" weight="semibold">
                      {title}
                    </Text>
                    <Text size="xsmall" color="surface.text.gray.muted">
                      {sub}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Best Sellers */}
          <Box marginTop="spacing.8">
            <SectionHeader
              title="Best Sellers"
              action="View all best sellers"
              href="/store/products?sort=rating"
            />
            <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
              {bestSellers.map((b, i) => (
                <div
                  key={b.slug}
                  style={{ flex: 1, minWidth: "200px", cursor: "pointer" }}
                  onClick={() => router.push(`/store/products/${b.slug}`)}
                >
                  <Card elevation="lowRaised" padding="spacing.3">
                    <CardBody>
                      <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
                        <Box
                          width="24px"
                          height="24px"
                          borderRadius="max"
                          backgroundColor="surface.background.gray.intense"
                          borderWidth="thin"
                          borderColor="interactive.border.primary.default"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          <Text size="xsmall" weight="semibold">
                            {i + 1}
                          </Text>
                        </Box>
                        <Box
                          width="44px"
                          height="44px"
                          borderRadius="small"
                          backgroundColor="surface.background.gray.subtle"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            loading="lazy"
                            style={{ width: "36px", height: "36px", objectFit: "contain" }}
                          />
                        </Box>
                        <Box flex="1">
                          <Text size="xsmall" weight="semibold">
                            {b.name}
                          </Text>
                          <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.2" marginTop="spacing.1">
                            <Amount value={b.price} size="xsmall" type="body" suffix="none" />
                            <Box display="flex" alignItems="center" gap="spacing.1">
                              <StarIcon size="xsmall" color="feedback.icon.notice.intense" />
                              <Text size="xsmall" color="surface.text.gray.muted">
                                {b.rating.toFixed(1)}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </Box>
          </Box>
        </BladeRoot>
      </Box>

      {/* Floating Ask AI button */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 50 }}>
        <BladeRoot>
          <Button
            variant="primary"
            size="medium"
            icon={SparklesIcon}
            onClick={() => openChat()}
          >
            Ask AI
          </Button>
        </BladeRoot>
      </div>
    </Box>
  );
}
