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
  Link,
  UploadIcon,
  DownloadIcon,
  HelpCircleIcon,
  FileTextIcon,
  ChevronRightIcon
} from '@razorpay/blade/components';

export function EmptyState({ onNext, onManualAdd }: { onNext: () => void; onManualAdd?: () => void }) {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Top Section: Upload Area and How it works */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '2fr 1fr' }} gap="spacing.7">
        
        {/* Drag & Drop Upload Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box 
              borderWidth="thin"
              borderStyle="dashed"
              borderColor="surface.border.primary.normal"
              borderRadius="medium"
              backgroundColor="surface.background.primary.subtle"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="spacing.9"
              gap="spacing.4"
              textAlign="center"
            >
              <Box 
                width="48px" 
                height="48px" 
                borderRadius="round" 
                backgroundColor="surface.background.primary.intense" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <UploadIcon size="large" color="surface.icon.staticWhite.normal" />
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Heading size="medium" weight="semibold">Drag and drop your CSV file here</Heading>
                <Text size="small" color="surface.text.gray.subtle">or browse from your computer</Text>
              </Box>

              <Box display="flex" gap="spacing.4" marginTop="spacing.2">
                <Button variant="primary" icon={UploadIcon} iconPosition="left" onClick={onNext}>
                  Choose file
                </Button>
                {onManualAdd && (
                  <Button variant="tertiary" onClick={onManualAdd}>
                    Add single product
                  </Button>
                )}
              </Box>

              <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.3" marginTop="spacing.4">
                <Badge color="neutral" size="small">Supports .csv, .tsv up to 25MB (max 10,000 rows)</Badge>
                
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <DownloadIcon size="small" color="surface.icon.primary.normal" />
                  <Link href="#" size="small" onClick={(e) => { e.preventDefault(); }}>
                    Download sample CSV template
                  </Link>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* How It Works Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.5" height="100%">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Heading size="small" weight="semibold">How it works</Heading>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.4" flex={1}>
                {[
                  { step: '1', title: 'Upload your file', desc: 'Select CSV or Excel formatted product sheet' },
                  { step: '2', title: 'Map columns', desc: 'Match your sheet headers to Razorpay catalog fields' },
                  { step: '3', title: 'Review & validate', desc: 'Verify data, price formats, and resolve duplicates' },
                  { step: '4', title: 'Import products', desc: 'Products sync directly to Merchant AI Gateway' }
                ].map((item) => (
                  <Box key={item.step} display="flex" gap="spacing.3" alignItems="flex-start">
                    <Box 
                      width="24px" 
                      height="24px" 
                      borderRadius="round" 
                      backgroundColor="surface.background.gray.moderate" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text size="xsmall" weight="semibold">{item.step}</Text>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold">{item.title}</Text>
                      <Text size="xsmall" color="surface.text.gray.subtle">{item.desc}</Text>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box 
                padding="spacing.4" 
                backgroundColor="surface.background.gray.subtle" 
                borderRadius="small" 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <HelpCircleIcon size="small" color="surface.icon.gray.subtle" />
                  <Text size="small" weight="semibold">Need help?</Text>
                </Box>
                <Link href="#" size="small" icon={ChevronRightIcon} iconPosition="right" onClick={(e) => { e.preventDefault(); }}>
                  View import guide
                </Link>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>

      {/* Recent Imports Panel */}
      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="small" weight="semibold">Recent imports</Heading>
          <Text size="small" color="surface.text.gray.subtle">Showing recent batch uploads</Text>
        </Box>

        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column">
              {/* Header */}
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

              {/* Sample Past Import Rows */}
              {[
                { name: 'summer_collection_2025.csv', date: '21 Aug 2026, 04:30 PM', total: '450', success: '450', failed: '0', status: 'Completed', color: 'positive' as const },
                { name: 'audio_accessories_v2.csv', date: '18 Aug 2026, 11:15 AM', total: '120', success: '115', failed: '5', status: 'Partial', color: 'notice' as const },
                { name: 'gadgets_catalog_sync.csv', date: '12 Aug 2026, 02:40 PM', total: '890', success: '890', failed: '0', status: 'Completed', color: 'positive' as const }
              ].map((row, idx) => (
                <Box 
                  key={idx}
                  display="grid" 
                  gridTemplateColumns="2.5fr 1.5fr 1fr 1fr 1fr 1.5fr" 
                  paddingY="spacing.4"
                  borderBottomWidth={idx === 2 ? 'none' : 'thin'}
                  borderBottomColor="surface.border.gray.muted"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center" gap="spacing.2">
                    <FileTextIcon size="small" color="surface.icon.primary.normal" />
                    <Text size="small" weight="semibold">{row.name}</Text>
                  </Box>
                  <Text size="small" color="surface.text.gray.subtle">{row.date}</Text>
                  <Text size="small">{row.total}</Text>
                  <Text size="small">{row.success}</Text>
                  <Text size="small">{row.failed}</Text>
                  <Box>
                    <Badge color={row.color} size="small">{row.status}</Badge>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}
