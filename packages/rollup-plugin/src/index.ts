import { relative } from 'path';
import type { Adapter } from '@vanilla-extract/css';
import { setAdapter } from '@vanilla-extract/css/adapter';
import { transformCss } from '@vanilla-extract/css/transformCss';
import dedent from 'dedent';
import { rollup, Plugin } from 'rollup';
import { createFilter } from '@rollup/pluginutils';
// @ts-expect-error
import evalCode from 'eval';
import { stringify } from 'javascript-stringify';
import isPlainObject from 'lodash/isPlainObject';

interface FilescopePluginOptions {
  projectRoot?: string;
}
const vanillaExtractFilescopePlugin = ({
  projectRoot,
}: FilescopePluginOptions = {}): Plugin => ({
  name: 'vanilla-extract-filescope',
  transform(code, id) {
    if (
      code.indexOf('@vanilla-extract/css') > 0 &&
      code.indexOf('@vanilla-extract/css/fileScope') === -1
    ) {
      const fileScope = projectRoot ? relative(projectRoot, id) : id;

      return dedent`
        import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
        setFileScope("${fileScope}");
        ${code}
        endFileScope()
      `;
    }
  },
});

interface VanillaExtractPluginOptions {
  outputCss?: boolean;
  fileName?: string;
  externals?: Array<string>;
  projectRoot?: string;
  plugins?: Array<Plugin>;
}
export const vanillaExtractPlugin = ({
  outputCss = true,
  fileName = 'styles.css',
  externals = [],
  projectRoot,
  plugins = [],
}: VanillaExtractPluginOptions = {}): Plugin => {
  const isVanillaFile = createFilter(/\.css\.(ts|tsx|js|jsx)$/);

  type Css = Parameters<Adapter['appendCss']>[0];
  const cssByFileScope = new Map<string, Array<Css>>();
  const processedCssById = new Map<string, string>();
  const localClassNames = new Set<string>();

  return {
    name: 'vanilla-extract',

    async transform(_code, id) {
      if (!isVanillaFile(id)) {
        return null;
      }

      if (this.cache.has(id)) {
        return this.cache.get(id);
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

      for (const [_fileScope, fileScopeCss] of cssByFileScope) {
        const css = transformCss({
          localClassNames: Array.from(localClassNames),
          cssObjs: fileScopeCss,
        }).join('\n');

        processedCssById.set(id, `${processedCssById.get(id) ?? ''}${css}`);
      }

      return serializeVanillaModule(evalResult);
    },

    generateBundle() {
      if (!outputCss) {
        return;
      }

      let source = '';

      [...this.getModuleIds()].map((moduleId) => {
        const css = processedCssById.get(moduleId);

        if (css) {
          source += css;
        }
      });

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
