// @ts-expect-error
import evalCode from 'eval';
// @ts-expect-error
import loaderUtils from 'loader-utils';
import isPlainObject from 'lodash/isPlainObject';
import { stringify } from 'javascript-stringify';
import dedent from 'dedent';
import type { Adapter, FileScope } from '@vanilla-extract/css';
import { setAdapter } from '@vanilla-extract/css/adapter';
import { transformCss } from '@vanilla-extract/css/transformCss';

import type { LoaderContext } from './types';
import { debug, formatResourcePath } from './logger';
import VanillaExtractError from './VanillaExtractError';
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

    const result = await processSource(this, source, options);

    callback(null, result);
  } catch (e) {
    callback(e);
  }
}

async function processSource(
  loader: LoaderContext,
  source: string,
  { outputCss }: LoaderOptions,
) {
  const log = debug(
    `vanilla-extract:loader:${formatResourcePath(loader.resourcePath)}`,
  );

  log('Loading resource');

  const makeCssModule = ({ packageName, filePath }: FileScope, css: string) => {
    const base64 = Buffer.from(css, 'utf-8').toString('base64');

    const virtualResourceLoader = stringifyLoaderRequest({
      loader: require.resolve('virtual-resource-loader'),
      options: { source: base64 },
    });
    const cssFileName = packageName
      ? `${packageName}/${filePath}.vanilla.css`
      : `${filePath}.vanilla.css`;

    const cssRequest = `${cssFileName}!=!${virtualResourceLoader}!@vanilla-extract/webpack-plugin/extracted`;

    log('Add CSS request %s', cssRequest);

    return cssRequest;
  };

  function stringifyFileScope({ packageName, filePath }: FileScope): string {
    return packageName ? `${filePath}$$$${packageName}` : filePath;
  }

  function parseFileScope(serialisedFileScope: string): FileScope {
    const [filePath, packageName] = serialisedFileScope.split('$$$');

    return {
      filePath,
      packageName,
    };
  }

  type Css = Parameters<Adapter['appendCss']>[0];
  const cssByFileScope = new Map<string, Array<Css>>();
  const localClassNames = new Set<string>();

  const cssAdapter: Adapter = {
    appendCss: (css, fileScope) => {
      if (outputCss) {
        const serialisedFileScope = stringifyFileScope(fileScope);
        const fileScopeCss = cssByFileScope.get(serialisedFileScope) ?? [];

        fileScopeCss.push(css);

        cssByFileScope.set(serialisedFileScope, fileScopeCss);
      }
    },
    registerClassName: (className) => {
      localClassNames.add(className);
    },
    onEndFileScope: () => {},
  };

  setAdapter(cssAdapter);

  const sourceWithBoundLoaderInstance = `require('@vanilla-extract/css/adapter').setAdapter(__webpack_adapter__);
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
    throw new VanillaExtractError(e);
  }

  const cssRequests = [];

  for (const [serialisedFileScope, fileScopeCss] of cssByFileScope.entries()) {
    const fileScope = parseFileScope(serialisedFileScope);
    const css = transformCss({
      localClassNames: Array.from(localClassNames),
      cssObjs: fileScopeCss,
    }).join('\n');

    cssRequests.push(makeCssModule(fileScope, css));
  }

  return serializeVanillaModule(loader, cssRequests, result);
}

const stringifyExports = (recipeImports: Set<string>, value: any): any =>
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

      if (valueType === 'function' && value.__recipe__) {
        const { importPath, importName, args } = value.__recipe__;

        if (
          typeof importPath !== 'string' ||
          typeof importName !== 'string' ||
          !Array.isArray(args)
        ) {
          throw new Error('Invalid recipe');
        }

        try {
          const guardedImportName = `__${importName}__`;

          recipeImports.add(
            `import { ${importName} as ${guardedImportName} } from '${importPath}';`,
          );

          return `${guardedImportName}(...${stringifyExports(
            recipeImports,
            args,
          )})`;
        } catch (err) {
          console.error(err);

          throw new Error('Invalid recipe.');
        }
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

const serializeVanillaModule = (
  loader: LoaderContext,
  cssRequests: Array<string>,
  exports: Record<string, unknown>,
) => {
  const cssImports = cssRequests.map((request) => {
    const relativeRequest = loaderUtils.stringifyRequest(loader, request);

    return `import ${relativeRequest};`;
  });

  const recipeImports = new Set<string>();

  const moduleExports = Object.keys(exports).map((key) =>
    key === 'default'
      ? `export default ${stringifyExports(recipeImports, exports[key])};`
      : `export var ${key} = ${stringifyExports(recipeImports, exports[key])};`,
  );

  const outputCode = [...cssImports, ...recipeImports, ...moduleExports];

  return outputCode.join('\n');
};
