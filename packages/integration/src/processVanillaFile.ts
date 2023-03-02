import { FileScope, Adapter } from '@vanilla-extract/css';
import { transformCss } from '@vanilla-extract/css/transformCss';
// @ts-expect-error
import evalCode from 'eval';
import { stringify } from 'javascript-stringify';
import isPlainObject from 'lodash/isPlainObject';
import outdent from 'outdent';

import { hash } from './hash';
import { serializeCss } from './serialize';
import type { IdentifierOption } from './types';

const originalNodeEnv = process.env.NODE_ENV;

export function stringifyFileScope({
  packageName,
  filePath,
}: FileScope): string {
  return packageName ? `${filePath}$$$${packageName}` : filePath;
}

export function parseFileScope(serialisedFileScope: string): FileScope {
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
  identOption?: IdentifierOption;
  serializeVirtualCssPath?: (file: {
    fileName: string;
    fileScope: FileScope;
    source: string;
  }) => string | Promise<string>;
}
export async function processVanillaFile({
  source,
  filePath,
  outputCss = true,
  identOption = process.env.NODE_ENV === 'production' ? 'short' : 'debug',
  serializeVirtualCssPath,
}: ProcessVanillaFileOptions) {
  type Css = Parameters<Adapter['appendCss']>[0];
  type Composition = Parameters<Adapter['registerComposition']>[0];

  const cssByFileScope = new Map<string, Array<Css>>();
  const localClassNames = new Set<string>();
  const composedClassLists: Array<Composition> = [];
  const usedCompositions = new Set<string>();

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
    registerComposition: (composedClassList) => {
      composedClassLists.push(composedClassList);
    },
    markCompositionUsed: (identifier) => {
      usedCompositions.add(identifier);
    },
    onEndFileScope: () => {},
    getIdentOption: () => identOption,
  };

  const currentNodeEnv = process.env.NODE_ENV;

  // Vite sometimes modifies NODE_ENV which causes different versions (e.g. dev/prod) of vanilla packages to be loaded
  // This can cause CSS to be bound to the wrong instance, resulting in no CSS output
  // To get around this we set the NODE_ENV back to the original value ONLY during eval
  process.env.NODE_ENV = originalNodeEnv;

  const adapterBoundSource = `
    require('@vanilla-extract/css/adapter').setAdapter(__adapter__);
    ${source}
  `;

  const evalResult = evalCode(
    adapterBoundSource,
    filePath,
    { console, process, __adapter__: cssAdapter },
    true,
  );

  process.env.NODE_ENV = currentNodeEnv;

  const cssImports = [];

  for (const [serialisedFileScope, fileScopeCss] of cssByFileScope) {
    const fileScope = parseFileScope(serialisedFileScope);
    const css = transformCss({
      localClassNames: Array.from(localClassNames),
      composedClassLists,
      cssObjs: fileScopeCss,
    }).join('\n');

    const fileName = `${fileScope.filePath}.vanilla.css`;

    let virtualCssFilePath: string;

    if (serializeVirtualCssPath) {
      const serializedResult = serializeVirtualCssPath({
        fileName,
        fileScope,
        source: css,
      });

      if (typeof serializedResult === 'string') {
        virtualCssFilePath = serializedResult;
      } else {
        virtualCssFilePath = await serializedResult;
      }
    } else {
      const serializedCss = await serializeCss(css);

      virtualCssFilePath = `import '${fileName}?source=${serializedCss}';`;
    }

    cssImports.push(virtualCssFilePath);
  }

  // We run this code inside eval as jest seems to create a difrerent instance of the adapter file
  // for requires executed within the eval and all CSS can be lost.
  evalCode(
    `const { removeAdapter } = require('@vanilla-extract/css/adapter');
    // Backwards compat with older versions of @vanilla-extract/css
    if (removeAdapter) {
      removeAdapter();
    }
  `,
    filePath,
    { console, process },
    true,
  );

  const unusedCompositions = composedClassLists
    .filter(({ identifier }) => !usedCompositions.has(identifier))
    .map(({ identifier }) => identifier);

  const unusedCompositionRegex =
    unusedCompositions.length > 0
      ? RegExp(`(${unusedCompositions.join('|')})\\s`, 'g')
      : null;

  return serializeVanillaModule(cssImports, evalResult, unusedCompositionRegex);
}

function stringifyExports(
  functionSerializationImports: Set<string>,
  value: any,
  unusedCompositionRegex: RegExp | null,
  key: string,
  exportLookup: Map<any, string>,
): any {
  return stringify(
    value,
    (value, _indent, next) => {
      const valueType = typeof value;

      if (
        valueType === 'boolean' ||
        valueType === 'number' ||
        valueType === 'undefined' ||
        value === null
      ) {
        return next(value);
      }

      if (Array.isArray(value) || isPlainObject(value)) {
        const reusedExport = exportLookup.get(value);

        if (reusedExport && reusedExport !== key) {
          return reusedExport;
        }
        return next(value);
      }

      if (Symbol.toStringTag in Object(value)) {
        const { [Symbol.toStringTag]: _tag, ...valueWithoutTag } = value;
        return next(valueWithoutTag);
      }

      if (valueType === 'string') {
        return next(
          unusedCompositionRegex
            ? value.replace(unusedCompositionRegex, '')
            : value,
        );
      }

      if (
        valueType === 'function' &&
        (value.__function_serializer__ || value.__recipe__)
      ) {
        const { importPath, importName, args } =
          value.__function_serializer__ || value.__recipe__;

        if (
          typeof importPath !== 'string' ||
          typeof importName !== 'string' ||
          !Array.isArray(args)
        ) {
          throw new Error('Invalid function serialization params');
        }

        try {
          const hashedImportName = `_${hash(`${importName}${importPath}`).slice(
            0,
            5,
          )}`;

          functionSerializationImports.add(
            `import { ${importName} as ${hashedImportName} } from '${importPath}';`,
          );

          return `${hashedImportName}(${args
            .map((arg) =>
              stringifyExports(
                functionSerializationImports,
                arg,
                unusedCompositionRegex,
                key,
                exportLookup,
              ),
            )
            .join(',')})`;
        } catch (err) {
          console.error(err);

          throw new Error('Invalid function serialization params');
        }
      }

      throw new Error(outdent`
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

const defaultExportName = '__default__';

export function serializeVanillaModule(
  cssImports: Array<string>,
  exports: Record<string, unknown>,
  unusedCompositionRegex: RegExp | null,
) {
  const functionSerializationImports = new Set<string>();
  const exportLookup = new Map(
    Object.entries(exports).map(([key, value]) => [
      value,
      key === 'default' ? defaultExportName : key,
    ]),
  );

  const moduleExports = Object.keys(exports).map((key) => {
    const serializedExport = stringifyExports(
      functionSerializationImports,
      exports[key],
      unusedCompositionRegex,
      key === 'default' ? defaultExportName : key,
      exportLookup,
    );

    if (key === 'default') {
      return [
        `var ${defaultExportName} = ${serializedExport};`,
        `export default ${defaultExportName};`,
      ].join('\n');
    }

    return `export var ${key} = ${serializedExport};`;
  });

  const outputCode = [
    ...cssImports,
    ...functionSerializationImports,
    ...moduleExports,
  ];

  return outputCode.join('\n');
}
