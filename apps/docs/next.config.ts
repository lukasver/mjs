import type { NextConfig } from 'next';
import nextra from 'nextra';

const withNextra = nextra({});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: { exclude: ['error', 'warn', 'debug', 'info'] },
  },

  transpilePackages: ['@mjs/ui'],
};

export default () => {
  const plugins = [withNextra];

  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
