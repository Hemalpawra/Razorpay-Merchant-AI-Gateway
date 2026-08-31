import { useState, useEffect, useRef } from "react";

export type ConversationPhase = 
  | "idle"
  | "browsing"
  | "comparing"
  | "collecting_contact"
  | "collecting_shipping"
  | "payment_pending"
  | "payment_processing"
  | "post_payment"
  | "order_help";

export interface ConversationState {
  phase: ConversationPhase;
  pendingItem?: {
    sku: string;
    name: string;
    price: number;
  };
  collectedContact?: {
    name: string;
    email: string;
    phone: string;
  };
  collectedShipping?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderId?: string;
  lastUpdated: number;
}

const initialState: ConversationState = {
  phase: "idle",
  lastUpdated: Date.now(),
};

export function createConversationStateMachine() {
  let state = { ...initialState };
  const listeners: Array<(state: ConversationState) => void> = [];

  function notify() {
    state = { ...state, lastUpdated: Date.now() };
    listeners.forEach((l) => l(state));
  }

  return {
    getState: () => state,
    subscribe: (listener: (state: ConversationState) => void) => {
      listeners.push(listener);
      return () => {
        const idx = listeners.indexOf(listener);
        if (idx >= 0) listeners.splice(idx, 1);
      };
    },

    startBrowsing: () => {
      state = { ...state, phase: "browsing" };
      notify();
    },

    startComparing: () => {
      if (state.phase === "browsing" || state.phase === "comparing") {
        state = { ...state, phase: "comparing" };
        notify();
      }
    },

    selectProduct: (item: { sku: string; name: string; price: number }) => {
      state = { 
        ...state, 
        phase: "collecting_contact",
        pendingItem: item,
        collectedContact: undefined,
        collectedShipping: undefined,
      };
      notify();
    },

    setContact: (contact: { name: string; email: string; phone: string }) => {
      if (state.phase === "collecting_contact") {
        state = { ...state, collectedContact: contact, phase: "collecting_shipping" };
        notify();
      }
    },

    setShipping: (shipping: { line1: string; city: string; state: string; pincode: string }) => {
      if (state.phase === "collecting_shipping" && state.collectedContact) {
        state = { ...state, collectedShipping: shipping, phase: "payment_pending" };
        notify();
      }
    },

    startPayment: () => {
      if (state.phase === "payment_pending") {
        state = { ...state, phase: "payment_processing" };
        notify();
      }
    },

    completePayment: (orderId: string) => {
      state = { ...state, phase: "post_payment", orderId };
      notify();
    },

    reset: () => {
      state = { ...initialState };
      notify();
    },

    canProceedToShipping: () => 
      state.phase === "collecting_contact" && !!state.collectedContact,

    canProceedToPayment: () => 
      state.phase === "collecting_shipping" && !!state.collectedContact && !!state.collectedShipping,

    getPendingItem: () => state.pendingItem,
    getCollectedContact: () => state.collectedContact,
    getCollectedShipping: () => state.collectedShipping,
  };
}

export function useConversationState() {
  const machineRef = useRef<ReturnType<typeof createConversationStateMachine> | null>(null);
  const stateRef = useRef<ConversationState>({
    phase: "idle",
    lastUpdated: Date.now(),
  });
  const [, setTick] = useState(0);
  const state = stateRef.current;
  const setState = (newState: ConversationState | ((prev: ConversationState) => ConversationState)) => {
    stateRef.current = typeof newState === "function" ? newState(stateRef.current) : newState;
    setTick((t) => t + 1);
  };

  useEffect(() => {
    machineRef.current = createConversationStateMachine();
    const unsubscribe = machineRef.current.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...machineRef.current!,
    state,
  };
}