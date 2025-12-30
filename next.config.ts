import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const { PROVINCES_PATH_URL } = process.env;

const nextConfig: NextConfig = {
  reactStrictMode: false,

  /* config options here */
  async rewrites() {
    return [
      {
        source: "/provinces/:path*", // client request to /api/*
        destination: `${PROVINCES_PATH_URL}/:path*`, // real backend
      },
    ];
  },
  images: {
    domains: ["demo-2025-eaccount-user-image-second.s3-han02.fptcloud.com"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
