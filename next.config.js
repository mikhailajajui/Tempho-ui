/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Prevent Next.js from inferring the workspace root from parent lockfiles.
    root: __dirname,
  },
};

module.exports = nextConfig;
