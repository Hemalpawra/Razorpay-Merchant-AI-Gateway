'use client';

import { Box } from "@razorpay/blade/components";
import { SiteHeader } from "../components/SiteHeader";
import CheckoutBlade from "../components/CheckoutBlade";

export default function CheckoutPage() {
  return (
    <Box backgroundColor="surface.background.gray.subtle" minHeight="100vh">
      <SiteHeader />
      <CheckoutBlade />
    </Box>
  );
}
