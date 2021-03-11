import { dirname, basename } from 'path';
import { types as t, PluginObj, PluginPass, NodePath } from '@babel/core';

const exportConfig = {
  style: {
    maxParams: 2,
  },
  createTheme: {
    maxParams: 3,
  },
};
type RelevantExport = keyof typeof exportConfig;
const relevantExports = Object.keys(exportConfig) as Array<RelevantExport>;

const extractName = (node: t.Node, fileIdentifier: string) => {
  if (t.isObjectProperty(node) && t.isIdentifier(node.key)) {
    return node.key.name;
  } else if (
    (t.isVariableDeclarator(node) || t.isFunctionDeclaration(node)) &&
    t.isIdentifier(node.id)
  ) {
    return node.id.name;
  } else if (t.isExportDefaultDeclaration(node)) {
    return fileIdentifier;
  }
};

const getDebugId = (
  path: NodePath<t.CallExpression>,
  fileIdentifier: string,
) => {
  const { parent } = path;

  if (
    t.isObjectProperty(parent) ||
    t.isReturnStatement(parent) ||
    t.isArrayExpression(parent) ||
    t.isSpreadElement(parent)
  ) {
    const names: Array<string> = [];

    path.findParent(({ node: parentNode }) => {
      const name = extractName(parentNode, fileIdentifier);
      if (name) {
        names.unshift(name);
      }
      // Traverse all the way to the root
      return false;
    });

    return names.join('_');
  } else {
    return extractName(parent, fileIdentifier);
  }
};

const getRelevantCall = (
  node: t.CallExpression,
  namespaceImport: string,
  importIdentifiers: Map<string, RelevantExport>,
) => {
  const { callee } = node;

  if (
    namespaceImport &&
    t.isMemberExpression(callee) &&
    t.isIdentifier(callee.object, { name: namespaceImport })
  ) {
    return relevantExports.find((exportName) =>
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
}
type Context = PluginPass & {
  opts?: PluginOptions;
  fileIdentifier: string;
  namespaceImport: string;
  importIdentifiers: Map<string, RelevantExport>;
};

export default function (): PluginObj<Context> {
  return {
    pre(state) {
      const filename = state.opts.filename || '';
      const shortFilename = basename(filename).split('.')[0];

      this.fileIdentifier =
        shortFilename.indexOf('index') > -1
          ? basename(dirname(filename))
          : shortFilename;

      this.importIdentifiers = new Map();
      this.namespaceImport = '';
      this.packageIdentifier = this.opts?.alias || '@mattsjones/css-core';
    },
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === this.packageIdentifier) {
          path.node.specifiers.forEach((specifier) => {
            if (t.isImportNamespaceSpecifier(specifier)) {
              this.namespaceImport = specifier.local.name;
            } else if (t.isImportSpecifier(specifier)) {
              const { imported, local } = specifier;

              const importName = (t.isIdentifier(imported)
                ? imported.name
                : imported.value) as RelevantExport;

              if (relevantExports.includes(importName)) {
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

        if (usedExport) {
          if (node.arguments.length < exportConfig[usedExport].maxParams) {
            const debugIdent = getDebugId(path, this.fileIdentifier);

            if (debugIdent) {
              node.arguments.push(t.stringLiteral(debugIdent));
            }
          }
        }
      },
    },
  };
}
