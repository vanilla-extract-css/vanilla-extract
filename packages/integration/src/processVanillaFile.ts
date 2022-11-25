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

export interface ProcessVanillaFileOptions {
  source: string;
  filePath: string;
  outputCss?: boolean;
  identOption?: IdentifierOption;
  serializeVirtualCssPath?: (file: {
    fileName: string;
    fileScope: FileScope;
    source: string;
  }) => string | Promise<string>;
  onContextFilled?: (
    context: AdapterContext,
    evalResult: Record<string, unknown>,
  ) => void;
  serializeVanillaModule?: (
    cssImports: Array<string>,
    exports: Record<string, unknown>,
    context: AdapterContext,
  ) => string;
}

export interface AdapterContext {
  cssByFileScope: Map<string, Css[]>;
  localClassNames: Set<string>;
  composedClassLists: Composition[];
  usedCompositions: Set<string>;
}

type Css = Parameters<Adapter['appendCss']>[0];
type Composition = Parameters<Adapter['registerComposition']>[0];

export async function processVanillaFile({
  source,
  filePath,
  outputCss = true,
  identOption = process.env.NODE_ENV === 'production' ? 'short' : 'debug',
  serializeVirtualCssPath,
  serializeVanillaModule,
  onContextFilled,
}: ProcessVanillaFileOptions) {
  const context: AdapterContext = {
    cssByFileScope: new Map<string, Array<Css>>(),
    localClassNames: new Set<string>(),
    composedClassLists: [],
    usedCompositions: new Set<string>(),
  };

  const cssAdapter: Adapter = {
    appendCss: (css, fileScope) => {
      if (outputCss) {
        const serialisedFileScope = stringifyFileScope(fileScope);
        const fileScopeCss =
          context.cssByFileScope.get(serialisedFileScope) ?? [];

        fileScopeCss.push(css);

        context.cssByFileScope.set(serialisedFileScope, fileScopeCss);
      }
    },
    registerClassName: (className) => {
      context.localClassNames.add(className);
    },
    registerComposition: (composedClassList) => {
      context.composedClassLists.push(composedClassList);
    },
    markCompositionUsed: (identifier) => {
      context.usedCompositions.add(identifier);
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
  onContextFilled?.(context, evalResult);

  process.env.NODE_ENV = currentNodeEnv;

  const cssImports = [];

  for (const [serialisedFileScope, fileScopeCss] of context.cssByFileScope) {
    const fileScope = parseFileScope(serialisedFileScope);
    const css = transformCss({
      localClassNames: Array.from(context.localClassNames),
      composedClassLists: context.composedClassLists,
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

  return (serializeVanillaModule ?? defaultSerializeVanillaModule)(
    cssImports,
    evalResult,
    context,
  );
}

export function stringifyExports(
  recipeImports: Set<string>,
  value: any,
  unusedCompositionRegex: RegExp | null,
): any {
  return stringify(
    value,
    (value, _indent, next) => {
      const valueType = typeof value;

      if (
        valueType === 'boolean' ||
        valueType === 'number' ||
        valueType === 'undefined' ||
        value === null ||
        Array.isArray(value) ||
        isPlainObject(value)
      ) {
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
            .map((arg) =>
              stringifyExports(recipeImports, arg, unusedCompositionRegex),
            )
            .join(',')})`;
        } catch (err) {
          console.error(err);

          throw new Error('Invalid recipe.');
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

function defaultSerializeVanillaModule(
  cssImports: Array<string>,
  exports: Record<string, unknown>,
  context: AdapterContext,
) {
  const unusedCompositions = context.composedClassLists
    .filter(({ identifier }) => !context.usedCompositions.has(identifier))
    .map(({ identifier }) => identifier);

  const unusedCompositionRegex =
    unusedCompositions.length > 0
      ? RegExp(`(${unusedCompositions.join('|')})\\s`, 'g')
      : null;

  const recipeImports = new Set<string>();

  const moduleExports = Object.keys(exports).map((key) =>
    key === 'default'
      ? `export default ${stringifyExports(
          recipeImports,
          exports[key],
          unusedCompositionRegex,
        )};`
      : `export var ${key} = ${stringifyExports(
          recipeImports,
          exports[key],
          unusedCompositionRegex,
        )};`,
  );

  const outputCode = [...cssImports, ...recipeImports, ...moduleExports];

  return outputCode.join('\n');
}
