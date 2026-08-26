'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Heading,
  ShoppingBagIcon,
  SparklesIcon,
  Text,
  TextInput,
  PackageIcon,
  RefreshIcon,
  ShieldIcon,
  MapPinIcon,
  SearchIcon,
} from "@razorpay/blade/components";
import { BladeRoot } from "./BladeRoot";
import { useAiChat } from "./StoreAiProvider";
import { useStoreCart } from "./StoreCartProvider";

export function Logo() {
  return (
    <Link href="/store" style={{ textDecoration: "none" }}>
      <Box display="flex" alignItems="center" gap="spacing.3">
        <Box
          width="28px"
          height="28px"
          borderRadius="small"
          backgroundColor="surface.background.primary.subtle"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <div style={{ transform: "skewX(-12deg)", width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "#ffffff" }} />
        </Box>
        <Heading size="small" weight="semibold">
          Acme Store
        </Heading>
      </Box>
    </Link>
  );
}

export function SiteHeader({ initialQuery = "" }: { initialQuery?: string }) {
  const { openChat } = useAiChat();
  const { itemCount } = useStoreCart();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/store/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <BladeRoot>
      {/* Top Banner */}
      <Box
        backgroundColor="surface.background.gray.subtle"
        borderBottomWidth="thin"
        borderBottomColor="surface.border.gray.muted"
        paddingY="spacing.2"
        paddingX="spacing.6"
      >
        <Box
          maxWidth="1200px"
          margin="auto"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap="spacing.3"
        >
          <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.6" flexWrap="wrap">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <PackageIcon size="small" color="surface.icon.gray.muted" />
              <Text size="xsmall" color="surface.text.gray.muted">
                Free shipping on orders above ₹1,499
              </Text>
            </Box>
            <Box display="flex" alignItems="center" gap="spacing.2">
              <RefreshIcon size="small" color="surface.icon.gray.muted" />
              <Text size="xsmall" color="surface.text.gray.muted">
                7 Days easy returns
              </Text>
            </Box>
            <Box display="flex" alignItems="center" gap="spacing.2">
              <ShieldIcon size="small" color="surface.icon.gray.muted" />
              <Text size="xsmall" color="surface.text.gray.muted">
                Secure payments powered by Razorpay
              </Text>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap="spacing.2">
            <MapPinIcon size="small" color="surface.icon.gray.muted" />
            <Text size="xsmall" color="surface.text.gray.muted">
              Deliver to <Text size="xsmall" weight="semibold" as="span">India</Text>
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Main Sticky Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
        <Box
          backgroundColor="surface.background.gray.intense"
          borderBottomWidth="thin"
          borderBottomColor="surface.border.gray.muted"
          paddingY="spacing.4"
          paddingX="spacing.6"
        >
          <Box
            maxWidth="1200px"
            margin="auto"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            gap="spacing.5"
          >
            <Logo />

            {/* Search Bar */}
            <Box flex="1" maxWidth="500px">
              <form onSubmit={handleSearch}>
                <TextInput
                  accessibilityLabel="Search products"
                  placeholder="Search for products, categories or brands"
                  value={query}
                  onChange={({ value }) => setQuery(value ?? "")}
                  icon={SearchIcon}
                  type="search"
                />
              </form>
            </Box>

            {/* Nav Actions */}
            <Box display="flex" alignItems="center" gap="spacing.5">
              <Link href="/store/products" style={{ textDecoration: "none" }}>
                <Text size="small" weight="medium" color="surface.text.gray.subtle">
                  Products
                </Text>
              </Link>

              <Button
                variant="secondary"
                size="small"
                icon={SparklesIcon}
                onClick={() => openChat()}
              >
                Ask AI
              </Button>

              <Link href="/store/cart" style={{ textDecoration: "none" }}>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={ShoppingBagIcon}
                  accessibilityLabel="View Cart"
                >
                  Cart ({itemCount})
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </div>
    </BladeRoot>
  );
}
