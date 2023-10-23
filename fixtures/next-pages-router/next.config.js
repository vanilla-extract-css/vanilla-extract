const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const config = withVanillaExtract({
  // we need to differentiate build and dev folders
  // so they don't overwrite eachother when running tests
  distDir: process.env.NODE_ENV === 'production' ? 'dist' : '.next',
  experimental: {
    externalDir: true,
  },
  onDemandEntries: {
    // Make sure entries are not getting disposed.
    maxInactiveAge: 1000 * 60 * 60,
  },
});

module.exports = config;
