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
  moduleScopeIdentifiers: Set<IdentifierName>;
  mutatedModuleScopeIdentifiers: Set<IdentifierName>;
  globalVanillaApiStatements: Set<number>;
  identifierOwners: DefaultMap<StatementIndex, Set<IdentifierName>>;
  depGraph: DependencyGraph;
  vanillaMacros: string[];
  macroOwners: DefaultMap<StatementIndex, Set<NodePath<t.CallExpression>>>;
  vanillaIdentifierMap: Map<string, string>;
  exportStatements: Set<StatementIndex>;
  mutatingStatements: Set<StatementIndex>;
  identifierMutators: DefaultMap<number, Set<IdentifierName>>;
  opts: PluginOptions;
}

const identifierVisitor: Visitor<
  {
    addUsedIdentifier: (ident: IdentifierName) => void;
    statementIndex: number;
  } & Pick<
    Context,
    | 'vanillaMacros'
    | 'macroOwners'
    | 'mutatingStatements'
    | 'identifierMutators'
    | 'moduleScopeIdentifiers'
    | 'mutatedModuleScopeIdentifiers'
  >
> = {
  Identifier(path) {
    if (t.isMemberExpression(path.parent, { property: path.node })) {
      // This is a property of an object so we don't want to check it against the outer scope
      return;
    }

    this.addUsedIdentifier(path.node.name);
  },
  CallExpression(path) {
    if (isVanillaMacroFunctionCall(path, this.vanillaMacros)) {
      this.macroOwners.get(this.statementIndex).add(path);
    }
  },
  AssignmentExpression(path) {
    this.mutatingStatements.add(this.statementIndex);

    const left = path.node.left;

    if (t.isIdentifier(left) && this.moduleScopeIdentifiers.has(left.name)) {
      this.identifierMutators.get(this.statementIndex).add(left.name);
      this.mutatedModuleScopeIdentifiers.add(left.name);
    }
  },
  UpdateExpression(path) {
    this.mutatingStatements.add(this.statementIndex);

    const arg = path.node.argument;

    if (t.isIdentifier(arg) && this.moduleScopeIdentifiers.has(arg.name)) {
      this.identifierMutators.get(this.statementIndex).add(arg.name);
      this.mutatedModuleScopeIdentifiers.add(arg.name);
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
      this.mutatingStatements = new Set();
      this.identifierMutators = new DefaultMap(() => new Set());
      this.mutatedModuleScopeIdentifiers = new Set();
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

          for (const statementIndex of bodyPath.keys()) {
            const statement = bodyPath[statementIndex];

            const declaredIdentifiers = new Set<IdentifierName>();

            if (t.isImportDeclaration(statement.node)) {
              const locals = statement.node.specifiers.map(
                (specifier) => specifier.local.name,
              );

              for (const local of locals) {
                this.moduleScopeIdentifiers.add(local);
                this.identifierOwners.get(statementIndex).add(local);
              }

              // No need to traverse import declarations
              continue;
            }

            if (statement.isVariableDeclaration()) {
              for (const declarationIndex of statement.node.declarations.keys()) {
                const declaratorPath =
                  statement.get('declarations')[declarationIndex];
                invariant(
                  t.isIdentifier(declaratorPath.node.id),
                  '[TODO] Handle other types of top-level declarations',
                );

                const identifierName = declaratorPath.node.id.name;
                const vanillaIdentifierName = `_vanilla_identifier_${statementIndex}_${declarationIndex}`;

                this.vanillaIdentifierMap.set(
                  identifierName,
                  vanillaIdentifierName,
                );

                this.moduleScopeIdentifiers.add(identifierName);
                declaredIdentifiers.add(identifierName);
                this.identifierOwners.get(statementIndex).add(identifierName);

                if (isCssFile) {
                  declaratorPath.get('init').replaceWith(
                    t.callExpression(vanillaExtractMacroIdentifier, [
                      // @ts-expect-error Could be uninitialized
                      declaratorPath.node.init,
                    ]),
                  );
                }
              }
            } else if (statement.isExportNamedDeclaration()) {
              this.exportStatements.add(statementIndex);
              const isReexportOrAggregate =
                statement.get('specifiers').length > 0;

              // Don't do anything if it is a re-export or aggregate as the identifiers
              // will have already been accounted for
              if (!isReexportOrAggregate) {
                const declarationPath = statement.get('declaration');

                invariant(
                  declarationPath.isVariableDeclaration(),
                  '[TODO] Handle other types of top-level name declarations',
                );

                const declarationPaths = declarationPath.get('declarations');
                for (const declarationIndex of declarationPaths.keys()) {
                  const declaratorPath = declarationPaths[declarationIndex];

                  invariant(
                    t.isIdentifier(declaratorPath.node.id),
                    '[TODO] Handle other types of top-level declarations',
                  );

                  const identifierName = declaratorPath.node.id.name;
                  const vanillaIdentifierName = `_vanilla_identifier_${statementIndex}_${declarationIndex}`;

                  this.vanillaIdentifierMap.set(
                    identifierName,
                    vanillaIdentifierName,
                  );

                  this.moduleScopeIdentifiers.add(identifierName);
                  declaredIdentifiers.add(identifierName);
                  this.identifierOwners.get(statementIndex).add(identifierName);

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
              declaredIdentifiers.add(identifierName);
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

            const opts = {
              addUsedIdentifier: (ident: string) => {
                if (this.moduleScopeIdentifiers.has(ident)) {
                  for (const declaredIdent of declaredIdentifiers) {
                    // In order to correctly extract macros at the top level of a declarator, we
                    // need to traverse the declarator path, not the declarator's init path.
                    // Doing this results in traversing the declarator identifier, so to prevent a
                    // self-referential dependency, we explicitly check for it
                    if (declaredIdent !== ident) {
                      this.depGraph.addDependency(declaredIdent, ident);
                    }
                  }
                }
              },
              moduleScopeIdentifiers: this.moduleScopeIdentifiers,
              vanillaMacros: this.vanillaMacros,
              macroOwners: this.macroOwners,
              statementIndex,
              vanillaIdentifierMap: this.vanillaIdentifierMap,
              mutatingStatements: this.mutatingStatements,
              identifierMutators: this.identifierMutators,
              mutatedModuleScopeIdentifiers: this.mutatedModuleScopeIdentifiers,
            };

            statement.traverse(identifierVisitor, opts);
          }

          const essentialIdentifiers = new Set<IdentifierName>(
            this.vanillaMacros,
          );

          const { store } = state.opts;

          for (const statementIndex of Array.from(bodyPath.keys()).reverse()) {
            const statement = bodyPath[statementIndex];

            if (
              isCssFile &&
              this.globalVanillaApiStatements.has(statementIndex)
            ) {
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
              this.mutatingStatements.has(statementIndex) ||
              hasIntersection(ownedIdents, this.mutatedModuleScopeIdentifiers);

            const isImportDeclaration = statement.isImportDeclaration();

            if (isCssFile && isImportDeclaration) {
              // Move all import statements from runtime to buildtime if we're in a `.css.ts` file
              store.buildTimeStatements.unshift(statement.node);
              statement.remove();
              continue;
            }

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
              if (ownsEssentialIdentifier || mutatesEssentialIdentifier) {
                store.buildTimeStatements.unshift(statement.node);
              }

              const importSpecifiers = isImportDeclaration
                ? statement.node.specifiers
                : [];
              const ownedRuntimeImportSpecifiers = importSpecifiers.filter(
                (specifier) => !essentialIdentifiers.has(specifier.local.name),
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
              statementMacroPaths.map((macroCallExpressionPath, macroIndex) => {
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
                  identifierName = `_vanilla_anonymousIdentifier_${statementIndex}_${macroIndex}`;
                }

                invariant(identifierName, 'Must have an identifier name');
                const ident = t.identifier(identifierName);

                const declaration = t.exportNamedDeclaration(
                  t.variableDeclaration('const', [
                    t.variableDeclarator(ident, macroCallExpressionPath.node),
                  ]),
                );

                store.buildTimeStatements.unshift(declaration);

                macroCallExpressionPath.replaceWith(ident);
              });
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
