import path from 'path';
// @ts-expect-error
import loaderUtils from 'loader-utils';
import {
  IdentifierOption,
  processVanillaFile,
} from '@vanilla-extract/integration';

import type { LoaderContext } from './types';
import { debug, formatResourcePath } from './logger';
import { ChildCompiler } from './compiler';

const emptyCssExtractionFile = require.resolve(
  path.join(
    path.dirname(
      require.resolve('@vanilla-extract/webpack-plugin/package.json'),
    ),
    'extracted',
  ),
);

interface LoaderOptions {
  outputCss: boolean;
  identifiers?: IdentifierOption;
}

interface InternalLoaderOptions extends LoaderOptions {
  childCompiler: ChildCompiler;
}

export default function (this: LoaderContext, source: string) {
  this.cacheable(true);
  return source;
}

export function pitch(this: LoaderContext) {
  this.cacheable(true);
  const { childCompiler, outputCss, identifiers } = loaderUtils.getOptions(
    this,
  ) as InternalLoaderOptions;

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
    .then(({ source }) => {
      const result = processVanillaFile({
        source,
        outputCss,
        filePath: this.resourcePath,
        identOption:
          identifiers ?? (this.mode === 'production' ? 'short' : 'debug'),
        serializeVirtualCssPath: ({ fileName, base64Source }) => {
          const virtualResourceLoader = `${require.resolve(
            'virtual-resource-loader',
          )}?${JSON.stringify({ source: base64Source })}`;

          const request = loaderUtils.stringifyRequest(
            this,
            `${fileName}!=!${virtualResourceLoader}!${emptyCssExtractionFile}`,
          );

          return `import ${request}`;
        },
      });

      log('Completed successfully');

      callback(null, result);
    })
    .catch((e) => {
      callback(e);
    });
}
