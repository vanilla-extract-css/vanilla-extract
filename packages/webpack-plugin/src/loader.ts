// @ts-expect-error
import evalCode from 'eval';
// @ts-expect-error
import loaderUtils from 'loader-utils';

import type { LoaderContext } from './types';
import { debug, formatResourcePath } from './logger';
import { ChildCompiler } from './compiler';
import { processVanillaFile } from '@vanilla-extract/integration/src';

interface LoaderOptions {
  outputCss: boolean;
}

interface InternalLoaderOptions extends LoaderOptions {
  childCompiler: ChildCompiler;
}

export default function (this: LoaderContext, source: string) {
  this.cacheable(true);
  return source;
}

export async function pitch(this: LoaderContext, remainingRequest: string) {
  this.cacheable(true);
  const { childCompiler, outputCss } = loaderUtils.getOptions(
    this,
  ) as InternalLoaderOptions;

  const log = debug(
    `vanilla-extract:loader:${formatResourcePath(this.resourcePath)}`,
  );

  const compiler = this._compiler;

  const isChildCompiler = childCompiler.isChildCompiler(compiler.name);

  if (
    isChildCompiler &&
    compiler.options.output.filename === this.resourcePath
  ) {
    log(
      'Skip vanilla-extract loader as we are already within a child compiler for this file',
    );
    return;
  }

  const callback = this.async();

  try {
    const { source } = await childCompiler.getCompiledSource(
      this,
      remainingRequest,
    );

    if (isChildCompiler) {
      // If within a vanilla-extract child compiler then only compile source, don't eval and assign CSS
      return callback(null, source);
    }

    const result = processVanillaFile({
      source,
      outputCss,
      filePath: this.resourcePath,
      serializeVirtualCssPath: ({ fileName, base64Source }) => {
        const virtualResourceLoader = `${require.resolve(
          'virtual-resource-loader',
        )}?${JSON.stringify({ source: base64Source })}`;

        const request = loaderUtils.stringifyRequest(
          this,
          `${fileName}!=!${virtualResourceLoader}!@vanilla-extract/webpack-plugin/extracted`,
        );

        return `import ${request}`;
      },
    });

    callback(null, result);
  } catch (e) {
    callback(e);
  }
}
