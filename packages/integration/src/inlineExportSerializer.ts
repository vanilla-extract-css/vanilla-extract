import { outdent } from 'outdent';
import { hash } from './hash';
import { stringify } from 'javascript-stringify';
import isPlainObject from 'lodash/isPlainObject';

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
  runtimeCode: string,
) {
  const functionSerializationImports = new Set<string>();
  const relevantExports = Object.entries(exports).filter(([identifier]) =>
    identifier.startsWith('_vanilla_'),
  );
  const exportLookup = new Map(
    relevantExports.map(([key, value]) => [value, key]),
  );

  const exportDependencyGraph = new DependencyGraph();

  const moduleExports = relevantExports.map(([key, value]) => {
    const serializedExport = stringifyExports(
      functionSerializationImports,
      value,
      unusedCompositionRegex,
      key,
      exportLookup,
      exportDependencyGraph,
    );

    return [key, `var ${key} = ${serializedExport};`];
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
    runtimeCode,
  ];

  return outputCode.join('\n');
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
