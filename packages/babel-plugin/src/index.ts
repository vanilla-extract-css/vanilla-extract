import { relative, posix, sep } from 'path';
import { types as t, PluginObj, PluginPass, NodePath } from '@babel/core';
import template from '@babel/template';
import { cssFileFilter, getPackageInfo } from '@vanilla-extract/integration';

const packageIdentifiers = new Set([
  '@vanilla-extract/css',
  '@vanilla-extract/recipes',
]);
const filescopePackageIdentifier = '@vanilla-extract/css/fileScope';

const buildSetFileScopeESM = template(`
  import * as __vanilla_filescope__ from '${filescopePackageIdentifier}'
  __vanilla_filescope__.setFileScope(%%filePath%%, %%packageName%%)
`);

const buildSetFileScopeCJS = template(`
  const __vanilla_filescope__ = require('${filescopePackageIdentifier}');
  __vanilla_filescope__.setFileScope(%%filePath%%, %%packageName%%)
`);

const buildEndFileScope = template(`__vanilla_filescope__.endFileScope()`);

const debuggableFunctionConfig = {
  style: {
    maxParams: 2,
  },
  createTheme: {
    maxParams: 3,
  },
  styleVariants: {
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
  recipe: {
    maxParams: 2,
  },
};

const styleFunctions = [
  ...(Object.keys(debuggableFunctionConfig) as Array<
    keyof typeof debuggableFunctionConfig
  >),
  'globalStyle',
  'createGlobalTheme',
  'createThemeContract',
  'globalFontFace',
  'globalKeyframes',
  'recipe',
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
  const firstRelevantParentPath = path.findParent(
    ({ node }) => !(t.isCallExpression(node) || t.isSequenceExpression(node)),
  );

  if (!firstRelevantParentPath) {
    return;
  }

  // Special case: Handle `export const [themeClass, vars] = createTheme({});`
  // when it's already been compiled into this:
  //
  // var _createTheme = createTheme({}),
  //   _createTheme2 = _slicedToArray(_createTheme, 2),
  //   themeClass = _createTheme2[0],
  //   vars = _createTheme2[1];
  if (
    t.isVariableDeclaration(firstRelevantParentPath.parent) &&
    firstRelevantParentPath.parent.declarations.length === 4
  ) {
    const [themeDeclarator, , classNameDeclarator] =
      firstRelevantParentPath.parent.declarations;

    if (
      t.isCallExpression(themeDeclarator.init) &&
      t.isIdentifier(themeDeclarator.init.callee, { name: 'createTheme' }) &&
      t.isVariableDeclarator(classNameDeclarator) &&
      t.isIdentifier(classNameDeclarator.id)
    ) {
      return classNameDeclarator.id.name;
    }
  }

  const relevantParent = firstRelevantParentPath.node;

  if (
    t.isObjectProperty(relevantParent) ||
    t.isReturnStatement(relevantParent) ||
    t.isArrowFunctionExpression(relevantParent) ||
    t.isArrayExpression(relevantParent) ||
    t.isSpreadElement(relevantParent)
  ) {
    const names: Array<string> = [];

    path.findParent(({ node }) => {
      const name = extractName(node);
      if (name) {
        names.unshift(name);
      }
      // Traverse all the way to the root
      return false;
    });

    return names.join('_');
  } else {
    return extractName(relevantParent);
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
    const importInfo = Array.from(importIdentifiers.entries()).find(
      ([identifier]) => t.isIdentifier(callee, { name: identifier }),
    );

    if (importInfo) {
      return importInfo[1];
    }
  }
};

type Context = PluginPass & {
  namespaceImport: string;
  importIdentifiers: Map<string, StyleFunction>;
  packageIdentifiers: Set<string>;
  filePath: string;
  packageName: string;
  isCssFile: boolean;
  alreadyCompiled: boolean;
  isESM: boolean;
};

export default function (): PluginObj<Context> {
  return {
    pre({ opts }) {
      if (!opts.filename) {
        // TODO Make error better
        throw new Error('Filename must be available');
      }

      this.isESM = false;
      this.isCssFile = cssFileFilter.test(opts.filename);
      this.alreadyCompiled = false;

      this.importIdentifiers = new Map();
      this.namespaceImport = '';

      const packageInfo = getPackageInfo(opts.cwd);

      if (!packageInfo.name) {
        throw new Error(
          `Closest package.json (${packageInfo.path}) must specify name`,
        );
      }
      this.packageName = packageInfo.name;
      // Encode windows file paths as posix
      this.filePath = posix.join(
        ...relative(packageInfo.dirname, opts.filename).split(sep),
      );
    },
    visitor: {
      Program: {
        exit(path) {
          if (this.isCssFile && !this.alreadyCompiled) {
            // Wrap module with file scope calls
            const buildSetFileScope = this.isESM
              ? buildSetFileScopeESM
              : buildSetFileScopeCJS;
            path.unshiftContainer(
              'body',
              buildSetFileScope({
                filePath: t.stringLiteral(this.filePath),
                packageName: t.stringLiteral(this.packageName),
              }),
            );

            path.pushContainer('body', buildEndFileScope());
          }
        },
      },
      ImportDeclaration(path) {
        this.isESM = true;
        if (!this.isCssFile || this.alreadyCompiled) {
          // Bail early if file isn't a .css.ts file or the file has already been compiled
          return;
        }

        if (path.node.source.value === filescopePackageIdentifier) {
          // If file scope import is found it means the file has already been compiled
          this.alreadyCompiled = true;
          return;
        } else if (packageIdentifiers.has(path.node.source.value)) {
          path.node.specifiers.forEach((specifier) => {
            if (t.isImportNamespaceSpecifier(specifier)) {
              this.namespaceImport = specifier.local.name;
            } else if (t.isImportSpecifier(specifier)) {
              const { imported, local } = specifier;

              const importName = (
                t.isIdentifier(imported) ? imported.name : imported.value
              ) as StyleFunction;

              if (styleFunctions.includes(importName)) {
                this.importIdentifiers.set(local.name, importName);
              }
            }
          });
        }
      },
      ExportDeclaration() {
        this.isESM = true;
      },
      CallExpression(path) {
        if (!this.isCssFile || this.alreadyCompiled) {
          // Bail early if file isn't a .css.ts file or the file has already been compiled
          return;
        }

        const { node } = path;

        if (
          t.isIdentifier(node.callee, { name: 'require' }) &&
          t.isStringLiteral(node.arguments[0], {
            value: filescopePackageIdentifier,
          })
        ) {
          // If file scope import is found it means the file has already been compiled
          this.alreadyCompiled = true;
          return;
        }

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
