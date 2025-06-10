import { defineConfig } from 'tsdown';

export default defineConfig({
  // Packages that require multiple entrypoints should define their own tsdown.config.ts
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  exports: {
    devExports: process.env.DEV === 'true',
  },
  workspace: ['./packages/*'],
});
