'use client';

import React from 'react';
import { StoreAiProvider } from './components/StoreAiProvider';
import { StoreCartProvider } from './components/StoreCartProvider';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreCartProvider>
      <StoreAiProvider>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          {children}
        </div>
      </StoreAiProvider>
    </StoreCartProvider>
  );
}
