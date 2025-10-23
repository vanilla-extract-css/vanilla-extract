import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

export const config = {
  distDir: process.env.NODE_ENV === 'production' ? 'dist' : '.next',
  experimental: { externalDir: true },
  onDemandEntries: { maxInactiveAge: 1000 * 60 * 60 },
};

export default withVanillaExtract(config);
