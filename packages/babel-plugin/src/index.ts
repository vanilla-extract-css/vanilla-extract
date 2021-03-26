import { relative } from 'path';
import { types as t, PluginObj, PluginPass, NodePath } from '@babel/core';
import template from '@babel/template';

const buildSetFileScope = template(`
  import { setFileScope, endFileScope } from %%packageIdentifier%%
  setFileScope(%%fileScope%%)
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

interface PluginOptions {
  alias?: string;
  projectRoot?: string;
}
type Context = PluginPass & {
  opts?: PluginOptions;
  namespaceImport: string;
  importIdentifiers: Map<string, StyleFunction>;
  packageIdentifier: string;
  fileScope: string;
};

export default function (): PluginObj<Context> {
  return {
    pre({ opts }) {
      this.importIdentifiers = new Map();
      this.namespaceImport = '';
      this.packageIdentifier = this.opts?.alias || '@vanilla-extract/css';
      const projectRoot = this.opts?.projectRoot || opts.root;
      if (!projectRoot) {
        // TODO Make error better
        throw new Error('Project root must be specified');
      }

      if (!opts.filename) {
        // TODO Make error better
        throw new Error('Filename must be available');
      }

      this.fileScope = relative(projectRoot, opts.filename);
    },
    visitor: {
      Program: {
        exit(path) {
          if (this.importIdentifiers.size > 0 || this.namespaceImport) {
            // Wrap module with file scope calls
            path.unshiftContainer(
              'body',
              buildSetFileScope({
                packageIdentifier: t.stringLiteral(
                  `${this.packageIdentifier}/fileScope`,
                ),
                fileScope: t.stringLiteral(this.fileScope),
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
        if (path.node.source.value === this.packageIdentifier) {
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
