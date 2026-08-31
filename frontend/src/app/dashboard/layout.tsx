'use client';

import React, { useState } from 'react';
import { Box } from '@razorpay/blade/components';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto', backgroundColor: '#F8FAFC' }}>
        {children}
      </div>
    </div>
  );
}
