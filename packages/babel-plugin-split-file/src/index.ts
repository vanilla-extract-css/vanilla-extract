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
}

interface Context extends PluginPass {
  moduleScopeIdentifiers: Set<IdentifierName>;
  mutatedModuleScopeIdentifiers: Set<IdentifierName>;
  identifierOwners: DefaultMap<StatementIndex, Set<IdentifierName>>;
  depGraph: DependencyGraph;
  vanillaMacros: string[];
  prevalOwners: DefaultMap<StatementIndex, Set<NodePath<t.CallExpression>>>;
  vanillaIdentifierMap: Map<string, string>;
  exportStatements: Set<StatementIndex>;
  mutatingStatements: Set<StatementIndex>;
  identifierMutators: DefaultMap<number, Set<IdentifierName>>;
  opts: PluginOptions;
}

const identifierVisitor: Visitor<
  {
    addUsedIdentifier: (ident: IdentifierName) => void;
    moduleScopeIdentifiers: Set<IdentifierName>;
    statementIndex: number;
  } & Pick<
    Context,
    | 'vanillaMacros'
    | 'prevalOwners'
    | 'mutatingStatements'
    | 'identifierMutators'
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
      this.prevalOwners.get(this.statementIndex).add(path);
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

export default function (): PluginObj<Context> {
  return {
    pre() {
      this.moduleScopeIdentifiers = new Set();
      this.identifierOwners = new DefaultMap(() => new Set());
      this.depGraph = new DependencyGraph();
      this.prevalOwners = new DefaultMap(() => new Set());
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
          const { macros } = state.opts;

          invariant(macros.length > 0, 'Must define at least one macro');

          this.vanillaMacros = macros;

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
            } else {
              if (t.isVariableDeclaration(statement.node)) {
                for (const declarationIndex of statement.node.declarations.keys()) {
                  const decl = statement.node.declarations[declarationIndex];
                  invariant(
                    t.isIdentifier(decl.id),
                    '[TODO] Handle other types of top-level declarations',
                  );

                  const identifierName = decl.id.name;
                  const vanillaIdentifierName = `_vanilla_identifier_${statementIndex}_${declarationIndex}`;

                  this.vanillaIdentifierMap.set(
                    identifierName,
                    vanillaIdentifierName,
                  );

                  this.moduleScopeIdentifiers.add(identifierName);
                  declaredIdentifiers.add(identifierName);
                  this.identifierOwners.get(statementIndex).add(identifierName);
                }
              }

              if (t.isExportNamedDeclaration(statement.node)) {
                invariant(
                  t.isVariableDeclaration(statement.node.declaration),
                  '[TODO] Handle other types of top-level name declarations',
                );

                this.exportStatements.add(statementIndex);

                for (const declarationIndex of statement.node.declaration.declarations.keys()) {
                  const decl =
                    statement.node.declaration.declarations[declarationIndex];

                  invariant(
                    t.isIdentifier(decl.id),
                    '[TODO] Handle other types of top-level declarations',
                  );

                  const identifierName = decl.id.name;
                  const vanillaIdentifierName = `_vanilla_identifier_${statementIndex}_${declarationIndex}`;

                  this.vanillaIdentifierMap.set(
                    identifierName,
                    vanillaIdentifierName,
                  );

                  this.moduleScopeIdentifiers.add(identifierName);
                  declaredIdentifiers.add(identifierName);
                  this.identifierOwners.get(statementIndex).add(identifierName);
                }
              }

              if (t.isExportDefaultDeclaration(statement.node)) {
                const identifierName = vanillaDefaultIdentifier;

                this.exportStatements.add(statementIndex);

                this.moduleScopeIdentifiers.add(identifierName);
                declaredIdentifiers.add(identifierName);
                this.identifierOwners.get(statementIndex).add(identifierName);
              }

              const opts = {
                addUsedIdentifier: (ident: string) => {
                  if (this.moduleScopeIdentifiers.has(ident)) {
                    for (const declaredIdent of declaredIdentifiers) {
                      // In order to correctly extract prevals at the top level of a declarator, we
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
                prevalOwners: this.prevalOwners,
                statementIndex,
                vanillaIdentifierMap: this.vanillaIdentifierMap,
                mutatingStatements: this.mutatingStatements,
                identifierMutators: this.identifierMutators,
                mutatedModuleScopeIdentifiers:
                  this.mutatedModuleScopeIdentifiers,
              };

              statement.traverse(identifierVisitor, opts);
            }
          }

          const essentialIdentifiers = new Set<IdentifierName>(
            this.vanillaMacros,
          );

          const { store } = state.opts;

          for (const statementIndex of Array.from(bodyPath.keys()).reverse()) {
            // Should keep index if it creates/modifies an essential identifier
            // or it depends on a preval function

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

            const statement = bodyPath[statementIndex];

            const prevals = Array.from(this.prevalOwners.get(statementIndex));
            const isExportStatement = this.exportStatements.has(statementIndex);
            const mutatesOrOwnsMutatedIdent =
              this.mutatingStatements.has(statementIndex) ||
              hasIntersection(ownedIdents, this.mutatedModuleScopeIdentifiers);

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
              store.buildTimeStatements.unshift(statement.node);

              const isImportDeclaration = statement.isImportDeclaration();
              const importSpecifiers = isImportDeclaration
                ? statement.node.specifiers
                : [];
              const ownedRuntimeImportSpecifiers = importSpecifiers.filter(
                (specifier) => !essentialIdentifiers.has(specifier.local.name),
              );
              const canBeRemovedFromRuntime =
                !mutatesOrOwnsMutatedIdent &&
                (isImportDeclaration ||
                  (prevals.length === 0 && !isExportStatement));

              if (
                canBeRemovedFromRuntime &&
                ownedRuntimeImportSpecifiers.length === 0
              ) {
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

            if (prevals.length > 0) {
              prevals.map((prevalCallExpressionPath, prevalIndex) => {
                let identifierName: string | undefined;

                if (
                  // If we're at the top of a named variable declaration
                  t.isVariableDeclarator(prevalCallExpressionPath.parent) &&
                  // TODO: Handle other types of ids
                  t.isIdentifier(prevalCallExpressionPath.parent.id)
                ) {
                  identifierName = this.vanillaIdentifierMap.get(
                    prevalCallExpressionPath.parent.id.name,
                  );
                } else if (
                  // If we're at the top of a default export
                  t.isExportDefaultDeclaration(prevalCallExpressionPath.parent)
                ) {
                  identifierName = vanillaDefaultIdentifier;
                } else {
                  // We're somewhere else in an expression
                  identifierName = `_vanilla_anonymousIdentifier_${statementIndex}_${prevalIndex}`;
                }

                invariant(identifierName, 'Must have an identifier name');
                const ident = t.identifier(identifierName);

                const declaration = t.exportNamedDeclaration(
                  t.variableDeclaration('const', [
                    t.variableDeclarator(ident, prevalCallExpressionPath.node),
                  ]),
                );

                store.buildTimeStatements.unshift(declaration);

                prevalCallExpressionPath.replaceWith(ident);
              });
            }
          }
        },
      },
    },
  };
}
