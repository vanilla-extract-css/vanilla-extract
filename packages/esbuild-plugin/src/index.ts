import { dirname, relative } from 'path';
import { promises as fs } from 'fs';

import type { Adapter, FileScope } from '@vanilla-extract/css';
import { setAdapter } from '@vanilla-extract/css/adapter';
import { transformCss } from '@vanilla-extract/css/transformCss';
import {
  cssFileFilter,
  virtualCssFileFilter,
  getSourceFromVirtualCssFile,
} from '@vanilla-extract/integration';
import dedent from 'dedent';
import findUp from 'find-up';
import { build as esbuild, Plugin } from 'esbuild';
// @ts-expect-error
import evalCode from 'eval';
import { stringify } from 'javascript-stringify';
import isPlainObject from 'lodash/isPlainObject';
import crypto from 'crypto';

const hash = (value: string) =>
  crypto.createHash('md5').update(value).digest('hex');

const vanillaCssNamespace = 'vanilla-extract-css-ns';

export const vanillaExtractFilescopePlugin = (): Plugin => ({
  name: 'vanilla-extract-filescope',
  setup(build) {
    const packageJsonPath = findUp.sync('package.json', {
      cwd: build.initialOptions.absWorkingDir,
    });

    if (!packageJsonPath) {
      throw new Error(`Can't find package.json`);
    }

    const { name } = require(packageJsonPath);
    const packageInfo = {
      name,
      path: packageJsonPath,
      dirname: dirname(packageJsonPath),
    };

    build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
      const originalSource = await fs.readFile(path, 'utf-8');

      if (originalSource.indexOf('@vanilla-extract/css/fileScope') === -1) {
        const filePath = relative(packageInfo.dirname, path);

        const contents = `
        import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
        setFileScope("${filePath}", "${packageInfo.name}");
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
  runtime?: boolean;
}
export function vanillaExtractPlugin({
  outputCss = true,
  externals = [],
  runtime = false,
}: VanillaExtractPluginOptions = {}): Plugin {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes to code
    return vanillaExtractFilescopePlugin();
  }

  return {
    name: 'vanilla-extract',
    setup(build) {
      build.onResolve({ filter: virtualCssFileFilter }, (args) => {
        return {
          path: args.path,
          namespace: vanillaCssNamespace,
        };
      });

      build.onLoad(
        { filter: /.*/, namespace: vanillaCssNamespace },
        ({ path }) => {
          const contents = getSourceFromVirtualCssFile(path);

          return {
            contents,
            loader: 'css',
          };
        },
      );

      build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
        const result = await esbuild({
          entryPoints: [path],
          metafile: true,
          bundle: true,
          external: ['@vanilla-extract', ...externals],
          platform: 'node',
          write: false,
          plugins: [vanillaExtractFilescopePlugin()],
          absWorkingDir: build.initialOptions.absWorkingDir,
        });

        const { outputFiles, metafile } = result;

        if (!outputFiles || outputFiles.length !== 1) {
          throw new Error('Invalid child compilation');
        }

        function stringifyFileScope({
          packageName,
          filePath,
        }: FileScope): string {
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
              const fileScopeCss =
                cssByFileScope.get(serialisedFileScope) ?? [];

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

        const sourceWithBoundLoaderInstance = `require('@vanilla-extract/css/adapter').setAdapter(__adapter__);${outputFiles[0].text}`;

        const evalResult = evalCode(
          sourceWithBoundLoaderInstance,
          path,
          { console, __adapter__: cssAdapter },
          true,
        );

        const cssRequests = [];

        for (const [serialisedFileScope, fileScopeCss] of cssByFileScope) {
          const { packageName, filePath } = parseFileScope(serialisedFileScope);
          const css = transformCss({
            localClassNames: Array.from(localClassNames),
            cssObjs: fileScopeCss,
          }).join('\n');
          const base64Css = Buffer.from(css, 'utf-8').toString('base64');
          const fileName = packageName
            ? `${packageName}/${filePath}`
            : filePath;

          cssRequests.push(`${fileName}.vanilla.css?source=${base64Css}`);
        }

        const contents = serializeVanillaModule(cssRequests, evalResult);

        return {
          contents,
          loader: 'js',
          watchFiles: Object.keys(metafile?.inputs || {}),
        };
      });
    },
  };
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
          const hashedImportName = `_${hash(`${importName}${importPath}`).slice(
            0,
            5,
          )}`;

          recipeImports.add(
            `import { ${importName} as ${hashedImportName} } from '${importPath}';`,
          );

          return `${hashedImportName}(${args
            .map((arg) => stringifyExports(recipeImports, arg))
            .join(',')})`;
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
  cssRequests: Array<string>,
  exports: Record<string, unknown>,
) => {
  const cssImports = cssRequests.map((request) => {
    return `import '${request}';`;
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
