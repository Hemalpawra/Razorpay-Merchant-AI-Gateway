'use client';

import { useSearchParams } from 'next/navigation';
import {
  Box,
  Badge,
  Text,
  IconButton,
  CloseIcon,
} from '@razorpay/blade/components';

interface ActiveFilterChipProps {
  label: string;
  value: string | string[] | null;
  type: 'search' | 'category' | 'brand' | 'price' | 'rating' | 'availability';
  onRemove: () => void;
}

export function ActiveFilterChip({ label, value, type, onRemove }: ActiveFilterChipProps) {
  // Don't show chip if no value
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  let displayValue: string;
  let isMulti = false;

  switch (type) {
    case 'search':
      displayValue = `Search: "${value}"`;
      break;
    case 'category':
      displayValue = `Category: ${value}`;
      break;
    case 'brand':
      isMulti = true;
      displayValue = `${value.length} brand${value.length > 1 ? 's' : ''} selected`;
      break;
    case 'price':
      displayValue = `Max Price: ₹${Number(value).toLocaleString()}`;
      break;
    case 'rating':
      displayValue = `Rating: ${value}★ & above`;
      break;
    case 'availability':
      displayValue = value === 'true' ? 'In Stock Only' : 'On Sale Only';
      break;
    default:
      displayValue = String(value);
  }

  return (
    <Box display="flex" alignItems="center" gap="spacing.2">
      <Badge color="neutral" size="small">
        {displayValue}
      </Badge>
      <IconButton
        icon={CloseIcon}
        size="small"
        accessibilityLabel={`Remove ${label} filter`}
        onClick={onRemove}
      />
    </Box>
  );
}