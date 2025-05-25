import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/loader.ts',
    'src/next.ts',
    'src/virtualFileLoader.ts',
    'src/virtualNextFileLoader.ts',
  ],
});
