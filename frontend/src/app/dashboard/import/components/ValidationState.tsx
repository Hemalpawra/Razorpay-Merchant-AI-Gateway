'use client';

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  Badge, 
  AlertCircleIcon, 
  AlertTriangleIcon,
  DownloadIcon,
  RefreshIcon,
  ArrowLeftIcon,
  ChevronRightIcon
} from '@razorpay/blade/components';

interface IssueItem {
  id: string;
  type: 'error' | 'warning';
  issue: string;
  rows: string;
  count: number;
  example: string;
  fix: string;
}

const ISSUES_DATA: IssueItem[] = [
  { id: '1', type: 'error', issue: 'Missing required field: Price', rows: '27, 45, 89, 112, +24 more', count: 27, example: 'SKU: WE-100', fix: 'Add price for these rows' },
  { id: '2', type: 'error', issue: 'Duplicate SKU found in catalog', rows: '14, 98, 256, 487, +26 more', count: 30, example: 'SKU: WE-100', fix: 'Remove or rename duplicates' },
  { id: '3', type: 'warning', issue: 'Invalid price format (non-numeric string)', rows: '33, 66, 77, 101, +12 more', count: 16, example: 'Price: "abc"', fix: 'Use numeric values only' },
  { id: '4', type: 'error', issue: 'Invalid image URL (protocol missing)', rows: '21, 56, 203, +6 more', count: 8, example: 'htp://img.png', fix: 'Use valid https:// URL' },
  { id: '5', type: 'warning', issue: 'Stock quantity missing (will default to 0)', rows: '19, 42, 105, 133, +18 more', count: 22, example: 'Stock: "-"', fix: 'Add inventory stock' },
];

export function ValidationState({ 
  onNext, 
  onBack 
}: { 
  onNext: () => void; 
  onBack: () => void; 
}) {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Top Metrics Cards */}
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
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Text size="small" color="surface.text.gray.subtle">Valid rows</Text>
                <Badge color="positive" size="small">Ready</Badge>
              </Box>
              <Heading size="xlarge" weight="semibold">1,132</Heading>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Text size="small" color="surface.text.gray.subtle">Invalid rows</Text>
                <Badge color="negative" size="small">Errors</Badge>
              </Box>
              <Heading size="xlarge" weight="semibold">86</Heading>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Text size="small" color="surface.text.gray.subtle">Duplicates</Text>
                <Badge color="notice" size="small">Warning</Badge>
              </Box>
              <Heading size="xlarge" weight="semibold">30</Heading>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Issues Table Panel */}
      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap="spacing.3">
            <Heading size="small" weight="semibold">Issues found (86)</Heading>
            <Badge color="negative" size="small">65 Errors</Badge>
            <Badge color="notice" size="small">38 Warnings</Badge>
          </Box>
          <Button variant="tertiary" onClick={onNext}>
            View full parsed preview
          </Button>
        </Box>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column">
              {/* Header */}
              <Box 
                display="grid" 
                gridTemplateColumns="3fr 2fr 1fr 1.5fr 2.5fr" 
                padding="spacing.4" 
                paddingX="spacing.5"
                backgroundColor="surface.background.gray.subtle"
                borderBottomWidth="thin" 
                borderBottomColor="surface.border.gray.muted"
                borderRadius="small"
              >
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">ISSUE TYPE</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">AFFECTED ROWS</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">COUNT</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">EXAMPLE</Text>
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">HOW TO FIX</Text>
              </Box>

              {/* Rows */}
              {ISSUES_DATA.map((row, idx) => (
                <Box 
                  key={row.id}
                  display="grid" 
                  gridTemplateColumns="3fr 2fr 1fr 1.5fr 2.5fr" 
                  paddingY="spacing.4"
                  paddingX="spacing.5"
                  borderBottomWidth={idx === ISSUES_DATA.length - 1 ? 'none' : 'thin'}
                  borderBottomColor="surface.border.gray.muted"
                  alignItems="center"
                >
                  {/* Issue */}
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    {row.type === 'error' ? (
                      <AlertCircleIcon size="medium" color="surface.icon.gray.normal" />
                    ) : (
                      <AlertTriangleIcon size="medium" color="surface.icon.gray.normal" />
                    )}
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">{row.issue}</Text>
                      <Text size="xsmall" color="surface.text.gray.subtle">
                        {row.type === 'error' ? 'Blocks import of affected rows' : 'Will be sanitized automatically'}
                      </Text>
                    </Box>
                  </Box>

                  {/* Rows */}
                  <Box>
                    <Badge color="neutral" size="small">{row.rows}</Badge>
                  </Box>

                  {/* Count */}
                  <Box>
                    <Text size="small" weight="semibold">{row.count}</Text>
                  </Box>

                  {/* Example */}
                  <Box>
                    <Text size="small" color="surface.text.gray.subtle">{row.example}</Text>
                  </Box>

                  {/* How to Fix */}
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <Text size="small" weight="semibold" color="surface.text.primary.normal">
                      {row.fix}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Footer Actions */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        paddingTop="spacing.4"
        borderTopWidth="thin"
        borderTopColor="surface.border.gray.muted"
      >
        <Button variant="secondary" icon={ArrowLeftIcon} iconPosition="left" onClick={onBack}>
          Back to mapping
        </Button>
        <Box display="flex" gap="spacing.4">
          <Button variant="secondary" icon={DownloadIcon} iconPosition="left">
            Download issues report (.csv)
          </Button>
          <Button variant="primary" icon={ChevronRightIcon} iconPosition="right" onClick={onNext}>
            Proceed to preview
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
