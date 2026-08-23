'use client';

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  Alert, 
  Badge,
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  DownloadIcon,
  RefreshIcon,
  UploadIcon,
  FileTextIcon
} from '@razorpay/blade/components';
import Link from 'next/link';

export function ResultState({ 
  type, 
  onReset 
}: { 
  type: 'success' | 'partial' | 'error'; 
  onReset: () => void; 
}) {
  
  // State 10: Error State
  if (type === 'error') {
    return (
      <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="840px" marginX="auto" width="100%">
        <Alert
          title="Failed to process file"
          description="We couldn't parse your file. Please check the file encoding, column structure, and format before trying again."
          color="negative"
          isFullWidth
          isDismissible={false}
        />

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Heading size="small" weight="semibold">Error details & diagnostics</Heading>
                <Text size="small" color="surface.text.gray.subtle">
                  Parser encountered unexpected formatting at line 12: Column count mismatch (expected 11, found 9).
                </Text>
              </Box>

              <Box 
                padding="spacing.4" 
                backgroundColor="surface.background.gray.subtle" 
                borderRadius="small" 
                borderWidth="thin"
                borderColor="surface.border.gray.muted"
              >
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">
                  ERROR CODE: CSV_MALFORMED_ROW_12
                </Text>
                <Text size="small" marginTop="spacing.1">
                  Suggestion: Ensure all quoted fields are properly escaped and no extra commas exist in product descriptions.
                </Text>
              </Box>

              <Box display="flex" gap="spacing.4" marginTop="spacing.2">
                <Button variant="primary" icon={RefreshIcon} iconPosition="left" onClick={onReset}>
                  Try again
                </Button>
                <Button variant="secondary" icon={UploadIcon} iconPosition="left" onClick={onReset}>
                  Upload another file
                </Button>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>
    );
  }

  const isPartial = type === 'partial';

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Blade Result Alert */}
      <Alert
        title={isPartial ? 'Import completed with some issues' : 'Import completed successfully!'}
        description={
          isPartial
            ? '1,062 products imported successfully. 86 rows failed to import due to validation errors.'
            : '1,132 products imported into Merchant AI Gateway. 30 duplicates skipped, 86 rows had non-fatal warnings.'
        }
        color={isPartial ? 'notice' : 'positive'}
        isFullWidth
        isDismissible={false}
      />

      {/* Summary Metrics Cards */}
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
                <Text size="small" color="surface.text.gray.subtle">Imported successfully</Text>
                <Badge color="positive" size="small">Active</Badge>
              </Box>
              <Heading size="xlarge" weight="semibold">
                {isPartial ? '1,062' : '1,132'}
              </Heading>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Text size="small" color="surface.text.gray.subtle">Failed rows</Text>
                {isPartial ? <Badge color="negative" size="small">Action needed</Badge> : <Badge color="neutral" size="small">Resolved</Badge>}
              </Box>
              <Heading size="xlarge" weight="semibold">86</Heading>
            </Box>
          </CardBody>
        </Card>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Text size="small" color="surface.text.gray.subtle">Duplicates skipped</Text>
                <Badge color="notice" size="small">Skipped</Badge>
              </Box>
              <Heading size="xlarge" weight="semibold">30</Heading>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Action Buttons Bar */}
      <Box display="flex" gap="spacing.4" alignItems="center">
        <Link href="/dashboard/products">
          <Button variant="primary">
            View Products in Catalog
          </Button>
        </Link>
        <Button variant="secondary" icon={DownloadIcon} iconPosition="left">
          Download error report (.csv)
        </Button>
        {isPartial ? (
          <Button variant="secondary" icon={RefreshIcon} iconPosition="left" onClick={onReset}>
            Fix failed rows & re-import
          </Button>
        ) : (
          <Button variant="secondary" icon={UploadIcon} iconPosition="left" onClick={onReset}>
            Import another file
          </Button>
        )}
      </Box>

      {/* Breakdown or History Panel */}
      {isPartial ? (
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Heading size="small" weight="semibold">Failed rows summary</Heading>
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column">
                <Box 
                  display="grid" 
                  gridTemplateColumns="4fr 1.5fr 2fr" 
                  paddingBottom="spacing.4" 
                  borderBottomWidth="thin" 
                  borderBottomColor="surface.border.gray.muted"
                >
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">TOP FAILURE REASON</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">AFFECTED ROWS</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">RECOMMENDED ACTION</Text>
                </Box>
                
                <Box display="grid" gridTemplateColumns="4fr 1.5fr 2fr" paddingY="spacing.4" borderBottomWidth="thin" borderBottomColor="surface.border.gray.muted" alignItems="center">
                  <Text size="small" weight="semibold">Missing required field: Price</Text>
                  <Text size="small">27 rows</Text>
                  <Text size="small" color="surface.text.primary.normal">Set fallback price</Text>
                </Box>

                <Box display="grid" gridTemplateColumns="4fr 1.5fr 2fr" paddingY="spacing.4" alignItems="center">
                  <Text size="small" weight="semibold">Invalid image URL format</Text>
                  <Text size="small">59 rows</Text>
                  <Text size="small" color="surface.text.primary.normal">Upload image assets</Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Heading size="small" weight="semibold">Recent imports</Heading>
          <Card elevation="none" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box display="flex" flexDirection="column">
                <Box 
                  display="grid" 
                  gridTemplateColumns="2.5fr 1.5fr 1fr 1fr 1fr 1.5fr" 
                  paddingBottom="spacing.4" 
                  borderBottomWidth="thin" 
                  borderBottomColor="surface.border.gray.muted"
                >
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">FILE NAME</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">DATE</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">TOTAL ROWS</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">SUCCESS</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">FAILED</Text>
                  <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">STATUS</Text>
                </Box>

                <Box 
                  display="grid" 
                  gridTemplateColumns="2.5fr 1.5fr 1fr 1fr 1fr 1.5fr" 
                  paddingY="spacing.4"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <FileTextIcon size="small" color="surface.icon.primary.normal" />
                    <Text size="small" weight="semibold">products_import.csv</Text>
                  </Box>
                  <Text size="small" color="surface.text.gray.subtle">Just now</Text>
                  <Text size="small">1,248</Text>
                  <Text size="small">1,132</Text>
                  <Text size="small">86</Text>
                  <Box>
                    <Badge color="positive" size="small" icon={CheckCircleIcon}>Completed</Badge>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      )}
    </Box>
  );
}
