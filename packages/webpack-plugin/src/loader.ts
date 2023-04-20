import path from 'path';
// @ts-expect-error
import loaderUtils from 'loader-utils';
import {
  IdentifierOption,
  serializeCss,
  InlineCompiler,
} from '@vanilla-extract/integration';

import type { LoaderContext } from './types';

const virtualLoader = require.resolve(
  path.join(
    path.dirname(require.resolve('../../package.json')),
    'virtualFileLoader',
  ),
);

const emptyCssExtractionFile = path.join(
  path.dirname(require.resolve('../../package.json')),
  'extracted.js',
);

interface LoaderOptions {
  outputCss: boolean;
  identifiers?: IdentifierOption;
}

interface InternalLoaderOptions extends LoaderOptions {
  veCompiler: InlineCompiler;
}

export async function pitch(this: LoaderContext) {
  const { veCompiler, outputCss } = loaderUtils.getOptions(
    this,
  ) as InternalLoaderOptions;

  const callback = this.async();

  const result = await veCompiler.processVanillaFile(this.resourcePath, {
    outputCss,
    cssImportSpecifier: async (filePath, css, root) => {
      const serializedCss = await serializeCss(css);
      const absFilePath = path.join(root, filePath);
      const virtualFileName = absFilePath + '.vanilla.css';
      const virtualResourceLoader = `${virtualLoader}?${JSON.stringify({
        source: serializedCss,
      })}`;

      const request = loaderUtils.stringifyRequest(
        this,
        `${virtualFileName}!=!${virtualResourceLoader}!${absFilePath}`,
      );

      // Webpack automatically wraps the request in quotes which VE does for us.
      return request.slice(1, -1);
    },
  });

  if (!result) {
    return callback(null);
  }

  for (const watchFile of result.watchFiles) {
    this.addDependency(watchFile);
  }

  return callback(null, result.source);
}
