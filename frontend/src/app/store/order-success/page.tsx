'use client';

import { Box } from "@razorpay/blade/components";
import { SiteHeader } from "../components/SiteHeader";
import OrderSuccessBlade from "../components/OrderSuccessBlade";

export default function OrderSuccessPage() {
  return (
    <Box backgroundColor="surface.background.gray.subtle" minHeight="100vh">
      <SiteHeader />
      <OrderSuccessBlade />
    </Box>
  );
}
