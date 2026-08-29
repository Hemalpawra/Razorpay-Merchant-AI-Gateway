'use client';

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import ProductDetailBlade from "../../components/ProductDetailBlade";
import { mapDbProduct, relatedProducts } from "@/lib/store/catalog";
import { Box, Button, Heading, Text } from "@razorpay/blade/components";
import { BladeRoot } from "../../components/BladeRoot";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<ReturnType<typeof mapDbProduct> | null>(null);
  const [related, setRelated] = useState<ReturnType<typeof mapDbProduct>[]>([]);
  const [productId, setProductId] = useState(''); // SKU from product detail
  const [loading, setLoading] = useState(true);
  const { slug } = use(params);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products?status=active')
      .then((response) => response.json())
      .then((data) => {
        const live = (data.products ?? []).map(mapDbProduct);
        const match = live.find((item: ReturnType<typeof mapDbProduct>) => item.slug === slug) ?? null;
        setProduct(match);
        if (match) {
          setProductId(match.sku ?? '');
        }
        setRelated(match ? relatedProducts(match, live) : []);
      })
      .catch(() => {
        setProduct(null);
        setRelated([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return null;

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

  return (
    <Box backgroundColor="surface.background.gray.subtle" minHeight="100vh">
      <SiteHeader />
      <ProductDetailBlade product={product} productId={productId} related={related} />
    </Box>
  );
}
