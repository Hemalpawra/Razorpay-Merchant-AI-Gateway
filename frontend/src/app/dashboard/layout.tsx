'use client';

import React, { useState } from 'react';
import { Box } from '@razorpay/blade/components';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden" backgroundColor="surface.background.gray.subtle">
      {/* Top Header - Razorpay Dark Navigation */}
      <TopHeader onMenuClick={() => setMobileNavOpen(true)} />

      {/* Main Body: Sidebar + Dynamic Content */}
      <Box display="flex" flex={1} overflow="hidden">
        <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <Box flex={1} minWidth="0px" overflow="auto" backgroundColor="surface.background.gray.subtle">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
