'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  Tabs, 
  TabItem, 
  Badge,
  PackageIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  UploadIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Dropdown,
  SelectInput,
  DropdownOverlay,
  ActionList,
  ActionListItem
} from '@razorpay/blade/components';
import { ProductCard, Product } from '@/components/ProductCard';
import { FilterPanel } from '@/components/FilterPanel';
import Link from 'next/link';

const mockProducts: Product[] = [
  { id: '1', name: 'Rockerz 450 Pro', category: 'Headphones', price: '₹2,499', stock: 120, status: 'active', sku: 'WE-100' },
  { id: '2', name: 'Wave Sync Max', category: 'Smartwatch', price: '₹3,999', stock: 85, status: 'active', sku: 'SW-200' },
  { id: '3', name: 'AirFlex 2.0 Shoes', category: 'Footwear', price: '₹4,299', stock: 64, status: 'active', sku: 'AF-300' },
  { id: '4', name: 'SoundCore Mini 3', category: 'Speakers', price: '₹1,999', stock: 8, status: 'low_stock', sku: 'SP-400' },
  { id: '5', name: 'Urban Laptop Backpack', category: 'Bags', price: '₹1,299', stock: 45, status: 'active', sku: 'BP-500' },
  { id: '6', name: 'Aviator Sunglasses', category: 'Eyewear', price: '₹1,199', stock: 72, status: 'active', sku: 'EY-600' },
  { id: '7', name: 'Stainless Steel Bottle', category: 'Drinkware', price: '₹699', stock: 150, status: 'active', sku: 'BT-700' },
  { id: '8', name: 'Cotton Crew Neck Tee', category: 'Apparel', price: '₹599', stock: 200, status: 'active', sku: 'TS-800' },
];

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  badgeColor 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ComponentType<any>; 
  badgeColor: 'primary' | 'positive' | 'negative' | 'notice';
}) {
  return (
    <Card elevation="none" backgroundColor="surface.background.gray.intense">
      <CardBody>
        <Box display="flex" alignItems="center" gap="spacing.4">
          <Box 
            width="40px" 
            height="40px" 
            borderRadius="medium" 
            backgroundColor={`surface.background.${badgeColor}.subtle` as any}
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <Icon size="medium" color={`interactive.icon.${badgeColor}.normal` as any} />
          </Box>
          <Box>
            <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">{title}</Text>
            <Heading size="medium" weight="semibold">{value}</Heading>
            <Text size="xsmall" color="surface.text.gray.subtle">{subtitle}</Text>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}

export default function ProductsPage() {
  const [selectedTab, setSelectedTab] = useState('all');

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
            <Button variant="primary" icon={PlusIcon} iconPosition="left">
              Create Product
            </Button>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.4" marginBottom="spacing.6">
          <StatCard title="Total products" value="1,248" subtitle="12 synced this week" icon={PackageIcon} badgeColor="primary" />
          <StatCard title="Active & Indexed" value="1,186" subtitle="95% AI ready" icon={CheckCircleIcon} badgeColor="positive" />
          <StatCard title="Out of stock" value="46" subtitle="AI will exclude" icon={AlertCircleIcon} badgeColor="negative" />
          <StatCard title="Low stock" value="16" subtitle="Action recommended" icon={AlertCircleIcon} badgeColor="notice" />
        </Box>

        {/* Tabs Filter */}
        <Box marginBottom="spacing.5">
          <Tabs variant="bordered">
            <TabItem value="all">All Products (1,248)</TabItem>
            <TabItem value="active">Active (1,186)</TabItem>
            <TabItem value="low_stock">Low Stock (16)</TabItem>
            <TabItem value="out_of_stock">Out of Stock (46)</TabItem>
            <TabItem value="drafts">Drafts (0)</TabItem>
          </Tabs>
        </Box>

        {/* Product Grid Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
          <Text size="small" weight="semibold" color="surface.text.gray.subtle">
            Showing 8 of 1,248 products
          </Text>
          <Box display="flex" alignItems="center" gap="spacing.3">
            <Dropdown>
              <SelectInput label="Sort" placeholder="Newest first" />
              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title="Newest first" value="newest" />
                  <ActionListItem title="Price: Low to High" value="price_asc" />
                  <ActionListItem title="Price: High to Low" value="price_desc" />
                  <ActionListItem title="Stock: High to Low" value="stock_desc" />
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </Box>
        </Box>

        {/* Product Grid with Blade */}
        <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, 1fr)', l: 'repeat(4, 1fr)' }} gap="spacing.4">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>

        {/* Pagination Footer */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          marginTop="spacing.8" 
          paddingTop="spacing.5" 
          borderTopWidth="thin" 
          borderTopColor="surface.border.gray.muted"
        >
          <Text size="small" color="surface.text.gray.muted">
            Showing 1 to 8 of 1,248 products
          </Text>
          <Box display="flex" gap="spacing.2">
            <Button variant="tertiary" size="small" icon={ChevronLeftIcon} />
            <Button variant="primary" size="small">1</Button>
            <Button variant="tertiary" size="small">2</Button>
            <Button variant="tertiary" size="small">3</Button>
            <Button variant="tertiary" size="small">156</Button>
            <Button variant="tertiary" size="small" icon={ChevronRightIcon} />
          </Box>
        </Box>

      </Box>

      {/* Filter Panel (Right Sidebar) */}
      <FilterPanel />
    </Box>
  );
}
