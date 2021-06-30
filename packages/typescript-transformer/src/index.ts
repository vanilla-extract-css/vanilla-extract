import * as ts from 'typescript';
import { dirname } from 'path';
import { getPackageInfo } from '@vanilla-extract/integration';

const packageIdentifier = '@vanilla-extract/css';
const fileScopePackageIdentifier = '@vanilla-extract/css/fileScope';
const fileScopeLocalIdentifier = '__vanilla_filescope__';

const factory = ts.factory;

const buildSetFileScopeESMStatements = (
  filePath: string,
  packageName: string,
): ts.Statement[] => [
  factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamespaceImport(
        factory.createIdentifier(fileScopeLocalIdentifier),
      ),
    ),
    factory.createStringLiteral(fileScopePackageIdentifier),
  ),
  factory.createExpressionStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier(fileScopeLocalIdentifier),
        factory.createIdentifier('setFileScope'),
      ),
      undefined,
      [
        factory.createStringLiteral(filePath),
        factory.createStringLiteral(packageName),
      ],
    ),
  ),
];

const endFileScope = factory.createExpressionStatement(
  factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier(fileScopeLocalIdentifier),
      factory.createIdentifier('endFileScope'),
    ),
    undefined,
    [],
  ),
);

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
};

const extractName = (node: ts.Node) => {
  if (
    (ts.isPropertyDeclaration(node) || ts.isPropertyAssignment(node)) &&
    ts.isIdentifier(node.name)
  ) {
    return node.name.text;
  } else if (
    (ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) &&
    node.name &&
    ts.isIdentifier(node.name)
  ) {
    return node.name.text;
  } else if (
    ts.isExportAssignment(node) &&
    node.getChildren().find((c) => c.kind === ts.SyntaxKind.DefaultKeyword)
  ) {
    // export default ...
    return 'default';
  } else if (
    ts.isVariableDeclaration(node) &&
    ts.isArrayBindingPattern(node.name) &&
    node.name.elements.length &&
    ts.isBindingElement(node.name.elements[0]) &&
    ts.isIdentifier(node.name.elements[0].name)
  ) {
    // const [name] = ...
    return node.name.elements[0].name.text;
  }
};

const getDebugId = (path: ts.Node) => {
  const { parent } = path;

  if (
    ts.isPropertyDeclaration(parent) ||
    ts.isPropertyAssignment(parent) ||
    ts.isReturnStatement(parent) ||
    ts.isArrowFunction(parent) ||
    ts.isArrayLiteralExpression(parent) ||
    ts.isSpreadElement(parent)
  ) {
    const names: Array<string> = [];

    let currentParent = path;
    while (currentParent) {
      const name = extractName(currentParent);
      if (name) {
        names.unshift(name);
      }
      currentParent = currentParent.parent;
    }
    return names.join('_');
  } else {
    return extractName(parent);
  }
};

const transformer = (
  context: ts.TransformationContext & { cwd?: string },
): ts.Transformer<ts.SourceFile> => {
  const { cwd } = context;
  return (sourceFile) => {
    const isCssFile = /\.css\.(js|ts|jsx|tsx)$/.test(sourceFile.fileName);
    if (!isCssFile) {
      // skip non .css. vanilla files
      return sourceFile;
    }

    for (const statement of sourceFile.statements) {
      if (
        ts.isImportDeclaration(statement) &&
        ts.isStringLiteral(statement.moduleSpecifier) &&
        statement.moduleSpecifier.text === fileScopePackageIdentifier
      ) {
        // already transformed
        return sourceFile;
      }
    }

    const packageInfo = getPackageInfo(cwd ?? dirname(sourceFile.fileName));
    if (!packageInfo.name) {
      throw new Error(
        `Closest package.json (${packageInfo.path}) must specify name`,
      );
    }

    const vanillaNamespaceImports = new Set<string>();
    const vanillaNamedImports = new Set<string>();
    const vanillaAliasedImports = new Map<string, string>();

    // gather up the imported vanilla-extract functions, including if there's a namespace import of the package
    for (let statement of sourceFile.statements) {
      if (ts.isImportDeclaration(statement)) {
        const { moduleSpecifier } = statement;
        if (
          ts.isStringLiteral(moduleSpecifier) &&
          moduleSpecifier.text === packageIdentifier
        ) {
          const namedBindings = statement.importClause?.namedBindings;
          if (namedBindings) {
            if (ts.isNamedImports(namedBindings)) {
              // import {style} from ...
              for (const namedImport of namedBindings.elements) {
                if (namedImport.propertyName) {
                  // import {propertyName as name} from ...
                  const importedFunctionName = namedImport.propertyName.text;
                  vanillaAliasedImports.set(
                    namedImport.name.text,
                    importedFunctionName,
                  );
                  vanillaNamedImports.add(importedFunctionName);
                } else {
                  vanillaNamedImports.add(namedImport.name.text);
                }
              }
            } else if (ts.isNamespaceImport(namedBindings)) {
              // import * as css from ...
              vanillaNamespaceImports.add(namedBindings.name.text);
              // meaning we should consider all functions with debug idents as targets for transformation
              for (const functionNameWithDebugIdent of Object.keys(
                debuggableFunctionConfig,
              )) {
                vanillaNamedImports.add(functionNameWithDebugIdent);
              }
            }
          }
        }
      }
    }

    // Adds the debug ident for any calls to the vanilla api where the user hasn't specified on already
    const updateCallExpressionWithDebugIdent = (
      node: ts.CallExpression,
      functionIdentifier: ts.Identifier,
    ): ts.CallExpression | undefined => {
      const functionName = functionIdentifier.text;
      const importedName =
        vanillaAliasedImports.get(functionName) ?? functionName;
      if (vanillaNamedImports.has(importedName)) {
        if (importedName in debuggableFunctionConfig) {
          if (
            node.arguments.length <
            debuggableFunctionConfig[
              importedName as keyof typeof debuggableFunctionConfig
            ].maxParams
          ) {
            const debugIdent = getDebugId(node);
            if (debugIdent) {
              const { typeArguments } = node;
              return ts.factory.updateCallExpression(
                node,
                node.expression,
                typeArguments,
                [...node.arguments, factory.createStringLiteral(debugIdent)],
              );
            }
          }
        }
      }
    };

    // recursively visits the specified node, updating call expressions as needed
    const addDebugIdentVisitor = (node: ts.Node): ts.Node => {
      if (ts.isCallExpression(node)) {
        const { expression } = node;
        if (ts.isIdentifier(expression)) {
          const updatedCallExpression = updateCallExpressionWithDebugIdent(
            node,
            expression,
          );
          if (updatedCallExpression) {
            return updatedCallExpression;
          }
        } else if (ts.isPropertyAccessExpression(expression)) {
          // check for namespace use
          if (
            ts.isIdentifier(expression.expression) &&
            vanillaNamespaceImports.has(expression.expression.text)
          ) {
            // first part of the property access is the imported vanilla.extract, e.g. `css.`
            if (ts.isIdentifier(expression.name)) {
              // and an identifier follows as the property being accessed, e.g `css.style`
              const updatedCallExpression = updateCallExpressionWithDebugIdent(
                node,
                expression.name,
              );
              if (updatedCallExpression) {
                return updatedCallExpression;
              }
            }
          }
        }
      }
      return ts.visitEachChild(
        node,
        addDebugIdentVisitor,
        context as ts.TransformationContext,
      );
    };

    const statementsWithDebugIdent = sourceFile.statements.map((statement) =>
      ts.visitNode(statement, addDebugIdentVisitor),
    );

    return context.factory.updateSourceFile(sourceFile, [
      ...buildSetFileScopeESMStatements(sourceFile.fileName, packageInfo.name),
      ...statementsWithDebugIdent,
      endFileScope,
    ]);
  };
};

export default transformer;
