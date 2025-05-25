import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/recipe.ts',
    './src/functionSerializer.ts',
    './src/adapter.ts',
    './src/transformCss.ts',
    './src/fileScope.ts',
    './src/injectStyles.ts',
    './src/disableRuntimeStyles.ts',
  ],
});
