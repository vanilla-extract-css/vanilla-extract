import { dirname } from 'path';
import { promises as fs } from 'fs';

import type { Adapter } from '@vanilla-extract/css';
import { setAdapter } from '@vanilla-extract/css/adapter';
import { transformCss } from '@vanilla-extract/css/transformCss';
import dedent from 'dedent';
import { build as esbuild, Plugin } from 'esbuild';
// @ts-expect-error
import evalCode from 'eval';
import { stringify } from 'javascript-stringify';
import isPlainObject from 'lodash/isPlainObject';

const vanillaCssNamespace = 'vanilla-extract-css-ns';

const vanillaExtractFilescopePlugin: Plugin = {
  name: 'vanilla-extract-filescope',
  setup(build) {
    build.onLoad({ filter: /\.css\.(js|jsx|ts|tsx)$/ }, async ({ path }) => {
      const originalSource = await fs.readFile(path, 'utf-8');

      const contents = `
        import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
        setFileScope("${path}");
        ${originalSource}
        endFileScope()
        `;

      return {
        contents,
        resolveDir: dirname(path),
      };
    });
  },
};

export function vanillaExtractPlugin(): Plugin {
  return {
    name: 'vanilla-extract',
    setup(build) {
      build.onResolve({ filter: /vanilla\.css\?source=.*$/ }, (args) => ({
        path: args.path,
        namespace: vanillaCssNamespace,
      }));

      build.onLoad(
        { filter: /.*/, namespace: vanillaCssNamespace },
        ({ path }) => {
          const [, source] = path.match(/\?source=(.*)$/) ?? [];

          if (!source) {
            throw new Error('No source in vanilla CSS file');
          }

          return {
            contents: Buffer.from(source, 'base64').toString('utf-8'),
            loader: 'css',
          };
        },
      );

      build.onLoad({ filter: /\.css\.(js|jsx|ts|tsx)$/ }, async ({ path }) => {
        const result = await esbuild({
          entryPoints: [path],
          metafile: true,
          bundle: true,
          external: ['@vanilla-extract'],
          platform: 'node',
          write: false,
          plugins: [vanillaExtractFilescopePlugin],
          treeShaking: 'ignore-annotations',
        });

        const { outputFiles } = result;

        if (!outputFiles || outputFiles.length !== 1) {
          throw new Error('Invalid child compilation');
        }

        type Css = Parameters<Adapter['appendCss']>[0];
        const cssByFileScope = new Map<string, Array<Css>>();
        const localClassNames = new Set<string>();

        const cssAdapter: Adapter = {
          appendCss: (css, fileScope) => {
            const fileScopeCss = cssByFileScope.get(fileScope) ?? [];

            fileScopeCss.push(css);

            cssByFileScope.set(fileScope, fileScopeCss);
          },
          registerClassName: (className) => {
            localClassNames.add(className);
          },
          onEndFileScope: () => {},
        };

        setAdapter(cssAdapter);

        const sourceWithBoundLoaderInstance = `require('@vanilla-extract/css/adapter').setAdapter(__adapter__);${outputFiles[0].text}`;

        const evalResult = evalCode(
          sourceWithBoundLoaderInstance,
          path,
          { console, __adapter__: cssAdapter },
          true,
        );

        const cssRequests = [];

        for (const [fileScope, fileScopeCss] of cssByFileScope) {
          const css = transformCss({
            localClassNames: Array.from(localClassNames),
            cssObjs: fileScopeCss,
          }).join('\n');
          const base64Css = Buffer.from(css, 'utf-8').toString('base64');

          cssRequests.push(`${fileScope}.vanilla.css?source=${base64Css}`);
        }

        const contents = serializeVanillaModule(cssRequests, evalResult);

        return {
          contents,
          loader: 'js',
        };
      });
    },
  };
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

const serializeVanillaModule = (
  cssRequests: Array<string>,
  exports: Record<string, unknown>,
) => {
  const cssImports = cssRequests.map((request) => {
    return `import '${request}';`;
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
