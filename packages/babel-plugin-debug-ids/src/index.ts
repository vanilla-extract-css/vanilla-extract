import { types as t, PluginObj, PluginPass, NodePath } from '@babel/core';

const packageIdentifiers = new Set([
  '@vanilla-extract/css',
  '@vanilla-extract/recipes',
]);

type DebugConfig = {
  maxParams: number;
  hasDebugId?: (node: t.CallExpression) => boolean;
};

const debuggableFunctionConfig = {
  style: {
    maxParams: 2,
  },
  createTheme: {
    maxParams: 3,
  },
  styleVariants: {
    maxParams: 3,
    hasDebugId: ({ arguments: args }) => {
      const previousArg = args[args.length - 1];
      return t.isStringLiteral(previousArg) || t.isTemplateLiteral(previousArg);
    },
  },
  fontFace: {
    maxParams: 2,
  },
  keyframes: {
    maxParams: 2,
  },
  createVar: {
    maxParams: 2,
    hasDebugId: ({ arguments: args }) => {
      const previousArg = args[args.length - 1];
      return t.isStringLiteral(previousArg) || t.isTemplateLiteral(previousArg);
    },
  },
  recipe: {
    maxParams: 2,
  },
  createContainer: {
    maxParams: 1,
  },
  layer: {
    maxParams: 2,
    hasDebugId: ({ arguments: args }) => {
      const previousArg = args[args.length - 1];
      return t.isStringLiteral(previousArg) || t.isTemplateLiteral(previousArg);
    },
  },
} satisfies Record<string, DebugConfig>;

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
] as const;

type StyleFunction = (typeof styleFunctions)[number];

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

  // Special case 1: Handle `export const [themeClass, vars] = createTheme({});`
  // when it's already been compiled into one of the following forms:
  //
  // var _createTheme = createTheme({}),
  //   _createTheme2 = _slicedToArray(_createTheme, 2),
  //   themeClass = _createTheme2[0],
  //   vars = _createTheme2[1];
  if (t.isVariableDeclaration(firstRelevantParentPath.parent)) {
    if (firstRelevantParentPath.parent.declarations.length === 4) {
      const [themeDeclarator, , classNameDeclarator] =
        firstRelevantParentPath.parent.declarations;

      if (
        t.isCallExpression(themeDeclarator.init) &&
        t.isIdentifier(themeDeclarator.init.callee, { name: 'createTheme' }) &&
        t.isIdentifier(classNameDeclarator.id)
      ) {
        return classNameDeclarator.id.name;
      }
    }
    // alternative compiled form:
    //
    // var ref = _slicedToArray(createTheme({}), 2);
    // export var themeClass = ref[0],
    //   vars = ref[1];
    else if (firstRelevantParentPath.parent.declarations.length === 1) {
      const [themeDeclarator] = firstRelevantParentPath.parent.declarations;
      const nextSibling =
        firstRelevantParentPath.parentPath?.getNextSibling().node;

      if (
        t.isCallExpression(themeDeclarator.init) &&
        t.isCallExpression(themeDeclarator.init.arguments[0]) &&
        t.isIdentifier(themeDeclarator.init.arguments[0].callee, {
          name: 'createTheme',
        }) &&
        t.isExportNamedDeclaration(nextSibling) &&
        t.isVariableDeclaration(nextSibling.declaration) &&
        t.isVariableDeclarator(nextSibling.declaration.declarations[0]) &&
        t.isIdentifier(nextSibling.declaration.declarations[0].id)
      ) {
        return nextSibling.declaration.declarations[0].id.name;
      }
    }
    // Special case 2: Handle `const [themeClass, vars] = createTheme({});
    //                        export { themeClass, vars };`
    // when compiled into the following:
    //
    // var ref = _slicedToArray(createTheme({}), 2),
    //   myThemeClass = ref[0],
    //   vars = ref[1];
    // export { themeClass, vars };
    else if (firstRelevantParentPath.parent.declarations.length === 3) {
      const [themeDeclarator, classNameDeclarator] =
        firstRelevantParentPath.parent.declarations;

      if (
        t.isCallExpression(themeDeclarator.init) &&
        t.isCallExpression(themeDeclarator.init.arguments[0]) &&
        t.isIdentifier(themeDeclarator.init.arguments[0].callee, {
          name: 'createTheme',
        }) &&
        t.isIdentifier(classNameDeclarator.id)
      ) {
        return classNameDeclarator.id.name;
      }
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
          const { maxParams, hasDebugId } = (
            debuggableFunctionConfig as Record<string, DebugConfig>
          )[usedExport];

          if (node.arguments.length < maxParams && !hasDebugId?.(node)) {
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
