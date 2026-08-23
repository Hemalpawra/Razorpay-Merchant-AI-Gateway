'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  ProgressBar, 
  Badge,
  ClockIcon,
  CloseIcon,
  RefreshIcon
} from '@razorpay/blade/components';

export function ImportingState({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onNext, 600);
          return 100;
        }
        return prev + 5;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="840px" marginX="auto" width="100%">
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.7" padding="spacing.4">
            
            {/* Header info */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" gap="spacing.4" alignItems="center">
                <Box 
                  width="44px" 
                  height="44px" 
                  borderRadius="round" 
                  backgroundColor="surface.background.primary.subtle" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  flexShrink={0}
                >
                  <RefreshIcon size="medium" color="surface.icon.primary.normal" />
                </Box>
                <Box display="flex" flexDirection="column" gap="spacing.1">
                  <Heading size="medium" weight="semibold">Importing products to AI Gateway...</Heading>
                  <Text size="small" color="surface.text.gray.subtle">
                    Writing items to catalog and embedding vectors. Please do not close this window.
                  </Text>
                </Box>
              </Box>

              <Badge color="information" size="medium">Processing</Badge>
            </Box>

            {/* Live Progress Bar Container */}
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <ClockIcon size="small" color="surface.icon.gray.subtle" />
                  <Text size="small" weight="medium" color="surface.text.gray.subtle">
                    Estimated remaining time: ~15 seconds
                  </Text>
                </Box>
                <Text size="small" weight="semibold" color="surface.text.primary.normal">
                  {progress}%
                </Text>
              </Box>
              <ProgressBar value={progress} size="medium" />
            </Box>

            {/* Live Counters Grid */}
            <Box 
              display="grid" 
              gridTemplateColumns="repeat(4, 1fr)" 
              gap="spacing.4"
              padding="spacing.5"
              backgroundColor="surface.background.gray.subtle"
              borderRadius="medium"
              borderWidth="thin"
              borderColor="surface.border.gray.muted"
            >
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">TOTAL ROWS</Text>
                <Heading size="large" weight="semibold">1,248</Heading>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">IMPORTED</Text>
                <Heading size="large" weight="semibold" color="interactive.text.positive.normal">
                  {Math.round((1248 * progress) / 100)}
                </Heading>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">FAILED ROWS</Text>
                <Heading size="large" weight="semibold">36</Heading>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">REMAINING</Text>
                <Heading size="large" weight="semibold" color="surface.text.primary.normal">
                  {Math.max(0, 1248 - Math.round((1248 * progress) / 100))}
                </Heading>
              </Box>
            </Box>

            {/* Current Processing Ticker */}
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center" 
              paddingTop="spacing.3" 
              borderTopWidth="thin" 
              borderTopColor="surface.border.gray.muted"
            >
              <Box display="flex" flexDirection="column">
                <Text size="xsmall" color="surface.text.gray.subtle">Currently processing:</Text>
                <Text size="small" weight="semibold">
                  Row #{Math.min(1248, Math.round((1248 * progress) / 100) + 1)} • Smart TV 55-inch UHD (SKU: TV-1001)
                </Text>
              </Box>

              <Button variant="tertiary" icon={CloseIcon} iconPosition="left" onClick={onNext}>
                Cancel import
              </Button>
            </Box>

          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
