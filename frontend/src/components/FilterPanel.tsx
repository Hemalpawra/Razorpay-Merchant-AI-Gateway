'use client';

import React from 'react';
import { 
  Box, 
  Text, 
  Heading, 
  TextInput, 
  Button, 
  SelectInput, 
  ActionList, 
  ActionListItem, 
  Dropdown, 
  DropdownOverlay,
  SlidersIcon
} from '@razorpay/blade/components';

export function FilterPanel() {
  return (
    <Box 
      width="300px" 
      padding="spacing.6"
      backgroundColor="surface.background.gray.intense"
      borderLeftWidth="thin"
      borderLeftColor="surface.border.gray.muted"
      display="flex"
      flexDirection="column"
      gap="spacing.5"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap="spacing.2">
          <SlidersIcon size="small" color="surface.icon.primary.normal" />
          <Heading size="small" weight="semibold">Filters</Heading>
        </Box>
        <Button variant="tertiary" size="small">Clear all</Button>
      </Box>

      <TextInput label="Keyword" placeholder="Filter by name, SKU..." />

      <Box>
        <Dropdown>
          <SelectInput label="Category" placeholder="All categories" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="All categories" value="all" />
              <ActionListItem title="Headphones" value="headphones" />
              <ActionListItem title="Smartwatch" value="smartwatch" />
              <ActionListItem title="Footwear" value="footwear" />
              <ActionListItem title="Apparel" value="apparel" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>

      <Box>
        <Dropdown>
          <SelectInput label="Status" placeholder="All status" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="All status" value="all" />
              <ActionListItem title="Active" value="active" />
              <ActionListItem title="Draft" value="draft" />
              <ActionListItem title="Low Stock" value="low_stock" />
              <ActionListItem title="Out of Stock" value="out_of_stock" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>

      <Box>
        <Text size="small" weight="semibold" marginBottom="spacing.2">Price range (₹)</Text>
        <Box display="flex" alignItems="center" gap="spacing.2">
          <TextInput label="Min Price" placeholder="Min" />
          <Text size="small" color="surface.text.gray.muted">-</Text>
          <TextInput label="Max Price" placeholder="Max" />
        </Box>
      </Box>

      <Box>
        <Dropdown>
          <SelectInput label="Sort By" placeholder="Newest first" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Newest first" value="newest" />
              <ActionListItem title="Oldest first" value="oldest" />
              <ActionListItem title="Price: Low to High" value="price_asc" />
              <ActionListItem title="Price: High to Low" value="price_desc" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>

      <Box marginTop="auto" display="flex" flexDirection="column" gap="spacing.2">
        <Button variant="primary" isFullWidth>Apply filters</Button>
        <Button variant="secondary" isFullWidth>Reset filters</Button>
      </Box>
    </Box>
  );
}
