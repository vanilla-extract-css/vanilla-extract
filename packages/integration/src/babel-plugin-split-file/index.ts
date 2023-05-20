import type { PluginObj, PluginPass } from '@babel/core';
import { types as t } from '@babel/core';
import type { NodePath, Visitor } from '@babel/traverse';
import invariant from 'assert';
import { DefaultMap } from './DefaultMap';
import { DependencyGraph } from './DependencyGraph';

function hasIntersection<T>(a: Set<T>, b: Set<T>) {
  for (const value of a) {
    if (b.has(value)) {
      return true;
    }
  }

  return false;
}

type IdentifierName = string;
type StatementIndex = number;

export interface Store {
  buildTimeStatements: Array<t.Statement>;
}

interface PluginOptions {
  store: Store;
  macros: Array<string>;
  /** Whether or not the file being transformed ends with `.css.ts/js/etc.` */
  isCssFile: boolean;
}

interface Context extends PluginPass {
  /** Identifiers available at the module scope (imported or declared) */
  moduleScopeIdentifiers: Set<IdentifierName>;
  /** Indices of statements that call vanilla global vanilla APIs at the module scope*/
  globalVanillaApiStatements: Set<StatementIndex>;
  /** Which statements own which module scope identifiers */
  identifierOwners: DefaultMap<StatementIndex, Set<IdentifierName>>;
  /** Identifier dependency graph */
  depGraph: DependencyGraph;
  /** Names of function identifiers that can be evaluated at buildtime */
  vanillaMacros: string[];
  /** Map of statement indices to the paths of any macro function calls they own */
  macroOwners: DefaultMap<StatementIndex, Set<NodePath<t.CallExpression>>>;
  /** Map of module scope identifier names in the original file to their generated identifier name used at buildtime */
  vanillaIdentifierMap: Map<string, string>;
  /** Statements that export anything */
  exportStatements: Set<StatementIndex>;
  /** Which statements modify which module scope identifiers */
  identifierMutators: DefaultMap<StatementIndex, Set<IdentifierName>>;
  importedIdentifiers: Set<IdentifierName>;
  importedIdentifiersUsedAtRuntime: Set<IdentifierName>;
  importedIdentifiersUsedAtBuildtime: Set<IdentifierName>;
  opts: PluginOptions;
}

const identifierVisitor: Visitor<
  {
    addUsedIdentifier: (ident: IdentifierName) => void;
    statementIndex: number;
    insideMacroCall: boolean;
  } & Pick<
    Context,
    | 'vanillaMacros'
    | 'macroOwners'
    | 'identifierMutators'
    | 'moduleScopeIdentifiers'
    | 'exportStatements'
    | 'importedIdentifiers'
    | 'importedIdentifiersUsedAtBuildtime'
    | 'importedIdentifiersUsedAtRuntime'
  >
> = {
  Identifier(path) {
    if (t.isMemberExpression(path.parent, { property: path.node })) {
      // This is a property of an object so we don't want to check it against the outer scope
      return;
    }
    if (t.isObjectProperty(path.parent, { key: path.node })) {
      // This is a property of an object so we don't want to check it against the outer scope
      return;
    }

    const identifierName = path.node.name;
    this.addUsedIdentifier(identifierName);

    if (this.insideMacroCall) {
      if (this.importedIdentifiers.has(identifierName)) {
        this.importedIdentifiersUsedAtBuildtime.add(identifierName);
      }
    } else {
      if (this.exportStatements.has(this.statementIndex)) {
        this.importedIdentifiersUsedAtRuntime.add(identifierName);
      }
    }
  },
  JSXIdentifier(path) {
    if (t.isJSXMemberExpression(path.parent, { property: path.node })) {
      // This is a property of an object so we don't want to check it against the outer scope
      return;
    }

    const identifierName = path.node.name;
    this.addUsedIdentifier(identifierName);

    if (this.insideMacroCall) {
      if (this.importedIdentifiers.has(identifierName)) {
        this.importedIdentifiersUsedAtBuildtime.add(identifierName);
      }
    } else {
      if (this.exportStatements.has(this.statementIndex)) {
        this.importedIdentifiersUsedAtRuntime.add(identifierName);
      }
    }
  },
  CallExpression: {
    enter(path) {
      if (isVanillaMacroFunctionCall(path, this.vanillaMacros)) {
        this.macroOwners.get(this.statementIndex).add(path);
        this.insideMacroCall = true;
      }
    },
    exit(path) {
      if (isVanillaMacroFunctionCall(path, this.vanillaMacros)) {
        this.insideMacroCall = false;
      }
    },
  },
  AssignmentExpression(path) {
    const left = path.node.left;

    if (t.isIdentifier(left) && this.moduleScopeIdentifiers.has(left.name)) {
      this.identifierMutators.get(this.statementIndex).add(left.name);
    }
  },
  UpdateExpression(path) {
    const arg = path.node.argument;

    if (t.isIdentifier(arg) && this.moduleScopeIdentifiers.has(arg.name)) {
      this.identifierMutators.get(this.statementIndex).add(arg.name);
    }
  },
};

const isVanillaMacroFunctionCall = (
  path: NodePath<t.CallExpression>,
  vanillaMacros: string[],
): path is NodePath<t.CallExpression> =>
  t.isIdentifier(path.node.callee) &&
  vanillaMacros.includes(path.node.callee.name);

const vanillaDefaultIdentifier = '_vanilla_defaultIdentifer';

const vanillaExtractMacroIdentifier = t.identifier('css$');

const globalApis = [
  'createGlobalTheme',
  'globalFontFace',
  'globalKeyframes',
  'globalLayer',
  'globalStyle',
];

export default function (): PluginObj<Context> {
  return {
    pre() {
      this.moduleScopeIdentifiers = new Set();
      this.identifierOwners = new DefaultMap(() => new Set());
      this.globalVanillaApiStatements = new Set();
      this.depGraph = new DependencyGraph();
      this.macroOwners = new DefaultMap(() => new Set());
      this.vanillaIdentifierMap = new Map();
      this.exportStatements = new Set();
      this.identifierMutators = new DefaultMap(() => new Set());
      this.importedIdentifiers = new Set();
      this.importedIdentifiersUsedAtRuntime = new Set();
      this.importedIdentifiersUsedAtBuildtime = new Set();
      this.vanillaMacros = [];
    },
    visitor: {
      Program: {
        enter(path, state) {
          const bodyPath = path.get('body');
          const { macros, isCssFile } = state.opts;

          invariant(macros.length > 0, 'Must define at least one macro');

          this.vanillaMacros = macros;

          if (isCssFile) {
            // Make the transform think we imported the extract macro
            this.moduleScopeIdentifiers.add(vanillaExtractMacroIdentifier.name);
          }

          let identifierCount = 0;
          const createVanillaIdentifierName = () =>
            `_vanilla_identifier_${identifierCount++}`;

          const registerNewVanillaIdentifier = (
            identifierName: string,
            statementIndex: number,
          ) => {
            const vanillaIdentifierName = createVanillaIdentifierName();

            this.vanillaIdentifierMap.set(
              identifierName,
              vanillaIdentifierName,
            );
            this.moduleScopeIdentifiers.add(identifierName);
            this.identifierOwners.get(statementIndex).add(identifierName);
          };

          const createAddUsedIdentifier =
            (declaredIdentifiers: Set<string>) => (ident: string) => {
              if (this.moduleScopeIdentifiers.has(ident)) {
                for (const declaredIdent of declaredIdentifiers) {
                  // In order to correctly extract macros at the top level of a declarator, we
                  // need to traverse the declarator path, not the declarator's init path.
                  // Doing this results in traversing the declarator identifier, so to prevent a
                  // self-referential dependency, we explicitly check for it
                  if (!declaredIdentifiers.has(ident)) {
                    this.depGraph.addDependency(declaredIdent, ident);
                  }
                }
              }
            };

          const handleVariableDeclarator = (
            declaratorPath: NodePath<t.VariableDeclarator>,
            statementIndex: number,
          ) => {
            const declaratorId = declaratorPath.node.id;

            if (t.isIdentifier(declaratorId)) {
              const identifierName = declaratorId.name;
              registerNewVanillaIdentifier(identifierName, statementIndex);
            } else if (t.isArrayPattern(declaratorId)) {
              for (const element of declaratorId.elements) {
                invariant(
                  t.isIdentifier(element),
                  'Array pattern elements must be identifiers',
                );
                registerNewVanillaIdentifier(element.name, statementIndex);
              }
            } else {
              throw new Error(
                `[TODO] Handle other types of top-level declarations, statementIndex: ${statementIndex}, type: ${declaratorPath.node.id.type}`,
              );
            }
          };

          for (const statementIndex of bodyPath.keys()) {
            const statement = bodyPath[statementIndex];

            const partialVisitorOpts = {
              moduleScopeIdentifiers: this.moduleScopeIdentifiers,
              vanillaMacros: this.vanillaMacros,
              macroOwners: this.macroOwners,
              statementIndex,
              vanillaIdentifierMap: this.vanillaIdentifierMap,
              identifierMutators: this.identifierMutators,
              insideMacroCall: false,
              exportStatements: this.exportStatements,
              importedIdentifiers: this.importedIdentifiers,
              importedIdentifiersUsedAtBuildtime:
                this.importedIdentifiersUsedAtBuildtime,
              importedIdentifiersUsedAtRuntime:
                this.importedIdentifiersUsedAtRuntime,
            };

            if (t.isImportDeclaration(statement.node)) {
              const locals = statement.node.specifiers.map(
                (specifier) => specifier.local.name,
              );

              for (const local of locals) {
                this.moduleScopeIdentifiers.add(local);
                this.identifierOwners.get(statementIndex).add(local);
                this.importedIdentifiers.add(local);
              }

              // No need to traverse import declarations
              continue;
            } else if (statement.isVariableDeclaration()) {
              for (const declarationIndex of statement.node.declarations.keys()) {
                const declaratorPath =
                  statement.get('declarations')[declarationIndex];
                handleVariableDeclarator(declaratorPath, statementIndex);
              }
            } else if (statement.isExportNamedDeclaration()) {
              this.exportStatements.add(statementIndex);

              const specifiers = statement.get('specifiers');
              const isExportList =
                specifiers.length > 0 && !statement.get('source').node;

              if (isExportList) {
                if (isCssFile) {
                  for (const specifierIndex of specifiers.keys()) {
                    const specifier = specifiers[specifierIndex];
                    invariant(
                      specifier.isExportSpecifier(),
                      'I think this should never happen',
                    );

                    const specifierLocal = specifier.node.local;
                    const specifierExported = specifier.node.exported;

                    const newSpecifierLocal = t.identifier(
                      createVanillaIdentifierName(),
                    );

                    const newSpecifier = t.exportSpecifier(
                      newSpecifierLocal,
                      specifierExported,
                    );
                    specifier.replaceWith(newSpecifier);

                    const exportNamedDeclaration = t.variableDeclaration(
                      'const',
                      [
                        t.variableDeclarator(
                          newSpecifierLocal,
                          t.callExpression(vanillaExtractMacroIdentifier, [
                            specifierLocal,
                          ]),
                        ),
                      ],
                    );
                    // We only insert 1 node so we will only get 1 path back
                    const [newPath] = statement.insertBefore(
                      exportNamedDeclaration,
                    );

                    const insertedStatementIndex =
                      statementIndex + specifierIndex;
                    this.exportStatements.add(insertedStatementIndex);

                    const identifierName = newSpecifierLocal.name;
                    registerNewVanillaIdentifier(
                      identifierName,
                      insertedStatementIndex,
                    );

                    // Traverse the newly created statement to ensure we have an accurate dependency graph
                    // These newly inserted statements will not be traversed at the end of the
                    // outer for loop
                    newPath.traverse(identifierVisitor, {
                      ...partialVisitorOpts,
                      addUsedIdentifier: createAddUsedIdentifier(
                        new Set([identifierName]),
                      ),
                      statementIndex: insertedStatementIndex,
                    });
                  }
                }
              } else {
                const declarationPath = statement.get('declaration');

                invariant(
                  declarationPath.isVariableDeclaration(),
                  `[TODO] Handle other types of top-level name declarations, statementIndex: ${statementIndex}, type: ${declarationPath.type}`,
                );

                const declarationPaths = declarationPath.get('declarations');
                for (const declarationIndex of declarationPaths.keys()) {
                  const declaratorPath = declarationPaths[declarationIndex];
                  handleVariableDeclarator(declaratorPath, statementIndex);

                  if (isCssFile) {
                    declaratorPath.get('init').replaceWith(
                      t.callExpression(vanillaExtractMacroIdentifier, [
                        // @ts-expect-error Could be uninitialized
                        declaratorPath.node.init,
                      ]),
                    );
                  }
                }
              }
            } else if (statement.isExportDefaultDeclaration()) {
              const identifierName = vanillaDefaultIdentifier;

              this.exportStatements.add(statementIndex);

              this.moduleScopeIdentifiers.add(identifierName);
              this.identifierOwners.get(statementIndex).add(identifierName);

              if (isCssFile) {
                const declaration = statement.node.declaration;
                invariant(
                  t.isExpression(declaration),
                  'Can only wrap an expression in a macro',
                );

                statement
                  .get('declaration')
                  .replaceWith(
                    t.callExpression(vanillaExtractMacroIdentifier, [
                      declaration,
                    ]),
                  );
              }
            } else if (isCssFile && statement.isExpressionStatement()) {
              const expression = statement.node.expression;

              invariant(
                t.isCallExpression(expression),
                'Can only extract call expressions at the global level in `.css.ts` files',
              );

              if (
                t.isIdentifier(expression.callee) &&
                globalApis.includes(expression.callee.name)
              ) {
                // We need to track dependencies of global API expressions
                // This identifier should never actually be referenced by anything
                const identifierName = createVanillaIdentifierName();
                this.identifierOwners.get(statementIndex).add(identifierName);

                statement
                  .get('expression')
                  .replaceWith(
                    t.callExpression(vanillaExtractMacroIdentifier, [
                      expression,
                    ]),
                  );
                this.globalVanillaApiStatements.add(statementIndex);
              }
            }

            statement.traverse(identifierVisitor, {
              ...partialVisitorOpts,
              addUsedIdentifier: createAddUsedIdentifier(
                this.identifierOwners.get(statementIndex),
              ),
            });
          }

          const essentialIdentifiers = new Set<IdentifierName>(
            this.vanillaMacros,
          );

          const { store } = state.opts;

          // Refetch the body path as the old body path doesn't contain inserted statements
          const newBodyPath = path.get('body');
          const newBodyPathKeys = Array.from(newBodyPath.keys());

          const mutatedModuleScopeIdentifiers = new Set<IdentifierName>();
          for (const statementIndex of newBodyPathKeys) {
            for (const ident of this.identifierMutators
              .get(statementIndex)
              .values()) {
              mutatedModuleScopeIdentifiers.add(ident);
            }
          }

          for (const statementIndex of newBodyPathKeys.reverse()) {
            const statement = newBodyPath[statementIndex];
            const isImportDeclaration = statement.isImportDeclaration();

            // Move all import statements from runtime to buildtime if we're in a `.css.ts` file
            if (isCssFile && isImportDeclaration) {
              store.buildTimeStatements.unshift(statement.node);
              statement.remove();
              continue;
            }

            // Should keep index if it creates/modifies an essential identifier
            // or it depends on a macro

            const ownedIdents = this.identifierOwners.get(statementIndex);
            const ownsEssentialIdentifier = hasIntersection(
              ownedIdents,
              essentialIdentifiers,
            );

            const mutatedIdents = this.identifierMutators.get(statementIndex);
            const mutatesEssentialIdentifier = hasIntersection(
              mutatedIdents,
              essentialIdentifiers,
            );

            const statementMacroPaths = Array.from(
              this.macroOwners.get(statementIndex),
            );
            const isExportStatement = this.exportStatements.has(statementIndex);
            const mutatesOrOwnsMutatedIdent =
              mutatedIdents.size > 0 ||
              hasIntersection(ownedIdents, mutatedModuleScopeIdentifiers);

            const statementCallsGlobalVanillaApi =
              this.globalVanillaApiStatements.has(statementIndex);

            if (
              this.depGraph.dependsOnSome(ownedIdents, this.vanillaMacros) ||
              ownsEssentialIdentifier ||
              mutatesEssentialIdentifier
            ) {
              for (const ownedIdent of ownedIdents) {
                for (const dep of this.depGraph.getDependencies(ownedIdent)) {
                  essentialIdentifiers.add(dep);
                }
              }

              // Global APIs are handled elsewhere
              if (!statementCallsGlobalVanillaApi) {
                store.buildTimeStatements.unshift(statement.node);
              }

              const importSpecifiers = isImportDeclaration
                ? statement.node.specifiers
                : [];
              const ownedRuntimeImportSpecifiers = importSpecifiers.filter(
                (specifier) =>
                  this.importedIdentifiersUsedAtRuntime.has(
                    specifier.local.name,
                  ),
              );
              const canBeRemovedFromRuntime =
                !mutatesOrOwnsMutatedIdent &&
                (isImportDeclaration ||
                  (statementMacroPaths.length === 0 && !isExportStatement)) &&
                ownedRuntimeImportSpecifiers.length === 0;

              if (canBeRemovedFromRuntime) {
                // Delete buildtime only statements from the runtime
                statement.remove();
              } else if (isImportDeclaration) {
                // Prune buildtime only import specifiers from the runtime
                statement.replaceWith(
                  t.importDeclaration(
                    ownedRuntimeImportSpecifiers,
                    statement.node.source,
                  ),
                );
              }
            }

            if (statementMacroPaths.length > 0) {
              for (const macroCallExpressionPath of statementMacroPaths) {
                let identifierName: string | undefined;

                if (
                  // If we're at the top of a named variable declaration
                  t.isVariableDeclarator(macroCallExpressionPath.parent) &&
                  // TODO: Handle other types of ids
                  t.isIdentifier(macroCallExpressionPath.parent.id)
                ) {
                  identifierName = this.vanillaIdentifierMap.get(
                    macroCallExpressionPath.parent.id.name,
                  );
                } else if (
                  // If we're at the top of a default export
                  t.isExportDefaultDeclaration(macroCallExpressionPath.parent)
                ) {
                  identifierName = vanillaDefaultIdentifier;
                } else {
                  // We're somewhere else in an expression
                  identifierName = createVanillaIdentifierName();
                }

                if (isCssFile && statementCallsGlobalVanillaApi) {
                  store.buildTimeStatements.unshift(statement.node);
                  statement.remove();
                } else {
                  invariant(identifierName, 'Must have an identifier name');
                  const ident = t.identifier(identifierName);

                  const declaration = t.exportNamedDeclaration(
                    t.variableDeclaration('const', [
                      t.variableDeclarator(ident, macroCallExpressionPath.node),
                    ]),
                  );

                  store.buildTimeStatements.unshift(declaration);

                  macroCallExpressionPath.replaceWith(ident);
                }
              }
            }
          }

          if (isCssFile) {
            store.buildTimeStatements.unshift(
              t.importDeclaration(
                [
                  t.importSpecifier(
                    vanillaExtractMacroIdentifier,
                    vanillaExtractMacroIdentifier,
                  ),
                ],
                t.stringLiteral('@vanilla-extract/css'),
              ),
            );
          }
        },
      },
    },
  };
}
