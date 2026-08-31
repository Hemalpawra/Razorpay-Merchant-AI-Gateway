import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import "@razorpay/blade/fonts.css"; // import blade fonts

export const metadata: Metadata = {
  title: "Merchant AI Gateway",
  description: "Razorpay Buildathon Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
