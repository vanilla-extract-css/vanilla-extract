import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/createRuntimeFn.ts'],
});
