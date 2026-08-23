'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  Badge, 
  TextInput,
  SearchIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from '@razorpay/blade/components';

interface ProductPreviewRow {
  row: number;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  status: 'Active' | 'Draft' | 'Archived';
  issue: string | null;
}

const PREVIEW_ROWS: ProductPreviewRow[] = [
  { row: 1, name: 'Wireless Earbuds Pro', sku: 'WE-100', category: 'Electronics > Audio', price: '₹1,999.00', stock: '50', status: 'Active', issue: null },
  { row: 2, name: 'Smart Fitness Watch 2', sku: 'SW-200', category: 'Electronics > Wearables', price: '₹4,999.00', stock: '30', status: 'Active', issue: null },
  { row: 3, name: 'Bluetooth Portable Speaker', sku: 'BS-300', category: 'Electronics > Audio', price: '₹2,499.00', stock: '15', status: 'Active', issue: 'Duplicate SKU' },
  { row: 4, name: 'Ergonomic Gaming Mouse', sku: 'GM-400', category: 'Accessories > Computing', price: '₹1,299.00', stock: '25', status: 'Active', issue: null },
  { row: 5, name: 'Fast Charging USB-C Cable (2m)', sku: 'UC-500', category: 'Accessories > Cables', price: '₹299.00', stock: '0', status: 'Active', issue: 'Missing stock' },
];

export function PreviewState({ 
  onNext, 
  onBack 
}: { 
  onNext: () => void; 
  onBack: () => void; 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = PREVIEW_ROWS.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Top Metrics Cards with Search */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(4, 1fr)' }} gap="spacing.4">
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Text size="small" color="surface.text.gray.subtle">Total rows</Text>
              <Heading size="xlarge" weight="semibold">1,248</Heading>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Text size="small" color="surface.text.gray.subtle">Valid rows</Text>
              <Heading size="xlarge" weight="semibold">1,132</Heading>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Text size="small" color="surface.text.gray.subtle">Invalid rows</Text>
              <Heading size="xlarge" weight="semibold">86</Heading>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Text size="small" color="surface.text.gray.subtle">Duplicates</Text>
              <Heading size="xlarge" weight="semibold">30</Heading>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Preview Table Card */}
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            {/* Search and Table Actions Toolbar */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap="spacing.3">
                <Heading size="small" weight="semibold">Parsed Products Preview</Heading>
                <Badge color="neutral" size="small">1,248 products</Badge>
              </Box>
              <Box width="300px">
                <TextInput 
                  label=""
                  accessibilityLabel="Search preview"
                  placeholder="Search by product name, SKU..."
                  leadingIcon={SearchIcon}
                  value={searchQuery}
                  onChange={({ value }) => setSearchQuery(value || '')}
                />
              </Box>
            </Box>

            {/* Table Content */}
            <Box display="flex" flexDirection="column">
              {/* Header */}
              <Box 
                display="grid" 
                gridTemplateColumns="0.6fr 3fr 1.5fr 2.5fr 1.5fr 1fr 1.2fr 1.8fr" 
                padding="spacing.4" 
                paddingX="spacing.5"
                backgroundColor="surface.background.gray.subtle"
                borderBottomWidth="thin" 
                borderBottomColor="surface.border.gray.muted"
                borderRadius="small"
              >
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">ROW</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">PRODUCT NAME</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">SKU</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">CATEGORY</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">PRICE (INR)</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">STOCK</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">STATUS</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">VALIDATION</Text>
              </Box>

              {/* Data Rows */}
              {filteredRows.map((row, idx) => (
                <Box 
                  key={row.row}
                  display="grid" 
                  gridTemplateColumns="0.6fr 3fr 1.5fr 2.5fr 1.5fr 1fr 1.2fr 1.8fr" 
                  paddingY="spacing.4"
                  paddingX="spacing.5"
                  borderBottomWidth={idx === filteredRows.length - 1 ? 'none' : 'thin'}
                  borderBottomColor="surface.border.gray.muted"
                  alignItems="center"
                >
                  <Text size="small" color="surface.text.gray.subtle">#{row.row}</Text>
                  <Text size="small" weight="semibold">{row.name}</Text>
                  <Text size="small" color="surface.text.gray.subtle">{row.sku}</Text>
                  <Text size="small" color="surface.text.gray.subtle">{row.category}</Text>
                  <Text size="small" weight="medium">{row.price}</Text>
                  <Text size="small">{row.stock}</Text>
                  <Box>
                    <Badge color="positive" size="small">{row.status}</Badge>
                  </Box>
                  <Box>
                    {row.issue ? (
                      <Badge color="notice" size="small" icon={AlertTriangleIcon}>{row.issue}</Badge>
                    ) : (
                      <Badge color="positive" size="small" icon={CheckCircleIcon}>Valid</Badge>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Pagination Controls */}
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center" 
              paddingTop="spacing.4" 
              borderTopWidth="thin" 
              borderTopColor="surface.border.gray.muted"
            >
              <Text size="small" color="surface.text.gray.subtle">
                Showing 1 to 5 of 1,248 products
              </Text>
              <Box display="flex" gap="spacing.2" alignItems="center">
                <Button 
                  variant={currentPage === 1 ? 'primary' : 'secondary'} 
                  size="small" 
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </Button>
                <Button 
                  variant={currentPage === 2 ? 'primary' : 'secondary'} 
                  size="small" 
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </Button>
                <Button 
                  variant={currentPage === 3 ? 'primary' : 'secondary'} 
                  size="small" 
                  onClick={() => setCurrentPage(3)}
                >
                  3
                </Button>
                <Text size="small" color="surface.text.gray.subtle">...</Text>
                <Button 
                  variant={currentPage === 250 ? 'primary' : 'secondary'} 
                  size="small" 
                  onClick={() => setCurrentPage(250)}
                >
                  250
                </Button>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Footer Navigation */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        paddingTop="spacing.4"
        borderTopWidth="thin"
        borderTopColor="surface.border.gray.muted"
      >
        <Button variant="secondary" icon={ArrowLeftIcon} iconPosition="left" onClick={onBack}>
          Back to validation
        </Button>
        <Button variant="primary" icon={ChevronRightIcon} iconPosition="right" onClick={onNext}>
          Continue to duplicates
        </Button>
      </Box>
    </Box>
  );
}
