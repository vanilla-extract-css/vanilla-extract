import { types as t, PluginObj, PluginPass, NodePath } from '@babel/core';

const packageIdentifiers = new Set([
  '@vanilla-extract/css',
  '@vanilla-extract/recipes',
]);

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
  createContainer: {
    maxParams: 1,
  },
  layer: {
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
  'globalLayer',
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
  } else if (t.isAssignmentExpression(node) && t.isIdentifier(node.left)) {
    return node.left.name;
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
};

export default function (): PluginObj<Context> {
  return {
    pre() {
      this.importIdentifiers = new Map();
      this.namespaceImport = '';
    },
    visitor: {
      ImportDeclaration(path) {
        if (packageIdentifiers.has(path.node.source.value)) {
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
