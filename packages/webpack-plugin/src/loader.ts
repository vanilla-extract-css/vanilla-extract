import path from 'path';
// @ts-expect-error
import loaderUtils from 'loader-utils';
import {
  IdentifierOption,
  processVanillaFile,
  addFileScope,
  getPackageInfo,
} from '@vanilla-extract/integration';

import type { LoaderContext } from './types';
import { debug, formatResourcePath } from './logger';
import { ChildCompiler } from './compiler';
import { virtualCssFiles } from './virtualModules';

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
  childCompiler: ChildCompiler;
}

export default function (this: LoaderContext, source: string) {
  this.cacheable(true);

  const { name } = getPackageInfo(this.rootContext);

  return addFileScope({
    source,
    filePath: this.resourcePath,
    rootPath: this.rootContext,
    packageName: name,
  });
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
    .then(async ({ source }) => {
      const result = await processVanillaFile({
        source,
        outputCss,
        filePath: this.resourcePath,
        identOption:
          identifiers ?? (this.mode === 'production' ? 'short' : 'debug'),
        serializeVirtualCssPath: async ({ fileName, source, fileScope }) => {
          const virtualCssFilePath = path.join(
            this.rootContext,
            fileScope.filePath,
          );
          virtualCssFiles.set(virtualCssFilePath, source);

          const request = loaderUtils.stringifyRequest(
            this,
            `${fileName}!=!${virtualLoader}!${virtualCssFilePath}`,
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
