import type { ResolvedConfig } from 'vite';
import type { ProcessOptions, Plugin } from 'postcss';

export interface PostCSSConfigResult {
  options: ProcessOptions;
  plugins: Plugin[];
}

// Mostly copied from vite's implementation
// https://github.com/vitejs/vite/blob/efec70f816b80e55b64255b32a5f120e1cf4e4be/packages/vite/src/node/plugins/css.ts
export const resolvePostcssConfig = async (
  config: ResolvedConfig,
): Promise<PostCSSConfigResult | null> => {
  // inline postcss config via vite config
  const inlineOptions = config.css?.postcss;
  const inlineOptionsIsString = typeof inlineOptions === 'string';

  if (inlineOptions && !inlineOptionsIsString) {
    const options = { ...inlineOptions };

    delete options.plugins;
    return {
      options,
      plugins: inlineOptions.plugins || [],
    };
  } else {
    try {
      const searchPath =
        typeof inlineOptions === 'string' ? inlineOptions : config.root;

      const postCssConfig = await (
        await import('postcss-load-config')
      ).default({}, searchPath);

      return {
        options: postCssConfig.options,
        // @ts-expect-error - The postcssrc options don't agree with real postcss, but it should be ok
        plugins: postCssConfig.plugins,
      };
    } catch (e: any) {
      if (!/No PostCSS Config found/.test(e.message)) {
        throw e;
      }
      return null;
    }
  }
};
