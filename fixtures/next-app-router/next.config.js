const {
  createVanillaExtractPlugin,
} = require('./next-plugin/dist/vanilla-extract-next-plugin.cjs.js');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const config = withVanillaExtract({
  // exporting a static build for next 13
  // due to issues with distDir on next custom server
  output: 'export',
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
