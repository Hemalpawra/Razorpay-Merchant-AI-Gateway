'use client';

import React from 'react';
import { 
  Box, 
  Text, 
  Avatar, 
  Badge, 
  IconButton, 
  SearchIcon, 
  BellIcon, 
  HelpCircleIcon, 
  RazorpayIcon,
  SparklesIcon,
  MenuIcon
} from '@razorpay/blade/components';

export function TopHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <Box 
      height="64px"
      borderBottomWidth="thin"
      borderBottomColor="surface.border.gray.muted" 
      paddingX={{ base: 'spacing.4', m: 'spacing.6' }}
      display="flex" 
      alignItems="center" 
      justifyContent="space-between"
      gap="spacing.2"
      backgroundColor="surface.background.gray.intense"
    >
      {/* Left: Brand Identity & AI Gateway Tag */}
      <Box display="flex" alignItems="center" gap="spacing.4" flex={1} minWidth="0px">
        <IconButton
          icon={MenuIcon}
          accessibilityLabel="Open navigation menu"
          size="medium"
          display={{ base: 'flex', l: 'none' }}
          onClick={() => onMenuClick?.()}
        />
        <Box display="flex" alignItems="center" gap="spacing.2" minWidth="0px">
          <RazorpayIcon color="interactive.icon.primary.subtle" size="medium" />
          <Text weight="semibold" size="medium" color="surface.text.primary.normal">
            Razorpay
          </Text>
          <Text size="medium" color="surface.text.staticWhite.subtle">
            |
          </Text>
          <Text weight="semibold" size="medium" color="surface.text.primary.normal">
            Merchant AI Gateway
          </Text>
        </Box>
        <Badge color="positive" size="small">
          LIVE
        </Badge>
      </Box>

      {/* Center: Search / Context */}
      <Box 
        display={{ base: 'none', m: 'flex' }} 
        alignItems="center" 
        gap="spacing.2"
        paddingX="spacing.3"
        paddingY="spacing.2"
        borderRadius="small"
        backgroundColor="surface.background.primary.subtle"
        width="340px"
      >
        <SearchIcon size="small" color="interactive.icon.primary.normal" />
        <Text size="small" color="surface.text.primary.normal">
          Search products, sessions, SKU...
        </Text>
      </Box>

      {/* Right: Actions & User Info */}
      <Box display="flex" alignItems="center" gap="spacing.4" flexShrink={0} minWidth="0px">
        {/* AI Gateway Status Indicator */}
        <Box 
          display={{ base: 'none', l: 'flex' }} 
          alignItems="center" 
          gap="spacing.2" 
          paddingX="spacing.3" 
          paddingY="spacing.1" 
          borderRadius="max"
          backgroundColor="surface.background.primary.subtle"
        >
          <SparklesIcon size="xsmall" color="interactive.icon.primary.normal" />
          <Text size="xsmall" weight="semibold" color="surface.text.primary.normal">
            AI Agent Connected
          </Text>
        </Box>

        {/* Action Icons */}
        <Box display="flex" alignItems="center" gap="spacing.2">
          <IconButton 
            icon={HelpCircleIcon} 
            accessibilityLabel="Help & Support" 
            size="medium"
            onClick={() => {}} 
          />
          <IconButton 
            icon={BellIcon} 
            accessibilityLabel="Notifications" 
            size="medium"
            onClick={() => {}} 
          />
        </Box>

        {/* User Account / Merchant Switcher */}
        <Box 
          display="flex" 
          alignItems="center" 
          gap="spacing.3"
          paddingLeft="spacing.3"
        >
          <Avatar name="StyleTech Store" size="medium" />
          <Box display={{ base: 'none', m: 'flex' }} flexDirection="column">
            <Text size="small" weight="semibold" color="surface.text.primary.normal">
              StyleTech Store
            </Text>
            <Text size="xsmall" color="surface.text.staticWhite.subtle">
              MID: M9847120
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
