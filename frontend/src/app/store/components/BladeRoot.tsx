'use client';

import type { ReactNode } from "react";
import { BladeProvider } from "@razorpay/blade/components";
import { bladeTheme } from "@razorpay/blade/tokens";
import { I18nProvider } from "@razorpay/i18nify-react";

export function BladeRoot({ children }: { children: ReactNode }) {
  return (
    <I18nProvider initData={{ locale: "en-IN", currency: "INR" }}>
      <BladeProvider themeTokens={bladeTheme} colorScheme="light">
        {children}
      </BladeProvider>
    </I18nProvider>
  );
}
