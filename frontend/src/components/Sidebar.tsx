'use client';

import React from 'react';
import {
  Box,
  Text,
  Badge,
  HomeIcon,
  PackageIcon,
  UploadIcon,
  SparklesIcon,
  ShoppingBagIcon,
  FileTextIcon,
  TrendingUpIcon,
  SettingsIcon,
  ChevronRightIcon,
  ZapIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  active?: boolean;
  badge?: { label: string; color: 'positive' | 'notice' | 'negative' | 'information' | 'neutral' };
}

const NavItem = ({ title, href, icon: Icon, active, badge }: NavItemProps) => (
  <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
    <Box
      paddingY="spacing.3"
      paddingX="spacing.4"
      borderRadius="medium"
      backgroundColor={active ? 'surface.background.primary.subtle' : 'transparent'}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      marginBottom="spacing.1"
      borderLeftWidth={active ? 'thick' : 'none'}
      borderLeftColor="surface.border.primary.normal"
    >
      <Box display="flex" alignItems="center" gap="spacing.3">
        <Icon
          size="medium"
          color={active ? 'interactive.icon.primary.normal' : 'surface.icon.gray.subtle'}
        />
        <Text
          color={active ? 'surface.text.primary.normal' : 'surface.text.gray.subtle'}
          weight={active ? 'semibold' : 'regular'}
          size="small"
        >
          {title}
        </Text>
      </Box>
      {badge && (
        <Badge color={badge.color} size="small">
          {badge.label}
        </Badge>
      )}
    </Box>
  </Link>
);

const NavSection = ({ label }: { label: string }) => (
  <Box paddingX="spacing.3" paddingTop="spacing.5" paddingBottom="spacing.2" marginBottom="spacing.1">
    <Text size="xsmall" weight="semibold" color="surface.text.gray.muted">
      {label}
    </Text>
  </Box>
);

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <Box
      width="220px"
      height="100%"
      backgroundColor="surface.background.gray.intense"
      borderRightWidth="thin"
      borderRightColor="surface.border.gray.muted"
      padding="spacing.4"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      flexShrink={0}
    >
      <Box display="flex" flexDirection="column">
        <NavSection label="MERCHANT AI CORE" />

        <NavItem title="Dashboard" href="/dashboard" icon={HomeIcon} active={pathname === '/dashboard'} />
        <NavItem title="Products" href="/dashboard/products" icon={PackageIcon} active={isActive('/dashboard/products')} />
        <NavItem title="Product Import" href="/dashboard/import" icon={UploadIcon} active={isActive('/dashboard/import')} badge={{ label: 'AI Ready', color: 'information' }} />
        <NavItem title="AI Agent" href="/dashboard/ai-agent" icon={SparklesIcon} active={isActive('/dashboard/ai-agent')} />
        <NavItem title="Orders" href="/dashboard/orders" icon={ShoppingBagIcon} active={isActive('/dashboard/orders')} />

        <NavSection label="INTELLIGENCE" />

        <NavItem title="Audit Trail" href="/dashboard/audit-trail" icon={FileTextIcon} active={isActive('/dashboard/audit-trail')} />
        <NavItem title="Analytics" href="/dashboard/analytics" icon={TrendingUpIcon} active={isActive('/dashboard/analytics')} />
        <NavItem title="Settings" href="/dashboard/settings" icon={SettingsIcon} active={isActive('/dashboard/settings')} />
      </Box>

      {/* Bottom: Merchant AI Gateway info */}
      <Box
        padding="spacing.4"
        backgroundColor="surface.background.primary.subtle"
        borderRadius="medium"
        borderWidth="thin"
        borderColor="surface.border.primary.muted"
        display="flex"
        flexDirection="column"
        gap="spacing.2"
      >
        <Box display="flex" alignItems="center" gap="spacing.2">
          <ZapIcon size="small" color="interactive.icon.primary.normal" />
          <Text size="small" weight="semibold" color="interactive.text.primary.normal">Merchant AI Gateway</Text>
        </Box>
        <Text size="xsmall" color="surface.text.gray.subtle">
          Let AI sell for you. More conversations. More orders. More revenue.
        </Text>
        <Link href="#" style={{ textDecoration: 'none' }}>
          <Box display="flex" alignItems="center" gap="spacing.1">
            <Text size="xsmall" weight="semibold" color="interactive.text.primary.normal">Learn more</Text>
            <ChevronRightIcon size="small" color="interactive.icon.primary.normal" />
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
