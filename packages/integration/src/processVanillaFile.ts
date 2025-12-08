import type { FileScope, Adapter } from '@vanilla-extract/css';
import { transformCss } from '@vanilla-extract/css/transformCss';
import evalCode from 'eval';
import { stringify } from 'javascript-stringify';
import dedent from 'dedent';

import { hash } from './hash';
import { serializeCss } from './serialize';
import type { IdentifierOption } from './types';

const originalNodeEnv = process.env.NODE_ENV;

// Copied from https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore/blob/51f83bd3db728fd7ee177de1ffc253fdb99c537f/README.md#_isplainobject
function isPlainObject(value: unknown) {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype === null) {
    return true;
  }

  const constructor =
    Object.prototype.hasOwnProperty.call(prototype, 'constructor') &&
    prototype.constructor;

  return (
    typeof constructor === 'function' &&
    constructor instanceof constructor &&
    Function.prototype.call(constructor) === Function.prototype.call(value)
  );
}

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
}: ProcessVanillaFileOptions): Promise<string> {
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
  ) as Record<string, unknown>;

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
  exportDependencyGraph: DependencyGraph,
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
          exportDependencyGraph.addDependency(key, reusedExport);
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
                exportDependencyGraph,
              ),
            )
            .join(',')})`;
        } catch (err) {
          console.error(err);

          throw new Error('Invalid function serialization params', {
            cause: err,
          });
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

const defaultExportName = '__default__';

class DependencyGraph {
  graph: Map<string, Set<string>>;

  public constructor() {
    this.graph = new Map();
  }

  /**
   * Creates a "depends on" relationship between `key` and `dependency`
   */
  public addDependency(key: string, dependency: string) {
    const dependencies = this.graph.get(key);

    if (dependencies) {
      dependencies.add(dependency);
    } else {
      this.graph.set(key, new Set([dependency]));
    }
  }

  /**
   * Whether or not `key` depends on `dependency`
   */
  public dependsOn(key: string, dependency: string): boolean {
    const dependencies = this.graph.get(key);

    if (dependencies) {
      if (dependencies?.has(dependency)) {
        return true;
      }

      for (const [dep] of dependencies.entries()) {
        if (this.dependsOn(dep, dependency)) {
          return true;
        }
      }
    }

    return false;
  }
}

export function serializeVanillaModule(
  cssImports: Array<string>,
  exports: Record<string, unknown>,
  unusedCompositionRegex: RegExp | null,
): string {
  const functionSerializationImports = new Set<string>();
  const exportLookup = new Map(
    Object.entries(exports).map(([key, value]) => [
      value,
      key === 'default' ? defaultExportName : key,
    ]),
  );

  const exportDependencyGraph = new DependencyGraph();

  const moduleExports = Object.entries(exports).map(([key, value]) => {
    const serializedExport = stringifyExports(
      functionSerializationImports,
      value,
      unusedCompositionRegex,
      key === 'default' ? defaultExportName : key,
      exportLookup,
      exportDependencyGraph,
    );

    if (key === 'default') {
      return [
        defaultExportName,
        [
          `var ${defaultExportName} = ${serializedExport};`,
          `export default ${defaultExportName};`,
        ].join('\n'),
      ];
    }

    return [key, `export var ${key} = ${serializedExport};`];
  });

  const sortedModuleExports = moduleExports
    .sort(([key1], [key2]) => {
      if (exportDependencyGraph.dependsOn(key1, key2)) {
        return 1;
      }

      if (exportDependencyGraph.dependsOn(key2, key1)) {
        return -1;
      }

      return 0;
    })
    .map(([, s]) => s);

  const outputCode = [
    ...cssImports,
    ...functionSerializationImports,
    ...sortedModuleExports,
  ];

  return outputCode.join('\n');
}
