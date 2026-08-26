'use client';

import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/lib/store/catalog";

const AiChatDrawer = dynamic(() => import("./AiChatDrawer"), { ssr: false });

type AiChatContextValue = {
  openChat: (product?: Product) => void;
  closeChat: () => void;
  isOpen: boolean;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
};

const AiChatContext = createContext<AiChatContextValue | null>(null);

export function useAiChat(): AiChatContextValue {
  const ctx = useContext(AiChatContext);
  if (!ctx) throw new Error("useAiChat must be used inside StoreAiProvider");
  return ctx;
}

export function StoreAiProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openChat = useCallback((next?: Product) => {
    setProduct(next);
    setIsOpen(true);
  }, []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openChat, closeChat, isOpen, sessionId, setSessionId }),
    [openChat, closeChat, isOpen, sessionId],
  );

  return (
    <AiChatContext.Provider value={value}>
      {children}
      {mounted && <AiChatDrawer isOpen={isOpen} onDismiss={closeChat} product={product} />}
    </AiChatContext.Provider>
  );
}
