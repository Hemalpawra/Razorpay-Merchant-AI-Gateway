'use client';

import React from 'react';
import StyledComponentsRegistry from '../lib/registry';
import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';

// Customized Blade Theme to ensure screen surface canvas uses #F7F7F7 exactly
const customBladeTheme = {
  ...bladeTheme,
  colors: {
    ...bladeTheme.colors,
    onLight: {
      ...bladeTheme.colors.onLight,
      surface: {
        ...bladeTheme.colors.onLight.surface,
        background: {
          ...bladeTheme.colors.onLight.surface.background,
          gray: {
            ...bladeTheme.colors.onLight.surface.background.gray,
            subtle: 'hsla(0, 0%, 96.9%, 1)', // Exact #F7F7F7
          }
        }
      }
    }
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <BladeProvider themeTokens={customBladeTheme} colorScheme="light">
        {children}
      </BladeProvider>
    </StyledComponentsRegistry>
  );
}
