import type { ResolvedConfig } from 'vite';
import type { ProcessOptions, AcceptedPlugin } from 'postcss';
import postcssrc from 'postcss-load-config';

export interface PostCSSConfigResult {
  options: ProcessOptions;
  plugins: AcceptedPlugin[];
}

function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

const postcssConfigCache = new WeakMap<
  ResolvedConfig,
  PostCSSConfigResult | null | undefined
>();

// Mostly copied from vite's implementation
// https://github.com/vitejs/vite/blob/efec70f816b80e55b64255b32a5f120e1cf4e4be/packages/vite/src/node/plugins/css.ts#L786
export async function resolvePostcssConfig(
  config: ResolvedConfig,
): Promise<PostCSSConfigResult | null> {
  let result = postcssConfigCache.get(config);
  if (result !== undefined) {
    return result;
  }

  // inline postcss config via vite config
  const inlineOptions = config.css?.postcss;
  if (isObject(inlineOptions)) {
    const options = { ...inlineOptions };

    delete options.plugins;
    result = {
      options,
      plugins: inlineOptions.plugins || [],
    };
  } else {
    try {
      const searchPath =
        typeof inlineOptions === 'string' ? inlineOptions : config.root;
      // @ts-ignore
      result = await postcssrc({}, searchPath);
    } catch (e: any) {
      if (!/No PostCSS Config found/.test(e.message)) {
        throw e;
      }
      result = null;
    }
  }

  if (typeof result === 'undefined') {
    throw new Error(`PostCSS Config undefined`);
  }

  postcssConfigCache.set(config, result);
  return result;
}
