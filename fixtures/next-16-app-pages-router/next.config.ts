import { NextConfig } from 'next';
import { createVanillaExtractPlugin } from './next-plugin/dist/index.mjs';
const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
});

export const config: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: { externalDir: true },
  onDemandEntries: { maxInactiveAge: 1000 * 60 * 60 },
  transpilePackages: ['@fixtures/sprinkles/src/html'],
  devIndicators: false,
};

export default withVanillaExtract(config);
