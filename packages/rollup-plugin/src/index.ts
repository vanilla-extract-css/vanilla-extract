import { dirname } from 'path';
import type { Adapter } from '@vanilla-extract/css';
import { setAdapter } from '@vanilla-extract/css/adapter';
import { transformCss } from '@vanilla-extract/css/transformCss';
import dedent from 'dedent';
import { rollup, Plugin } from 'rollup';
import { createFilter } from '@rollup/pluginutils';
import { transformAsync } from '@babel/core';
import babelPlugin from '@vanilla-extract/babel-plugin';
// @ts-expect-error
import evalCode from 'eval';
import { stringify } from 'javascript-stringify';
import isPlainObject from 'lodash/isPlainObject';

const vanillaExtractPath = dirname(
  require.resolve('@vanilla-extract/css/package.json'),
);

const isVanillaFile = createFilter(/\.css\.(ts|tsx|js|jsx)$/);

interface FilescopePluginOptions {
  projectRoot?: string;
}
const vanillaExtractFilescopePlugin = ({
  projectRoot,
}: FilescopePluginOptions = {}): Plugin => ({
  name: 'vanilla-extract-filescope',
  async transform(code, id) {
    if (id.indexOf(vanillaExtractPath) > -1) {
      return null;
    }

    if (code.indexOf('@vanilla-extract/css/fileScope') === -1) {
      return (
        await transformAsync(code, {
          filename: id,
          configFile: false,
          plugins: [[babelPlugin, { projectRoot }]],
        })
      )?.code;
    }
  },
});

interface VanillaExtractPluginOptions {
  outputCss?: boolean;
  fileName?: string;
  externals?: Array<string>;
  projectRoot?: string;
  plugins?: Array<Plugin>;
  runtime?: boolean;
}
export const vanillaExtractPlugin = ({
  outputCss = true,
  fileName = 'styles.css',
  externals = [],
  projectRoot,
  plugins = [],
  runtime = false,
}: VanillaExtractPluginOptions = {}): Plugin => {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes to code
    return vanillaExtractFilescopePlugin({ projectRoot });
  }

  type Css = Parameters<Adapter['appendCss']>[0];
  const cssByFileScope = new Map<string, Array<Css>>();
  const processedCssById = new Map<string, Array<string>>();
  const localClassNames = new Set<string>();

  return {
    name: 'vanilla-extract',

    async transform(_code, id) {
      if (!isVanillaFile(id)) {
        return null;
      }

      const bundle = await rollup({
        input: id,
        external: [...externals, /@vanilla-extract\//],
        plugins: [vanillaExtractFilescopePlugin({ projectRoot }), ...plugins],
      });

      const { output } = await bundle.generate({
        format: 'cjs',
      });

      if (output.length !== 1) {
        throw new Error('Invalid child compilation');
      }

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

      const sourceWithBoundLoaderInstance = `require('@vanilla-extract/css/adapter').setAdapter(__adapter__);${output[0].code}`;

      const evalResult = evalCode(
        sourceWithBoundLoaderInstance,
        id,
        { console, __adapter__: cssAdapter },
        true,
      );

      const processedCss: Array<string> = [];

      for (const [_fileScope, fileScopeCss] of cssByFileScope) {
        processedCss.push(
          transformCss({
            localClassNames: Array.from(localClassNames),
            cssObjs: fileScopeCss,
          }).join('\n'),
        );
      }

      processedCssById.set(id, processedCss);

      return serializeVanillaModule(evalResult);
    },

    generateBundle() {
      if (!outputCss) {
        return;
      }

      const dedupedCss = new Set<string>();

      const moduleIds = [...this.getModuleIds()];
      moduleIds.forEach((moduleId) => {
        processedCssById.get(moduleId)?.forEach((css) => {
          dedupedCss.add(css);
        });
      });

      const source = [...dedupedCss.values()].join('\n');

      this.emitFile({
        type: 'asset',
        source,
        fileName,
      });
    },
  };
};

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

const serializeVanillaModule = (exports: Record<string, unknown>) => {
  const moduleExports = Object.keys(exports).map((key) =>
    key === 'default'
      ? `export default ${stringifyExports(exports[key])};`
      : `export var ${key} = ${stringifyExports(exports[key])};`,
  );

  return moduleExports.join('\n');
};
