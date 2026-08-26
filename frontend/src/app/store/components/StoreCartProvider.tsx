'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@/lib/store/catalog';

export type StoreCartLine = { product: Product; qty: number; variant?: string };

type StoreCartContextValue = {
  lines: StoreCartLine[];
  itemCount: number;
  addToCart: (product: Product, qty?: number, variant?: string) => void;
  updateQuantity: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
};

const StoreCartContext = createContext<StoreCartContextValue | null>(null);

export function StoreCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<StoreCartLine[]>([]);

  const addToCart = useCallback((product: Product, qty = 1, variant = 'Default') => {
    setLines((current) => {
      const existing = current.find((line) => line.product.slug === product.slug);
      if (existing) return current.map((line) => line.product.slug === product.slug ? { ...line, qty: Math.min(10, line.qty + qty) } : line);
      return [...current, { product, qty: Math.min(10, Math.max(1, qty)), variant }];
    });
  }, []);
  const updateQuantity = useCallback((slug: string, qty: number) => setLines((current) => qty <= 0 ? current.filter((line) => line.product.slug !== slug) : current.map((line) => line.product.slug === slug ? { ...line, qty: Math.min(10, qty) } : line)), []);
  const removeFromCart = useCallback((slug: string) => setLines((current) => current.filter((line) => line.product.slug !== slug)), []);
  const clearCart = useCallback(() => setLines([]), []);
  const value = useMemo(() => ({ lines, itemCount: lines.reduce((sum, line) => sum + line.qty, 0), addToCart, updateQuantity, removeFromCart, clearCart }), [lines, addToCart, updateQuantity, removeFromCart, clearCart]);
  return <StoreCartContext.Provider value={value}>{children}</StoreCartContext.Provider>;
}

export function useStoreCart() {
  const context = useContext(StoreCartContext);
  if (!context) throw new Error('useStoreCart must be used inside StoreCartProvider');
  return context;
}
