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
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@messages": path.resolve(__dirname, "messages"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@models": path.resolve(__dirname, "src/models"),
      "@components": path.resolve(__dirname, "src/components"),
      "@services": path.resolve(__dirname, "src/services"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@types": path.resolve(__dirname, "src/types"),
      "@lib": path.resolve(__dirname, "src/lib"),
    };
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
