'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  Badge,
  Spinner,
} from '@razorpay/blade/components';
import { formatPrice } from '@/lib/store/catalog';

interface RelationProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: 'In stock' | 'Low stock';
  rating: number;
}

interface ProductRelations {
  similar: RelationProduct[];
  better: RelationProduct[];
  frequently_bought: RelationProduct[];
  upgrade: RelationProduct[];
}

interface ProductRelationsSectionProps {
  productId: string;
}

export function ProductRelationsSection({ productId }: ProductRelationsSectionProps) {
  const [relations, setRelations] = useState<ProductRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/relations?product_id=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.relations) {
          setRelations(data.relations);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" padding="spacing.6">
        <Spinner accessibilityLabel="Loading related products" />
      </Box>
    );
  }

  if (!relations) return null;

  const hasAnyRelations = 
    relations.similar.length > 0 ||
    relations.better.length > 0 ||
    relations.frequently_bought.length > 0 ||
    relations.upgrade.length > 0;

  if (!hasAnyRelations) return null;

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {relations.similar.length > 0 && (
        <RelationSection
          title="Similar Products"
          subtitle="Products in the same category with similar price range"
          products={relations.similar}
          variant="similar"
        />
      )}

      {relations.better.length > 0 && (
        <RelationSection
          title="Better Options"
          subtitle="Higher rated products at a higher price point"
          products={relations.better}
          variant="better"
        />
      )}

      {relations.frequently_bought.length > 0 && (
        <RelationSection
          title="Frequently Bought Together"
          subtitle="Customers who bought this also bought these"
          products={relations.frequently_bought}
          variant="frequently_bought"
        />
      )}

      {relations.upgrade.length > 0 && (
        <RelationSection
          title="Premium Upgrades"
          subtitle="Higher tier options for power users"
          products={relations.upgrade}
          variant="upgrade"
        />
      )}
    </Box>
  );
}

interface RelationSectionProps {
  title: string;
  subtitle: string;
  products: RelationProduct[];
  variant: 'similar' | 'better' | 'frequently_bought' | 'upgrade';
}

function RelationSection({ title, subtitle, products, variant }: RelationSectionProps) {
  const getVariantColor = () => {
    switch (variant) {
      case 'better':
        return 'positive';
      case 'frequently_bought':
        return 'information';
      case 'upgrade':
        return 'notice';
      default:
        return 'neutral';
    }
  };

  const getSlug = (product: RelationProduct) => {
    return product.sku?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || product.id;
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Box display="flex" flexDirection="column" gap="spacing.1">
        <Heading size="small" weight="semibold">{title}</Heading>
        <Text size="xsmall" color="surface.text.gray.muted">{subtitle}</Text>
      </Box>

      <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
        {products.map((product) => (
          <Card
            key={product.id}
            elevation="lowRaised"
            padding="spacing.4"
            width="200px"
          >
            <CardBody>
              <Link
                href={`/store/products/${getSlug(product)}`}
                style={{ textDecoration: 'none' }}
              >
                <Box display="flex" flexDirection="column" gap="spacing.3">
                  <Box
                    height="80px"
                    backgroundColor="surface.background.gray.subtle"
                    borderRadius="medium"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Text size="xsmall" color="surface.text.gray.muted">
                        {product.name.charAt(0)}
                      </Text>
                    )}
                  </Box>

                  <Box display="flex" flexDirection="column" gap="spacing.1">
                    <Text size="xsmall" weight="semibold" color="surface.text.gray.normal" truncateAfterLines={2}>
                      {product.name}
                    </Text>
                    <Text size="small" weight="semibold" color="interactive.text.primary.normal">
                      {formatPrice(product.price)}
                    </Text>
                    <Box display="flex" alignItems="center" gap="spacing.1">
                      <Text size="xsmall" color="surface.text.gray.muted">
                        {'★'.repeat(Math.floor(product.rating))}
                      </Text>
                      <Badge
                        color={product.stock === 'In stock' ? 'positive' : 'notice'}
                        size="xsmall"
                      >
                        {product.stock}
                      </Badge>
                    </Box>
                  </Box>
                </Box>
              </Link>
            </CardBody>
          </Card>
        ))}
      </Box>
    </Box>
  );
}