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
  TextInput,
  Alert,
  CheckCircleIcon,
} from '@razorpay/blade/components';

interface ProductData {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  aiVisibility: boolean;
  status: string;
}

interface ProductEditDrawerProps {
  productId: string;
  onClose: () => void;
  onSave?: () => void;
}

export function ProductEditDrawer({ productId, onClose, onSave }: ProductEditDrawerProps) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/details?product_id=${productId}`);
      const data = await res.json();
      if (data.product) {
        const p = data.product;
        setProduct(p);
        setName(p.name);
        setSku(p.sku);
        setPrice(p.price?.toString() || '');
        setStock(p.stock?.toString() || '');
        setCategory(p.category || '');
        setDescription(p.description || '');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!price || parseFloat(price) < 0) {
      setError('Valid price is required');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const res = await fetch('/api/products/details', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          name: name.trim(),
          sku: sku.trim(),
          price: parseFloat(price),
          stock: parseInt(stock) || 0,
          category: category.trim(),
          description: description.trim(),
        })
      });

      if (res.ok) {
        setSuccess(true);
        if (onSave) onSave();
        setTimeout(onClose, 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
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
        <Text>Loading...</Text>
      </Box>
    );
  }

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
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.5">
        <Box display="flex" alignItems="center" gap="spacing.2">
          <Heading size="medium" weight="semibold">Edit Product</Heading>
          <Badge color="information" size="small">Editing</Badge>
        </Box>
        <IconButton icon={CloseIcon} accessibilityLabel="Close drawer" size="medium" onClick={onClose} />
      </Box>

      {success && (
        <Alert
          color="positive"
          title="Product Saved Successfully"
          description="Your changes have been saved."
        />
      )}

      {error && (
        <Alert
          color="negative"
          title="Error"
          description={error}
          marginBottom="spacing.4"
        />
      )}

      <Box display="flex" flexDirection="column" gap="spacing.4" flex={1}>
        <TextInput
          label="Product Name"
          value={name}
          onChange={({ value }) => setName(value || '')}
          placeholder="Enter product name"
        />
        
        <TextInput
          label="SKU"
          value={sku}
          onChange={({ value }) => setSku(value || '')}
          placeholder="Enter SKU"
        />
        
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.4">
          <TextInput
            label="Price"
            value={price}
            onChange={({ value }) => setPrice(value || '')}
            placeholder="0.00"
          />
          <TextInput
            label="Stock"
            value={stock}
            onChange={({ value }) => setStock(value || '')}
            placeholder="0"
          />
        </Box>

        <TextInput
          label="Category"
          value={category}
          onChange={({ value }) => setCategory(value || '')}
          placeholder="Enter category"
        />

        <TextInput
          label="Description"
          value={description}
          onChange={({ value }) => setDescription(value || '')}
          placeholder="Enter product description"
        />
      </Box>

      <Box display="flex" gap="spacing.3" marginTop="spacing.4">
        <Button variant="tertiary" onClick={onClose} isFullWidth>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          isDisabled={isSaving || success}
          isLoading={isSaving}
          isFullWidth
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
}