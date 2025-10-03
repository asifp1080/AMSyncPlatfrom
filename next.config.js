/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  // Disable React error overlay editor integration to prevent terminal editor errors
  reactStrictMode: true,
  experimental: {
    // Disable React error overlay editor integration
    reactRefresh: {
      editor: false,
    },
  },
  // Override React DevTools editor integration
  env: {
    REACT_EDITOR: "none",
  },
  // Disable webpack dev middleware editor integration
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false;
    }
    return config;
  },
};

module.exports = nextConfig;
