'use client';

import React from 'react';
import { StoreAiProvider } from './components/StoreAiProvider';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreAiProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {children}
      </div>
    </StoreAiProvider>
  );
}
