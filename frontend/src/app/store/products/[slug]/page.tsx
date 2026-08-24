'use client';

import { use } from "react";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import ProductDetailBlade from "../../components/ProductDetailBlade";
import { getProduct, relatedProducts } from "@/lib/store/catalog";
import { Box, Button, Heading, Text } from "@razorpay/blade/components";
import { BladeRoot } from "../../components/BladeRoot";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = getProduct(resolvedParams.slug);

  if (!product) {
    return (
      <Box backgroundColor="surface.background.gray.subtle" minHeight="100vh">
        <SiteHeader />
        <Box maxWidth="600px" margin="auto" paddingY="spacing.8" textAlign="center">
          <BladeRoot>
            <Heading size="medium" weight="semibold">
              Product Not Found
            </Heading>
            <Text color="surface.text.gray.muted" marginTop="spacing.3">
              The product you are looking for does not exist or has been removed.
            </Text>
            <Box marginTop="spacing.6">
              <Link href="/store/products" style={{ textDecoration: "none" }}>
                <Button variant="primary">Browse All Products</Button>
              </Link>
            </Box>
          </BladeRoot>
        </Box>
      </Box>
    );
  }

  const related = relatedProducts(product);

  return (
    <Box backgroundColor="surface.background.gray.subtle" minHeight="100vh">
      <SiteHeader />
      <ProductDetailBlade product={product} related={related} />
    </Box>
  );
}
