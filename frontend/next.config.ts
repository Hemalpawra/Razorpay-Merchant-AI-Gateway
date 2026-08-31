import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@razorpay/blade', '@razorpay/i18nify-js', '@razorpay/i18nify-react'],
};

export default nextConfig;
