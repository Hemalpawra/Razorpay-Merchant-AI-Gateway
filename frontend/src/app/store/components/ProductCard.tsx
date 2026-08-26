'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Amount,
  Badge,
  Box,
  Button,
  HeartIcon,
  IconButton,
  Indicator,
  ShoppingCartIcon,
  StarIcon,
  Text,
} from "@razorpay/blade/components";
import { BladeRoot } from "./BladeRoot";
import { useStoreCart } from "./StoreCartProvider";
import { discountPct, type Product } from "@/lib/store/catalog";

export function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
      <StarIcon size="small" color="feedback.icon.notice.intense" />
      <Text size="xsmall" weight="medium">
        {rating.toFixed(1)}
      </Text>
      <Text size="xsmall" color="surface.text.gray.muted">
        ({reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}K` : reviews})
      </Text>
    </Box>
  );
}

export function ProductCard({ product, list = false }: { product: Product; list?: boolean }) {
  const router = useRouter();
  const { addToCart } = useStoreCart();
  const off = discountPct(product);

  return (
    <BladeRoot>
      <div style={{ position: "relative", height: "100%" }}>
        <Box
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          borderRadius="medium"
          backgroundColor="surface.background.gray.intense"
          display="flex"
          flexDirection={list ? "row" : "column"}
          gap="spacing.4"
          padding="spacing.4"
          height="100%"
        >
          {/* Wishlist Heart Icon */}
          <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
            <IconButton
              icon={HeartIcon}
              accessibilityLabel="Add to wishlist"
              size="medium"
              onClick={() => {}}
            />
          </div>

          {/* Product Image & Badges */}
          <Box
            backgroundColor="surface.background.gray.subtle"
            borderRadius="medium"
            padding="spacing.4"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={list ? "140px" : "100%"}
            height={list ? "140px" : "200px"}
          >
            <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {(product.badge || off > 0) && (
                <div style={{ position: "absolute", top: "0px", left: "0px", zIndex: 10 }}>
                  <Badge color={off > 0 ? "notice" : product.badge === "New" ? "information" : "positive"}>
                    {off > 0 ? `${off}% OFF` : product.badge}
                  </Badge>
                </div>
              )}
              <img
                src={product.img}
                alt={product.name}
                loading="lazy"
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
              />
            </div>
          </Box>

          {/* Content Details */}
          <Box display="flex" flexDirection="column" gap="spacing.2" flex="1">
            <Link href={`/store/products/${product.slug}`} style={{ textDecoration: "none" }}>
              <Text size="small" weight="semibold" color="surface.text.gray.normal">
                {product.name}
              </Text>
            </Link>
            <Text size="xsmall" color="surface.text.gray.muted">
              {product.subtitle}
            </Text>

            <Stars rating={product.rating} reviews={product.reviews} />

            {/* Pricing Row */}
            <Box display="flex" flexDirection="row" alignItems="baseline" gap="spacing.3" flexWrap="wrap">
              <Amount value={product.price} size="small" type="heading" suffix="none" />
              {product.mrp && (
                <Amount
                  value={product.mrp}
                  size="xsmall"
                  suffix="none"
                  isStrikethrough
                  color="surface.text.gray.disabled"
                />
              )}
              {off > 0 && (
                <Badge color="notice" size="xsmall">
                  {`${off}% OFF`}
                </Badge>
              )}
            </Box>

            {/* Stock Indicator */}
            <Indicator size="small" color={product.stock === "In stock" ? "positive" : "notice"}>
              {product.stock}
            </Indicator>

            {/* Action Buttons */}
            <Box display="flex" flexDirection="row" gap="spacing.3" marginTop="auto" paddingTop="spacing.3">
              <Box flex="1">
                <Button
                  variant="secondary"
                  size="xsmall"
                  icon={ShoppingCartIcon}
                  isFullWidth
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </Box>
              <Box flex="1">
                <Button
                  variant="primary"
                  size="xsmall"
                  isFullWidth
                  onClick={() => { addToCart(product); router.push('/store/checkout'); }}
                >
                  Buy Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </BladeRoot>
  );
}
