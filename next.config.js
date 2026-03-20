/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Prevent Next.js from inferring the workspace root from parent lockfiles.
    root: __dirname,
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Reduce JavaScript bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
