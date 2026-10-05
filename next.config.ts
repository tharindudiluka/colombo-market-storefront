import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/pages/contact", destination: "/contact", permanent: true },
      { source: "/en/pages/contact", destination: "/en/contact", permanent: true },
    ];
  },
  images: {
    remotePatterns: [{ hostname: "cdn.shopify.com" }],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
