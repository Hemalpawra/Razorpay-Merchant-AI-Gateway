'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  TextInput,
  SelectInput,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  // Icons
  PackageIcon,
  SearchIcon,
  FilterIcon,
  SparklesIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

export default function StoreProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const products = [
    { id: '1', name: 'Asus TUF F15 Gaming Laptop', price: '₹54,999', category: 'Gaming', desc: 'Core i5 11th Gen, 16GB RAM, RTX 3050, 144Hz FHD', sku: 'ASUS-TUF-F15' },
    { id: '2', name: 'Lenovo IdeaPad Gaming 3', price: '₹56,990', category: 'Gaming', desc: 'AMD Ryzen 5 5600H, 8GB RAM, RTX 3050, 512GB SSD', sku: 'LEN-IPG3' },
    { id: '3', name: 'Acer Nitro 5 Gaming Laptop', price: '₹55,990', category: 'Gaming', desc: 'Intel Core i5 12th Gen, 8GB RAM, RTX 3050', sku: 'ACER-N5' },
    { id: '4', name: 'Wireless Mechanical Keyboard', price: '₹4,499', category: 'Accessories', desc: 'Hot-swappable RGB mechanical switches, Bluetooth 5.1', sku: 'MK-100' },
    { id: '5', name: 'Wireless Ergonomic Mouse', price: '₹1,299', category: 'Accessories', desc: 'Precision optical sensor, dual mode 2.4G + BT', sku: 'WM-200' },
    { id: '6', name: 'Wireless Noise Cancelling Earbuds', price: '₹1,999', category: 'Audio', desc: 'Active Noise Cancellation, 30h battery life, IPX5', sku: 'WE-100' },
  ];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchQuery && matchCat;
    });
  }, [search, categoryFilter]);

  return (
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6">

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="2xlarge" weight="semibold">Products Catalog</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Explore products available for instant purchasing by customers and AI buyers.
          </Text>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexWrap="wrap" gap="spacing.4" alignItems="center" justifyContent="space-between">
            <Box width={{ base: '100%', m: '360px' }}>
              <TextInput
                label=""
                accessibilityLabel="Search store catalog"
                placeholder="Search products by name, specs, SKU..."
                value={search}
                onChange={({ value }) => setSearch(value || '')}
              />
            </Box>

            <Dropdown>
              <SelectInput label="" accessibilityLabel="Category filter" placeholder="Category: All" />
              <DropdownOverlay>
                <ActionList>
                  <ActionListItem title="All Categories" value="all" onClick={() => setCategoryFilter('all')} />
                  <ActionListItem title="Gaming" value="gaming" onClick={() => setCategoryFilter('gaming')} />
                  <ActionListItem title="Accessories" value="accessories" onClick={() => setCategoryFilter('accessories')} />
                  <ActionListItem title="Audio" value="audio" onClick={() => setCategoryFilter('audio')} />
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </Box>
        </CardBody>
      </Card>

      {/* Products Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(3,1fr)' }}
        gap="spacing.6"
      >
        {filtered.map((p) => (
          <Card key={p.id} elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.3" height="100%">
                <Box
                  height="160px"
                  borderRadius="small"
                  backgroundColor="surface.background.gray.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <PackageIcon size="large" color="surface.icon.gray.subtle" />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Badge color="information" size="small">{p.category}</Badge>
                  <Text size="xsmall" color="surface.text.gray.muted">SKU: {p.sku}</Text>
                </Box>

                <Heading size="small" weight="semibold">{p.name}</Heading>
                <Text size="xsmall" color="surface.text.gray.subtle">{p.desc}</Text>

                <Box marginTop="auto" paddingTop="spacing.3" display="flex" justifyContent="space-between" alignItems="center">
                  <Heading size="medium" weight="semibold" color="interactive.text.primary.normal">{p.price}</Heading>
                  <Box display="flex" gap="spacing.2">
                    <Link href={`/store/checkout?product=${encodeURIComponent(p.name)}&price=${encodeURIComponent(p.price)}`} style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="small">Buy Now</Button>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        ))}
      </Box>

    </Box>
  );
}
