import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import { NextConfig } from 'next';
const withVanillaExtract = createVanillaExtractPlugin();

export const config = {
  distDir: process.env.NODE_ENV === 'production' ? 'dist' : '.next',
  experimental: { externalDir: true },
  onDemandEntries: { maxInactiveAge: 1000 * 60 * 60 },
  transpilePackages: ['@fixtures/sprinkles/src/html'],
};

export default withVanillaExtract(config);
