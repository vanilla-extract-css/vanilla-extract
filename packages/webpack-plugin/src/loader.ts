import path from 'path';
// @ts-expect-error
import loaderUtils from 'loader-utils';
import {
  getPackageInfo,
  IdentifierOption,
  processVanillaFile,
  serializeCss,
  transform,
} from '@vanilla-extract/integration';

import type { LoaderContext } from './types';
import { debug, formatResourcePath } from './logger';
import { ChildCompiler } from './compiler';

const virtualFileLoader = require.resolve(
  path.join(
    path.dirname(require.resolve('../../package.json')),
    'virtualFileLoader',
  ),
);

const virtualFileLoaderExtractionFile = path.join(
  path.dirname(require.resolve('../../package.json')),
  'extracted.js',
);

const virtualNextFileLoaderExtractionFile = path.join(
  path.dirname(require.resolve('../../package.json')),
  'vanilla.virtual.css',
);

interface LoaderOptions {
  outputCss: boolean;
  identifiers?: IdentifierOption;
}

interface InternalLoaderOptions extends LoaderOptions {
  childCompiler: ChildCompiler;
  virtualLoader: 'virtualFileLoader' | 'virtualNextFileLoader';
}

const defaultIdentifierOption = (
  mode: LoaderContext['mode'],
  identifiers?: IdentifierOption,
): IdentifierOption =>
  identifiers ?? (mode === 'production' ? 'short' : 'debug');

export default function (this: LoaderContext, source: string) {
  const { identifiers } = loaderUtils.getOptions(this) as InternalLoaderOptions;

  const { name } = getPackageInfo(this.rootContext);

  const callback = this.async();

  transform({
    source,
    filePath: this.resourcePath,
    rootPath: this.rootContext,
    packageName: name,
    identOption: defaultIdentifierOption(this.mode, identifiers),
  })
    .then((code) => {
      callback(null, code);
    })
    .catch((e) => {
      callback(e);
    });
}

export function pitch(this: LoaderContext) {
  const { childCompiler, outputCss, identifiers, virtualLoader } =
    loaderUtils.getOptions(this) as InternalLoaderOptions;

  const log = debug(
    `vanilla-extract:loader:${formatResourcePath(this.resourcePath)}`,
  );

  const compiler = this._compiler;

  const isChildCompiler = childCompiler.isChildCompiler(compiler.name);

  if (isChildCompiler) {
    log(
      'Skip vanilla-extract loader as we are already within a child compiler for %s',
      compiler.options.output.filename,
    );
    return;
  }

  log('Loading file');

  const callback = this.async();

  childCompiler
    .getCompiledSource(this)
    .then(async ({ source }) => {
      const result = await processVanillaFile({
        source,
        outputCss,
        filePath: this.resourcePath,
        identOption: defaultIdentifierOption(this.mode, identifiers),
        serializeVirtualCssPath: async ({ fileName, source }) => {
          const serializedCss = await serializeCss(source);

          if (virtualLoader === 'virtualFileLoader') {
            const virtualResourceLoader = `${virtualFileLoader}?${JSON.stringify(
              {
                fileName,
                source: serializedCss,
              },
            )}`;
            const request = loaderUtils.stringifyRequest(
              this,
              `${fileName}!=!${virtualResourceLoader}!${virtualFileLoaderExtractionFile}`,
            );
            return `import ${request}`;
          } else {
            // https://github.com/SukkaW/style9-webpack/blob/f51c46bbcd95ea3b988d3559c3b35cc056874366/src/next-appdir/style9-next-loader.ts#L64-L72
            const request = loaderUtils.stringifyRequest(
              this,
              // Next.js RSC CSS extraction will discard any loaders in the request.
              // So we need to pass virtual css information through resourceQuery.
              // https://github.com/vercel/next.js/blob/3a9bfe60d228fc2fd8fe65b76d49a0d21df4ecc7/packages/next/src/build/webpack/plugins/flight-client-entry-plugin.ts#L425-L429
              // The compressed serialized CSS of vanilla-extract will add compressionFlag.
              // Causing the resourceQuery to be abnormally split, so uri encoding is required.
              // https://github.com/vanilla-extract-css/vanilla-extract/blob/58005eb5e7456cf2b3c04ea7aef29677db37cc3c/packages/integration/src/serialize.ts#L15
              `${virtualNextFileLoaderExtractionFile}?${encodeURIComponent(
                JSON.stringify({ fileName, source: serializedCss }),
              )}`,
            );
            return `import ${request}`;
          }
        },
      });

      log('Completed successfully');

      callback(null, result);
    })
    .catch((e) => {
      callback(e);
    });
}
