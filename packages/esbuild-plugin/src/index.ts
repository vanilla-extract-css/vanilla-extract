import { dirname, relative } from 'path';
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

interface FilescopePluginOptions {
  projectRoot?: string;
}
const vanillaExtractFilescopePlugin = ({
  projectRoot,
}: FilescopePluginOptions): Plugin => ({
  name: 'vanilla-extract-filescope',
  setup(build) {
    build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, async ({ path }) => {
      const originalSource = await fs.readFile(path, 'utf-8');

      if (originalSource.indexOf('@vanilla-extract/css/fileScope') === -1) {
        const fileScope = projectRoot ? relative(projectRoot, path) : path;

        const contents = `
        import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
        setFileScope("${fileScope}");
        ${originalSource}
        endFileScope()
        `;

        return {
          contents,
          resolveDir: dirname(path),
        };
      }
    });
  },
});

interface VanillaExtractPluginOptions {
  outputCss?: boolean;
  externals?: Array<string>;
  projectRoot?: string;
  runtime?: boolean;
}
export function vanillaExtractPlugin({
  outputCss = true,
  externals = [],
  projectRoot,
  runtime = false,
}: VanillaExtractPluginOptions = {}): Plugin {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes to code
    return vanillaExtractFilescopePlugin({ projectRoot });
  }

  return {
    name: 'vanilla-extract',
    setup(build) {
      build.onResolve({ filter: /vanilla\.css\?source=.*$/ }, (args) => {
        return {
          path: args.path,
          namespace: vanillaCssNamespace,
        };
      });

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
          external: ['@vanilla-extract', ...externals],
          platform: 'node',
          write: false,
          plugins: [vanillaExtractFilescopePlugin({ projectRoot })],
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

  const moduleExports = Object.keys(exports).map((key) =>
    key === 'default'
      ? `export default ${stringifyExports(exports[key])};`
      : `export var ${key} = ${stringifyExports(exports[key])};`,
  );

  const outputCode = [...cssImports, ...moduleExports];

  return outputCode.join('\n');
};
