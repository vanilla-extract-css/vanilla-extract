import path from 'path';

// @ts-expect-error
import evalCode from 'eval';
// @ts-expect-error
import loaderUtils from 'loader-utils';
import isPlainObject from 'lodash/isPlainObject';
import { stringify } from 'javascript-stringify';
import dedent from 'dedent';
import type { Adapter } from '@mattsjones/css-core';
import { setAdapter } from '@mattsjones/css-core/adapter';
import { transformCss } from '@mattsjones/css-core/transformCss';

import type { LoaderContext } from './types';
import { debug, formatResourcePath } from './logger';
import TreatError from './TreatError';
import { ChildCompiler } from './compiler';

const stringifyLoaderRequest = (
  loaderConfig: string | Record<string | number, any>,
) => {
  if (typeof loaderConfig === 'string') {
    return loaderConfig;
  }

  const { loader, options = {} } = loaderConfig;

  return `${loader}?${JSON.stringify(options)}`;
};

interface LoaderOptions {
  outputCss: boolean;
  hmr: boolean | undefined;
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
  const { childCompiler, ...options } = loaderUtils.getOptions(
    this,
  ) as InternalLoaderOptions;

  const log = debug(`treat:loader:${formatResourcePath(this.resourcePath)}`);

  const compiler = this._compiler;

  const isChildCompiler = childCompiler.isChildCompiler(compiler.name);

  if (
    isChildCompiler &&
    compiler.options.output.filename === this.resourcePath
  ) {
    log(
      'Skip treat loader as we are already within a treat child compiler for this file',
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
      // If within a treat child compiler then only compile source, don't eval and assign CSS
      return callback(null, source);
    }

    const result = await processSource(this, source, options);

    callback(null, result);
  } catch (e) {
    callback(e);
  }
}

async function processSource(
  loader: LoaderContext,
  source: string,
  { outputCss, hmr }: LoaderOptions,
) {
  const log = debug(`treat:loader:${formatResourcePath(loader.resourcePath)}`);

  log('Loading resource');

  const isHmr = typeof hmr === 'boolean' ? hmr : loader.hot;

  const makeCssModule = (fileScope: string, css: string) => {
    const base64 = Buffer.from(css, 'utf-8').toString('base64');

    const virtualResourceLoader = stringifyLoaderRequest({
      loader: require.resolve('virtual-resource-loader'),
      options: { source: base64 },
    });
    const cssFileName = `${fileScope}.vanilla.css`;
    const absoluteFileScope = path.join(loader.rootContext, fileScope);

    const cssRequest = `${cssFileName}!=!${virtualResourceLoader}!${absoluteFileScope}`;

    log('Add CSS request %s', cssRequest);

    return cssRequest;
  };

  type Css = Parameters<Adapter['appendCss']>[0];
  const cssByFileScope = new Map<string, Array<Css>>();
  const localClassNames = new Set<string>();

  const cssAdapter: Adapter = {
    appendCss: (css, fileScope) => {
      if (outputCss) {
        const fileScopeCss = cssByFileScope.get(fileScope) ?? [];

        fileScopeCss.push(css);

        cssByFileScope.set(fileScope, fileScopeCss);
      }
    },
    registerClassName: (className) => {
      localClassNames.add(className);
    },
    onEndFileScope: () => {},
  };

  setAdapter(cssAdapter);

  const sourceWithBoundLoaderInstance = `require('@mattsjones/css-core/adapter').setAdapter(__webpack_adapter__);
  ${source}`;

  let result;
  try {
    result = evalCode(
      sourceWithBoundLoaderInstance,
      loader.resourcePath,
      {
        console,
        __webpack_adapter__: cssAdapter,
      },
      true,
    );
  } catch (e) {
    throw new TreatError(e);
  }

  const cssRequests = [];

  // TODO  ???? Why can't I iterate the Map without Array.from ????
  for (const [fileScope, fileScopeCss] of Array.from(
    cssByFileScope.entries(),
  )) {
    const css = transformCss({
      localClassNames: Array.from(localClassNames),
      cssObjs: fileScopeCss,
    }).join('\n');

    cssRequests.push(makeCssModule(fileScope, css));
  }

  return serializeTreatModule(loader, cssRequests, result, isHmr);
}

const stringifyExports = (value: any) =>
  stringify(
    value,
    (value, _indent, next) => {
      const valueType = typeof value;
      if (
        valueType === 'string' ||
        valueType === 'number' ||
        valueType === 'undefined' ||
        value === null ||
        Array.isArray(value) ||
        isPlainObject(value)
      ) {
        return next(value);
      }

      throw new Error(dedent`
        Invalid exports.

        You can only export plain objects, arrays, strings, numbers and null/undefined.
      `);
    },
    0,
    {
      references: true, // Allow circular references
      maxDepth: Infinity,
      maxValues: Infinity,
    },
  );

const serializeTreatModule = (
  loader: LoaderContext,
  cssRequests: Array<string>,
  exports: Record<string, unknown>,
  _isHmr: boolean,
) => {
  const cssImports = cssRequests.map((request) => {
    const relativeRequest = loaderUtils.stringifyRequest(loader, request);

    return `import ${relativeRequest};`;
  });
  // // Ensure consitent import order for content hashing
  // // Chunk ordering is fixed by the webpack plugin
  // const sortedCssImports = sortBy(cssImports);

  const moduleExports = Object.keys(exports).map((key) =>
    key === 'default'
      ? `export default ${stringifyExports(exports[key])};`
      : `export var ${key} = ${stringifyExports(exports[key])};`,
  );

  const outputCode = [...cssImports, ...moduleExports];

  return outputCode.join('\n');
};
