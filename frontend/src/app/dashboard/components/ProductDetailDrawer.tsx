"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  IconButton,
  CloseIcon,
  Skeleton,
  CheckCircleIcon,
  EditIcon,
  SparklesIcon,
  ShoppingBagIcon
} from '@razorpay/blade/components';
import Link from 'next/link';

interface ProductDetails {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  tags: string[];
  shippingNote: string;
  returnNote: string;
  aiVisibility: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}

interface RelatedConversation {
  id: string;
  customerName: string;
  sessionId: string;
  status: string;
  score: number;
  timestamp: string;
}

interface LinkedOrder {
  id: string;
  amount: number;
  status: string;
  customerName: string;
  createdAt: string;
  quantity: number;
}

interface ProductDetailDrawerProps {
  productId: string;
  onClose: () => void;
  onEdit?: () => void;
}

export function ProductDetailDrawer({ productId, onClose, onEdit }: ProductDetailDrawerProps) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [relatedConversations, setRelatedConversations] = useState<RelatedConversation[]>([]);
  const [linkedOrders, setLinkedOrders] = useState<LinkedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'conversations' | 'orders'>('details');

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/details?product_id=${productId}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
        setRelatedConversations(data.relatedConversations || []);
        setLinkedOrders(data.linkedOrders || []);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'negative' as const, label: 'Out of Stock' };
    if (stock <= 5) return { color: 'notice' as const, label: 'Low Stock' };
    return { color: 'positive' as const, label: 'In Stock' };
  };

  if (isLoading) {
    return (
      <Box
        position="fixed"
        top="56px"
        right="spacing.0"
        width={{ base: '100%', m: '480px' }}
        height="calc(100vh - 56px)"
        backgroundColor="surface.background.gray.intense"
        borderLeftWidth="thin"
        borderLeftColor="surface.border.gray.muted"
        padding="spacing.6"
        display="flex"
        flexDirection="column"
        zIndex={100}
        overflow="auto"
      >
        <Skeleton height="300px" />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        position="fixed"
        top="56px"
        right="spacing.0"
        width={{ base: '100%', m: '480px' }}
        height="calc(100vh - 56px)"
        backgroundColor="surface.background.gray.intense"
        padding="spacing.6"
        zIndex={100}
      >
        <Text>Product not found</Text>
      </Box>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <Box
      position="fixed"
      top="56px"
      right="spacing.0"
      width={{ base: '100%', m: '480px' }}
      height="calc(100vh - 56px)"
      backgroundColor="surface.background.gray.intense"
      borderLeftWidth="thin"
      borderLeftColor="surface.border.gray.muted"
      padding="spacing.6"
      display="flex"
      flexDirection="column"
      zIndex={100}
      overflow="auto"
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.5">
        <Box flex={1}>
          <Heading size="medium" weight="semibold">{product.name}</Heading>
          <Text size="small" color="surface.text.gray.muted">SKU: {product.sku}</Text>
        </Box>
        <IconButton icon={CloseIcon} accessibilityLabel="Close drawer" size="medium" onClick={onClose} />
      </Box>

      <Box display="flex" flexWrap="wrap" gap="spacing.2" marginBottom="spacing.4">
        <Badge color={stockStatus.color} size="small">{stockStatus.label}</Badge>
        <Badge color="neutral" size="small">{product.status}</Badge>
        <Badge color={product.aiVisibility ? 'positive' : 'neutral'} size="small">
          {product.aiVisibility ? 'Visible to AI' : 'Hidden from AI'}
        </Badge>
      </Box>

      <Box display="flex" gap="spacing.2" marginBottom="spacing.4">
        <Button
          variant={activeTab === 'details' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setActiveTab('details')}
        >
          Details
        </Button>
        <Button
          variant={activeTab === 'conversations' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setActiveTab('conversations')}
        >
          AI ({relatedConversations.length})
        </Button>
        <Button
          variant={activeTab === 'orders' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setActiveTab('orders')}
        >
          Orders ({linkedOrders.length})
        </Button>
      </Box>

      {activeTab === 'details' && (
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Card elevation="none" backgroundColor="surface.background.gray.subtle">
            <CardBody>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.4">
                <Box>
                  <Text size="xsmall" color="surface.text.gray.muted">Price</Text>
                  <Text size="large" weight="semibold">₹{product.price.toLocaleString('en-IN')}</Text>
                </Box>
                <Box>
                  <Text size="xsmall" color="surface.text.gray.muted">Stock</Text>
                  <Text size="large" weight="semibold">{product.stock} units</Text>
                  {stockStatus.color !== 'positive' && (
                    <Badge color={stockStatus.color} size="small">{stockStatus.label}</Badge>
                  )}
                </Box>
              </Box>
            </CardBody>
          </Card>

          {product.description && (
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" marginBottom="spacing.2">Description</Text>
                <Text size="small">{product.description}</Text>
              </CardBody>
            </Card>
          )}

          <Card elevation="none" backgroundColor="surface.background.gray.subtle">
            <CardBody>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Text size="xsmall" color="surface.text.gray.muted">Category</Text>
                  <Text size="small" weight="semibold">{product.category}</Text>
                </Box>
                {product.tags.length > 0 && (
                  <Box display="flex" gap="spacing.1" flexWrap="wrap">
                    {product.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} color="neutral" size="small">{tag}</Badge>
                    ))}
                  </Box>
                )}
              </Box>
            </CardBody>
          </Card>

          {product.shippingNote && (
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" marginBottom="spacing.2">Shipping Note</Text>
                <Text size="small">{product.shippingNote}</Text>
              </CardBody>
            </Card>
          )}

          {product.returnNote && (
            <Card elevation="none" backgroundColor="surface.background.gray.subtle">
              <CardBody>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.muted" marginBottom="spacing.2">Return Policy</Text>
                <Text size="small">{product.returnNote}</Text>
              </CardBody>
            </Card>
          )}
        </Box>
      )}

      {activeTab === 'conversations' && (
        <Box display="flex" flexDirection="column" gap="spacing.3">
          {relatedConversations.length === 0 ? (
            <Text size="small" color="surface.text.gray.muted">No AI conversations have mentioned this product yet.</Text>
          ) : (
            relatedConversations.map((conv) => (
              <Card key={conv.id} elevation="none" backgroundColor="surface.background.gray.subtle">
                <CardBody>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Text size="small" weight="semibold">{conv.customerName}</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">
                        Match Score: {(conv.score * 100).toFixed(0)}%
                      </Text>
                    </Box>
                    <Badge color={conv.status === 'paid' ? 'positive' : 'notice'} size="small">
                      {conv.status}
                    </Badge>
                  </Box>
                  <Link href={`/dashboard/ai-agent?session=${conv.sessionId}`} style={{ textDecoration: 'none' }}>
                    <Button variant="tertiary" size="xsmall" marginTop="spacing.2" icon={SparklesIcon} iconPosition="left">
                      View Conversation
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))
          )}
        </Box>
      )}

      {activeTab === 'orders' && (
        <Box display="flex" flexDirection="column" gap="spacing.3">
          {linkedOrders.length === 0 ? (
            <Text size="small" color="surface.text.gray.muted">No orders contain this product yet.</Text>
          ) : (
            linkedOrders.map((order) => (
              <Card key={order.id} elevation="none" backgroundColor="surface.background.gray.subtle">
                <CardBody>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Text size="small" weight="semibold">₹{order.amount.toLocaleString('en-IN')}</Text>
                      <Text size="xsmall" color="surface.text.gray.muted">
                        Qty: {order.quantity} • {order.customerName}
                      </Text>
                    </Box>
                    <Badge color={order.status === 'paid' ? 'positive' : 'notice'} size="small">
                      {order.status}
                    </Badge>
                  </Box>
                  <Link href={`/dashboard/orders?order=${order.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="tertiary" size="xsmall" marginTop="spacing.2" icon={ShoppingBagIcon} iconPosition="left">
                      View Order
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))
          )}
        </Box>
      )}

      <Box marginTop="spacing.4" display="flex" gap="spacing.3">
        <Button variant="primary" icon={EditIcon} iconPosition="left" onClick={onEdit} isFullWidth>
          Edit Product
        </Button>
      </Box>
    </Box>
  );
}