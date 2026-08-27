'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  Skeleton,
  Tabs, 
  TabItem, 
  PackageIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  UploadIcon,
  PlusIcon,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput
} from '@razorpay/blade/components';
import { ProductCard, Product } from '@/components/ProductCard';
import { FilterPanel } from '@/components/FilterPanel';
import Link from 'next/link';

export default function ProductsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New product form state
  const [newSKU, setNewSKU] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newCategory, setNewCategory] = useState('Electronics');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?status=all');
      const data = await res.json();
      if (data.products) {
        const mapped: Product[] = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category || 'General',
          price: `₹${Number(p.price).toLocaleString('en-IN')}`,
          stock: p.stock_qty || 0,
          status: p.status !== 'active' ? (p.status || 'active') : p.stock_qty <= 0 ? 'out_of_stock' : p.stock_qty <= 10 ? 'low_stock' : 'active',
          sku: p.sku
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    if (!newName || !newPrice || !newSKU) {
      alert('Please enter SKU, Name and Price');
      return;
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: newSKU,
          name: newName,
          category: newCategory,
          price: parseFloat(newPrice),
          stock_qty: parseInt(newStock) || 10,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewSKU('');
        setNewName('');
        setNewPrice('');
        fetchProducts();
      } else {
        const err = await res.json();
        alert(`Failed to create product: ${err.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedTab === 'active') return p.status === 'active';
    if (selectedTab === 'low_stock') return p.status === 'low_stock';
    if (selectedTab === 'out_of_stock') return p.status === 'out_of_stock';
    return true;
  });

  const activeCount = products.filter((p) => p.status === 'active').length;
  const lowStockCount = products.filter((p) => p.status === 'low_stock').length;
  const outOfStockCount = products.filter((p) => p.status === 'out_of_stock').length;

  return (
    <Box display="flex" height="100%">
      {/* Main Content Area */}
      <Box flex={1} padding="spacing.8" overflow="auto">
        
        {/* Page Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom="spacing.6">
          <Box>
            <Heading size="2xlarge" marginBottom="spacing.2">Products</Heading>
            <Text color="surface.text.gray.subtle">
              Manage product inventory, pricing, and AI search indexing for Merchant AI Gateway.
            </Text>
          </Box>
          <Box display="flex" gap="spacing.3">
            <Link href="/dashboard/import" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" icon={UploadIcon} iconPosition="left">
                Import Products
              </Button>
            </Link>
            <Button variant="primary" icon={PlusIcon} iconPosition="left" onClick={() => setShowCreateModal(true)}>
              Create Product
            </Button>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.4" marginBottom="spacing.6">
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" alignItems="center" gap="spacing.4">
                <Box width="40px" height="40px" borderRadius="medium" backgroundColor="surface.background.primary.subtle" display="flex" alignItems="center" justifyContent="center">
                  <PackageIcon size="medium" color="interactive.icon.primary.normal" />
                </Box>
                <Box>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Total products</Text>
                  <Heading size="medium" weight="semibold">{products.length}</Heading>
                  <Text size="xsmall" color="surface.text.gray.subtle">Synced with Supabase DB</Text>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" alignItems="center" gap="spacing.4">
                <Box width="40px" height="40px" borderRadius="medium" backgroundColor="surface.background.sea.subtle" display="flex" alignItems="center" justifyContent="center">
                  <CheckCircleIcon size="medium" color="interactive.icon.positive.normal" />
                </Box>
                <Box>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Active &amp; Indexed</Text>
                  <Heading size="medium" weight="semibold">{activeCount}</Heading>
                  <Text size="xsmall" color="surface.text.gray.subtle">AI Search Ready</Text>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" alignItems="center" gap="spacing.4">
                <Box width="40px" height="40px" borderRadius="medium" backgroundColor="surface.background.cloud.subtle" display="flex" alignItems="center" justifyContent="center">
                  <AlertCircleIcon size="medium" color="interactive.icon.negative.normal" />
                </Box>
                <Box>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Out of stock</Text>
                  <Heading size="medium" weight="semibold">{outOfStockCount}</Heading>
                  <Text size="xsmall" color="surface.text.gray.subtle">AI will exclude</Text>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" alignItems="center" gap="spacing.4">
                <Box width="40px" height="40px" borderRadius="medium" backgroundColor="surface.background.cloud.subtle" display="flex" alignItems="center" justifyContent="center">
                  <AlertCircleIcon size="medium" color="interactive.icon.notice.normal" />
                </Box>
                <Box>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">Low stock</Text>
                  <Heading size="medium" weight="semibold">{lowStockCount}</Heading>
                  <Text size="xsmall" color="surface.text.gray.subtle">Action recommended</Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Filter Tabs */}
        <Box marginBottom="spacing.5" width="100%" overflowX="auto">
          <Box display="flex" width="100%" minWidth="max-content">
            <Tabs variant="bordered" value={selectedTab} onChange={({ value }: any) => setSelectedTab(value || 'all')}>
              <TabItem value="all">{`All Products (${products.length})`}</TabItem>
              <TabItem value="active">{`Active (${activeCount})`}</TabItem>
              <TabItem value="low_stock">{`Low Stock (${lowStockCount})`}</TabItem>
              <TabItem value="out_of_stock">{`Out of Stock (${outOfStockCount})`}</TabItem>
            </Tabs>
          </Box>
        </Box>

        {/* Product Grid */}
        {isLoading ? (
          <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} elevation="none" backgroundColor="surface.background.gray.intense">
                <CardBody>
                  <Skeleton height="120px" />
                </CardBody>
              </Card>
            ))}
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Card elevation="none">
            <CardBody>
              <Text size="medium" weight="semibold">No products found</Text>
              <Text size="small" color="surface.text.gray.muted" marginTop="spacing.1">
                Click "Create Product" or "Import Products" to populate your catalog.
              </Text>
            </CardBody>
          </Card>
        ) : (
          <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        )}

      </Box>

      {/* Filter Panel (Right Sidebar) */}
      <FilterPanel />

      {/* Create Product Modal */}
      <Modal isOpen={showCreateModal} onDismiss={() => setShowCreateModal(false)}>
        <ModalHeader title="Create New Product" subtitle="Add a product to your catalog and index it for AI Search." />
        <ModalBody>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <TextInput label="SKU" value={newSKU} onChange={({ value }: any) => setNewSKU(value || '')} placeholder="e.g. LAP-100" />
            <TextInput label="Product Name" value={newName} onChange={({ value }: any) => setNewName(value || '')} placeholder="e.g. Wireless Noise Cancelling Headphones" />
            <TextInput label="Category" value={newCategory} onChange={({ value }: any) => setNewCategory(value || '')} placeholder="e.g. Electronics" />
            <TextInput label="Price (INR)" value={newPrice} onChange={({ value }: any) => setNewPrice(value || '')} placeholder="e.g. 4999" type="number" />
            <TextInput label="Stock Quantity" value={newStock} onChange={({ value }: any) => setNewStock(value || '')} placeholder="e.g. 25" type="number" />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreateProduct}>Save Product</Button>
        </ModalFooter>
      </Modal>

    </Box>
  );
}
