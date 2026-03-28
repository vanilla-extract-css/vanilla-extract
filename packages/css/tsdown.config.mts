import { defineConfig } from 'tsdown';
import rootConfig from '../../tsdown.config.mts';

export default defineConfig({
  ...rootConfig,
  // Override rather than merge with rootConfig because it doesn't like merging
  // `exports.customExports` with rootConfig
  entry: {
    index: 'src/index.ts',
    recipe: 'src/recipe.ts',
    functionSerializer: 'src/functionSerializer.ts',
    adapter: 'src/adapter.ts',
    transformCss: 'src/transformCss.ts',
    fileScope: 'src/fileScope.ts',
    injectStyles: 'src/injectStyles.ts',
    disableRuntimeStyles: 'src/disableRuntimeStyles.ts',
  },
  exports: {
    devExports: '@vanilla-extract/source',
    customExports(pkg) {
      pkg['./vanilla.virtual.css?*'] = './vanilla.virtual.css?*';
      return pkg;
    },
  },
});
