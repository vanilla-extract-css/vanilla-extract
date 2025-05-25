import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/createUtils.ts',
    'src/createRuntimeSprinkles.ts',
  ],
});
