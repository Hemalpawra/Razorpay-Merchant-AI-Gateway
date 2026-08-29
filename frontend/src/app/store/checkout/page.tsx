'use client';

import { Suspense } from "react";
import { Box } from "@razorpay/blade/components";
import { SiteHeader } from "../components/SiteHeader";
import CheckoutBlade from "../components/CheckoutBlade";

export default function CheckoutPage() {
  return (
    <Box backgroundColor="surface.background.gray.subtle" minHeight="100vh">
      <SiteHeader />
      <Suspense fallback={null}>
        <CheckoutBlade />
      </Suspense>
    </Box>
  );
}