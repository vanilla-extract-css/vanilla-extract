// @ts-expect-error
import loaderUtils from 'loader-utils';
import {
  getPackageInfo,
  IdentifierOption,
  transform,
  type Compiler as VanillaExtractCompiler,
} from '@vanilla-extract/integration';

import type { LoaderContext } from './types';
import { debug, formatResourcePath } from './logger';
interface LoaderOptions {
  outputCss: boolean;
  identifiers?: IdentifierOption;
}

interface InternalLoaderOptions extends LoaderOptions {
  vanillaExtractCompiler: VanillaExtractCompiler;
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
  const { vanillaExtractCompiler, outputCss } = loaderUtils.getOptions(
    this,
  ) as InternalLoaderOptions;

  const log = debug(
    `vanilla-extract:loader:${formatResourcePath(this.resourcePath)}`,
  );

  log(`Loading file ${this.resourcePath}`);

  const callback = this.async();

  vanillaExtractCompiler
    .processVanillaFile(this.resourcePath, {
      outputCss,
    })
    .then(({ source, watchFiles }) => {
      watchFiles.forEach((dep) => {
        this.addDependency(dep);
      });
      log(`Source:\n${source}`);
      callback(null, source);
    })
    .catch((e) => {
      callback(e);
    });
}
