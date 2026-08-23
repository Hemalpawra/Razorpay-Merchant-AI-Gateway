'use client';

import React from 'react';
import { Box } from '@razorpay/blade/components';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden" backgroundColor="surface.background.gray.subtle">
      {/* Top Header - Razorpay Dark Navigation */}
      <TopHeader />

      {/* Main Body: Sidebar + Dynamic Content */}
      <Box display="flex" flex={1} overflow="hidden">
        <Sidebar />
        <Box flex={1} overflow="auto" backgroundColor="surface.background.gray.subtle">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
