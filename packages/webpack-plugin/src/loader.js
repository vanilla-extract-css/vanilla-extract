import path from 'path';

import evalCode from 'eval';
import loaderUtils from 'loader-utils';
import isPlainObject from 'lodash/isPlainObject';
import dedent from 'dedent';
import { stringify } from 'javascript-stringify';
import debug from 'debug';

import TreatError from './TreatError';
import { getCompiledSource } from './treatCompiler';

const log = debug('treat:loader');

const stringifyLoaderRequest = (loaderConfig) => {
  if (typeof loaderConfig === 'string') {
    return loaderConfig;
  }

  const { loader, options = {} } = loaderConfig;

  return `${loader}?${JSON.stringify(options)}`;
};

export default function (source) {
  this.cacheable(true);
  return source;
}

export function pitch() {
  this.cacheable(true);

  const compiler = this._compiler;

  // TODO link compiler name with treatCompiler file
  if (compiler.name === 'treat-webpack-loader') {
    // Skip treat loader as we are already within a treat child compiler
    return;
  }

  const callback = this.async();

  produce(this)
    .then((result) => callback(null, result))
    .catch((e) => {
      callback(e);
    });
}

async function produce(loader) {
  const { outputCss } = loaderUtils.getOptions(loader);

  const isHmr = typeof hmr === 'boolean' ? hmr : loader.hot;

  const { source, dependencies } = await getCompiledSource(loader);

  const makeCssModule = (css) => {
    const base64 = Buffer.from(css, 'utf-8').toString('base64');

    const virtualResourceLoader = stringifyLoaderRequest({
      loader: 'virtual-resource-loader',
      options: { source: base64 },
    });
    const cssFileName = path.normalize(
      loaderUtils.interpolateName(loader, '[hash:base64:7].treatcss', {
        content: css,
      }),
    );

    // TODO use better noop file
    const cssRequest = `${cssFileName}!=!${virtualResourceLoader}!@treat/webpack-plugin/loader`;

    log('%s Add CSS request %s', loader.resourcePath, cssRequest);

    return cssRequest;
  };

  const fileCss = [];
  let result;

  const __webpack_adapter__ = {
    appendCss: (css) => {
      fileCss.push(css);
    },
  };

  const sourceWithBoundLoaderInstance = `require('@treat/core/adapter').setAdapter(__webpack_adapter__);\n${source}`;

  try {
    result = evalCode(
      sourceWithBoundLoaderInstance,
      loader.resourcePath,
      {
        console,
        __webpack_adapter__,
      },
      true,
    );
  } catch (e) {
    throw new TreatError(e);
  }

  const cssRequests = outputCss ? fileCss.map((css) => makeCssModule(css)) : [];

  return serializeTreatModule(loader, cssRequests, result, isHmr);
}

const stringifyExports = (value) =>
  stringify(
    value,
    (value, indent, next) => {
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

      // TODO handle incorrect function exports, maybe allowlist our API
      next(null);

      // throw new Error(dedent`
      //   Invalid treat file exports.

      //   You can only export plain objects, arrays, strings, numbers and null/undefined from a treat file.
      // `);
    },
    0,
    {
      references: true, // Allow circular references
      maxDepth: Infinity,
      maxValues: Infinity,
    },
  );

const serializeTreatModule = (loader, cssRequests, exports) => {
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
