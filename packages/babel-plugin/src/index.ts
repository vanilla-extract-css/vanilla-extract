import { relative, dirname } from 'path';
import { types as t, PluginObj, PluginPass, NodePath } from '@babel/core';
import template from '@babel/template';
import findUp from 'find-up';

const packageIdentifier = '@vanilla-extract/css';
const filescopePackageIdentifier = '@vanilla-extract/css/fileScope';

const buildSetFileScope = template(`
  import { setFileScope, endFileScope } from '${filescopePackageIdentifier}'
  setFileScope(%%filePath%%, %%packageName%%)
`);

const debuggableFunctionConfig = {
  style: {
    maxParams: 2,
  },
  createTheme: {
    maxParams: 3,
  },
  mapToStyles: {
    maxParams: 3,
  },
  fontFace: {
    maxParams: 2,
  },
  keyframes: {
    maxParams: 2,
  },
  createVar: {
    maxParams: 1,
  },
};

const styleFunctions = [
  ...(Object.keys(debuggableFunctionConfig) as Array<
    keyof typeof debuggableFunctionConfig
  >),
  'globalStyle',
  'createGlobalTheme',
  'createThemeVars',
  'globalFontFace',
  'globalKeyframes',
];

type StyleFunction = typeof styleFunctions[number];

const extractName = (node: t.Node) => {
  if (t.isObjectProperty(node) && t.isIdentifier(node.key)) {
    return node.key.name;
  } else if (
    (t.isVariableDeclarator(node) || t.isFunctionDeclaration(node)) &&
    t.isIdentifier(node.id)
  ) {
    return node.id.name;
  } else if (t.isExportDefaultDeclaration(node)) {
    return 'default';
  } else if (
    t.isVariableDeclarator(node) &&
    t.isArrayPattern(node.id) &&
    t.isIdentifier(node.id.elements[0])
  ) {
    return node.id.elements[0].name;
  }
};

const getDebugId = (path: NodePath<t.CallExpression>) => {
  const { parent } = path;

  if (
    t.isObjectProperty(parent) ||
    t.isReturnStatement(parent) ||
    t.isArrowFunctionExpression(parent) ||
    t.isArrayExpression(parent) ||
    t.isSpreadElement(parent)
  ) {
    const names: Array<string> = [];

    path.findParent(({ node: parentNode }) => {
      const name = extractName(parentNode);
      if (name) {
        names.unshift(name);
      }
      // Traverse all the way to the root
      return false;
    });

    return names.join('_');
  } else {
    return extractName(parent);
  }
};

const getRelevantCall = (
  node: t.CallExpression,
  namespaceImport: string,
  importIdentifiers: Map<string, StyleFunction>,
) => {
  const { callee } = node;

  if (
    namespaceImport &&
    t.isMemberExpression(callee) &&
    t.isIdentifier(callee.object, { name: namespaceImport })
  ) {
    return styleFunctions.find((exportName) =>
      t.isIdentifier(callee.property, { name: exportName }),
    );
  } else {
    const importInfo = Array.from(
      importIdentifiers.entries(),
    ).find(([identifier]) => t.isIdentifier(callee, { name: identifier }));

    if (importInfo) {
      return importInfo[1];
    }
  }
};

type Context = PluginPass & {
  namespaceImport: string;
  importIdentifiers: Map<string, StyleFunction>;
  packageIdentifier: string;
  filePath: string;
  packageName: string;
  isCssFile: boolean;
  alreadyCompiled: boolean;
};

export default function (): PluginObj<Context> {
  let packageInfo: { name: string; dirname: string; path: string } | undefined;
  let hasResolvedPackageJson = false;
  function getPackageInfo(cwd?: string | null) {
    if (hasResolvedPackageJson) {
      return packageInfo;
    }

    hasResolvedPackageJson = true;
    const packageJsonPath = findUp.sync('package.json', {
      cwd: cwd || undefined,
    });

    if (packageJsonPath) {
      const { name } = require(packageJsonPath);
      packageInfo = {
        name,
        path: packageJsonPath,
        dirname: dirname(packageJsonPath),
      };
    }
    return packageInfo;
  }

  return {
    pre({ opts }) {
      if (!opts.filename) {
        // TODO Make error better
        throw new Error('Filename must be available');
      }

      this.isCssFile = /\.css\.(js|ts|jsx|tsx)$/.test(opts.filename);
      this.alreadyCompiled = false;

      this.importIdentifiers = new Map();
      this.namespaceImport = '';

      const packageInfo = getPackageInfo(opts.cwd);

      if (!packageInfo) {
        throw new Error(
          `Couldn't find parent package.json for ${opts.filename}`,
        );
      }

      if (!packageInfo.name) {
        throw new Error(
          `Closest package.json (${packageInfo.path}) must specify name`,
        );
      }
      this.packageName = packageInfo.name;
      this.filePath = relative(packageInfo.dirname, opts.filename);
    },
    visitor: {
      Program: {
        exit(path) {
          if (this.isCssFile && !this.alreadyCompiled) {
            // Wrap module with file scope calls
            path.unshiftContainer(
              'body',
              buildSetFileScope({
                filePath: t.stringLiteral(this.filePath),
                packageName: t.stringLiteral(this.packageName),
              }),
            );

            path.pushContainer(
              'body',
              t.callExpression(t.identifier('endFileScope'), []),
            );
          }
        },
      },
      ImportDeclaration(path) {
        if (!this.isCssFile) {
          // Bail early if file isn't a .css.ts file
          return path.stop();
        }

        if (path.node.source.value === filescopePackageIdentifier) {
          // If file scope import is found it means the file has already been compiled
          this.alreadyCompiled = true;
          return path.stop();
        } else if (path.node.source.value === packageIdentifier) {
          path.node.specifiers.forEach((specifier) => {
            if (t.isImportNamespaceSpecifier(specifier)) {
              this.namespaceImport = specifier.local.name;
            } else if (t.isImportSpecifier(specifier)) {
              const { imported, local } = specifier;

              const importName = (t.isIdentifier(imported)
                ? imported.name
                : imported.value) as StyleFunction;

              if (styleFunctions.includes(importName)) {
                this.importIdentifiers.set(local.name, importName);
              }
            }
          });
        }
      },
      CallExpression(path) {
        if (!this.isCssFile || this.alreadyCompiled) {
          // Bail early if file isn't a .css.ts file or the file has already been compiled
          return path.stop();
        }

        const { node } = path;

        const usedExport = getRelevantCall(
          node,
          this.namespaceImport,
          this.importIdentifiers,
        );

        if (usedExport && usedExport in debuggableFunctionConfig) {
          if (
            node.arguments.length <
            debuggableFunctionConfig[
              usedExport as keyof typeof debuggableFunctionConfig
            ].maxParams
          ) {
            const debugIdent = getDebugId(path);

            if (debugIdent) {
              node.arguments.push(t.stringLiteral(debugIdent));
            }
          }
        }
      },
    },
  };
}
