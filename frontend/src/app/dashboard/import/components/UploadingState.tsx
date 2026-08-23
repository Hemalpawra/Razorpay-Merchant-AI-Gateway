'use client';

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  ProgressBar, 
  Badge,
  Link,
  FileTextIcon, 
  CloseIcon, 
  RefreshIcon,
  HelpCircleIcon,
  ChevronRightIcon
} from '@razorpay/blade/components';

export function UploadingState({ 
  onNext, 
  onCancel 
}: { 
  onNext: () => void; 
  onCancel: () => void; 
}) {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Top Section */}
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '2fr 1fr' }} gap="spacing.7">
        
        {/* Uploading Area Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box 
              borderWidth="thin"
              borderColor="surface.border.gray.muted"
              borderRadius="medium"
              backgroundColor="surface.background.gray.subtle"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="spacing.9"
              gap="spacing.5"
            >
              {/* File Info */}
              <Box 
                display="flex" 
                alignItems="center" 
                gap="spacing.3" 
                padding="spacing.4" 
                backgroundColor="surface.background.gray.intense"
                borderRadius="medium"
                borderWidth="thin"
                borderColor="surface.border.gray.muted"
                width="100%"
                maxWidth="460px"
              >
                <Box 
                  width="40px" 
                  height="40px" 
                  borderRadius="small" 
                  backgroundColor="surface.background.primary.subtle" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  flexShrink={0}
                >
                  <FileTextIcon size="medium" color="surface.icon.primary.normal" />
                </Box>
                <Box display="flex" flexDirection="column" flex={1}>
                  <Text size="medium" weight="semibold">products_import.csv</Text>
                  <Text size="small" color="surface.text.gray.subtle">12.4 MB • 1,248 rows detected</Text>
                </Box>
                <Badge color="information" size="small">Parsing</Badge>
              </Box>

              {/* Progress Container */}
              <Box width="100%" maxWidth="460px" display="flex" flexDirection="column" gap="spacing.2">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text size="small" weight="medium" color="surface.text.gray.subtle">Uploading & validating schema...</Text>
                  <Text size="small" weight="semibold" color="surface.text.primary.normal">45%</Text>
                </Box>
                <ProgressBar value={45} size="medium" />
              </Box>
              
              <Text size="small" color="surface.text.gray.subtle">
                Please do not refresh or close this window while the file is uploading.
              </Text>

              {/* Actions */}
              <Box display="flex" gap="spacing.4" marginTop="spacing.2">
                <Button variant="secondary" icon={CloseIcon} iconPosition="left" onClick={onCancel}>
                  Cancel upload
                </Button>
                <Button variant="primary" icon={RefreshIcon} iconPosition="left" onClick={onNext}>
                  Continue to mapping
                </Button>
              </Box>
            </Box>
          </CardBody>
        </Card>

        {/* How It Works Card */}
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" flexDirection="column" gap="spacing.5" height="100%">
              <Heading size="small" weight="semibold">How it works</Heading>

              <Box display="flex" flexDirection="column" gap="spacing.4" flex={1}>
                {[
                  { step: '1', title: 'Upload your file', desc: 'Uploading products_import.csv (45%)', active: true },
                  { step: '2', title: 'Map columns', desc: 'Match your sheet headers to Razorpay catalog fields' },
                  { step: '3', title: 'Review & validate', desc: 'Verify data, price formats, and resolve duplicates' },
                  { step: '4', title: 'Import products', desc: 'Products sync directly to Merchant AI Gateway' }
                ].map((item) => (
                  <Box key={item.step} display="flex" gap="spacing.3" alignItems="flex-start">
                    <Box 
                      width="24px" 
                      height="24px" 
                      borderRadius="round" 
                      backgroundColor={item.active ? 'surface.background.primary.intense' : 'surface.background.gray.moderate'} 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text size="xsmall" weight="semibold" color={item.active ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal'}>
                        {item.step}
                      </Text>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Text size="small" weight="semibold" color={item.active ? 'surface.text.primary.normal' : 'surface.text.gray.normal'}>
                        {item.title}
                      </Text>
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
        <Heading size="small" weight="semibold">Recent imports</Heading>
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box padding="spacing.6" display="flex" justifyContent="center" alignItems="center">
              <Text size="small" color="surface.text.gray.muted">
                Previous imports will appear here once the current upload is complete.
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}
