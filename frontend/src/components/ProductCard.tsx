'use client';

import React from 'react';
import { 
  Card, 
  CardBody, 
  Box, 
  Text, 
  Heading, 
  Badge, 
  IconButton,
  PackageIcon,
  MoreVerticalIcon,
  TagIcon
} from '@razorpay/blade/components';

export type ProductStatus = 'active' | 'draft' | 'out_of_stock' | 'low_stock';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: ProductStatus;
  sku?: string;
}

const statusConfig: Record<ProductStatus, { color: 'positive' | 'notice' | 'negative' | 'neutral', label: string }> = {
  active: { color: 'positive', label: 'Active' },
  draft: { color: 'neutral', label: 'Draft' },
  out_of_stock: { color: 'negative', label: 'Out of Stock' },
  low_stock: { color: 'notice', label: 'Low Stock' }
};

export function ProductCard({ product }: { product: Product }) {
  const config = statusConfig[product.status];

  return (
    <Card elevation="none" backgroundColor="surface.background.gray.intense">
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          {/* Product Thumbnail / Icon */}
          <Box 
            width="100%" 
            height="130px" 
            backgroundColor="surface.background.gray.subtle" 
            borderRadius="medium"
            borderWidth="thin"
            borderColor="surface.border.gray.muted"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <PackageIcon size="xlarge" color="surface.icon.primary.normal" />
          </Box>
          
          {/* Title & Actions */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1} marginRight="spacing.2">
              <Heading size="small" weight="semibold">{product.name}</Heading>
              <Box display="flex" alignItems="center" gap="spacing.1" marginTop="spacing.1">
                <TagIcon size="xsmall" color="surface.icon.gray.subtle" />
                <Text size="xsmall" color="surface.text.gray.muted">{product.category}</Text>
              </Box>
            </Box>
            <IconButton 
              icon={MoreVerticalIcon} 
              accessibilityLabel="Product options" 
              size="small" 
              onClick={() => {}} 
            />
          </Box>

          {/* Pricing */}
          <Heading size="medium" color="surface.text.gray.normal">{product.price}</Heading>

          {/* Stock & Status Bar */}
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            paddingTop="spacing.2"
            borderTopWidth="thin"
            borderTopColor="surface.border.gray.muted"
          >
            <Text size="xsmall" color={product.stock > 0 ? 'surface.text.gray.subtle' : 'interactive.text.negative.normal'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Text>
            <Badge color={config.color} size="small">{config.label}</Badge>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}
