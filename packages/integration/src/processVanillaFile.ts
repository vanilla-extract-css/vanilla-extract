import path from 'path';

import { FileScope, Adapter } from '@vanilla-extract/css';
import { setAdapter } from '@vanilla-extract/css/adapter';
import { transformCss } from '@vanilla-extract/css/transformCss';
// @ts-expect-error
import evalCode from 'eval';
import { stringify } from 'javascript-stringify';
import isPlainObject from 'lodash/isPlainObject';
import dedent from 'dedent';
import { hash } from './hash';

const originalNodeEnv = process.env.NODE_ENV;

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

interface ProcessVanillaFileOptions {
  source: string;
  filePath: string;
  outputCss?: boolean;
  serializeVirtualCssPath?: (file: {
    fileName: string;
    base64Source: string;
  }) => string;
}
export function processVanillaFile({
  source,
  filePath,
  outputCss = true,
  serializeVirtualCssPath,
}: ProcessVanillaFileOptions) {
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

  const currentNodeEnv = process.env.NODE_ENV;

  const sourceWithBoundLoaderInstance = `require('@vanilla-extract/css/adapter').setAdapter(__adapter__);${source};`;

  // Vite sometimes modifies NODE_ENV which causes different versions (e.g. dev/prod) of vanilla packages to be loaded
  // This can cause CSS to be bound to the wrong instance, resulting in no CSS output
  // To get around this we set the NODE_ENV back to the original value ONLY during eval
  process.env.NODE_ENV = originalNodeEnv;

  const evalResult = evalCode(
    sourceWithBoundLoaderInstance,
    filePath,
    { console, __adapter__: cssAdapter, process },
    true,
  );

  process.env.NODE_ENV = currentNodeEnv;

  const cssImports = [];

  for (const [serialisedFileScope, fileScopeCss] of cssByFileScope) {
    const filescope = parseFileScope(serialisedFileScope);
    const css = transformCss({
      localClassNames: Array.from(localClassNames),
      cssObjs: fileScopeCss,
    }).join('\n');

    const base64Source = Buffer.from(css, 'utf-8').toString('base64');
    const fileName = path.normalize(
      `${
        filescope.packageName
          ? `${filescope.packageName}/${filescope.filePath}`
          : filescope.filePath
      }.vanilla.css`,
    );

    const virtualCssFilePath = serializeVirtualCssPath
      ? serializeVirtualCssPath({ fileName, base64Source })
      : `import '${fileName}?source=${base64Source}';`;

    cssImports.push(virtualCssFilePath);
  }

  return serializeVanillaModule(cssImports, evalResult);
}

function stringifyExports(recipeImports: Set<string>, value: any): any {
  return stringify(
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

      if (valueType === 'function') {
        console.log(value.__recipe__);
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
}

function serializeVanillaModule(
  cssImports: Array<string>,
  exports: Record<string, unknown>,
) {
  const recipeImports = new Set<string>();

  const moduleExports = Object.keys(exports).map((key) =>
    key === 'default'
      ? `export default ${stringifyExports(recipeImports, exports[key])};`
      : `export var ${key} = ${stringifyExports(recipeImports, exports[key])};`,
  );

  const outputCode = [...cssImports, ...recipeImports, ...moduleExports];

  return outputCode.join('\n');
}
