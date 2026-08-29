"use client";

import React from 'react';
import { Badge } from '@razorpay/blade/components';

export type SourceType = 
  | 'Human Customer'
  | 'ChatGPT'
  | 'Claude'
  | 'Gemini'
  | 'Grok'
  | 'Merchant AI'
  | string;

interface SourceBadgeProps {
  source: string;
  size?: 'small' | 'medium' | 'large';
}

export function SourceBadge({ source, size = 'small' }: SourceBadgeProps) {
  const getConfig = (src: string) => {
    const normalized = src?.toLowerCase() || '';
    
    if (normalized.includes('human') || normalized === 'direct') {
      return { color: 'neutral' as const, icon: '👤' };
    }
    if (normalized.includes('chatgpt') || normalized.includes('gpt')) {
      return { color: 'information' as const, icon: '🤖' };
    }
    if (normalized.includes('claude')) {
      return { color: 'primary' as const, icon: '🧠' };
    }
    if (normalized.includes('gemini')) {
      return { color: 'notice' as const, icon: '✨' };
    }
    if (normalized.includes('grok')) {
      return { color: 'negative' as const, icon: '⚡' };
    }
    if (normalized.includes('merchant') || normalized.includes('ai')) {
      return { color: 'positive' as const, icon: '🏪' };
    }
    return { color: 'neutral' as const, icon: '📱' };
  };

  const config = getConfig(source);

  return (
    <Badge color={config.color} size={size}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <span>{config.icon}</span>
        <span>{source}</span>
      </span>
    </Badge>
  );
}