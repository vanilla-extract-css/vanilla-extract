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

export interface Store {
  buildTimeStatements: Array<t.Statement>;
}

interface PluginOptions {
  store: Store;
}

interface Context extends PluginPass {
  moduleScopeIdentifiers: Set<IdentifierName>;
  identifierOwners: DefaultMap<number, Set<IdentifierName>>;
  depGraph: DependencyGraph;
  vanillaPrevalFunctionLocal?: string;
  anonymousPrevalOwners: DefaultMap<number, Set<NodePath<t.CallExpression>>>;
  vanillaIdentifierMap: Map<string, string>;
  exportStatements: Set<number>;
  opts: PluginOptions;
}

const vanillaPrevalFunctionName = 'css$';

const identifierVisitor: Visitor<
  {
    addUsedIdentifier: (ident: IdentifierName) => void;
    moduleScopeIdentifiers: Set<IdentifierName>;
    statementIndex: number;
    insideJsxElement: boolean;
  } & Pick<
    Context,
    | 'vanillaPrevalFunctionLocal'
    | 'anonymousPrevalOwners'
    | 'vanillaIdentifierMap'
  >
> = {
  Identifier(path) {
    if (t.isMemberExpression(path.parent, { property: path.node })) {
      // This is a property of an object so we don't want to check it against the outer scope
      return;
    }

    this.addUsedIdentifier(path.node.name);
    const vanillaIdentifierName = this.vanillaIdentifierMap.get(path.node.name);
    if (vanillaIdentifierName) {
      path.replaceWith(t.identifier(vanillaIdentifierName));
    }
  },
  JSXElement: {
    enter() {
      this.insideJsxElement = true;
    },
    exit() {
      this.insideJsxElement = false;
    },
  },
  // Handle prevals inside JSX
  CallExpression(path) {
    if (
      this.insideJsxElement &&
      isVanillaPrevalFunctionCall(path, this.vanillaPrevalFunctionLocal)
    ) {
      this.anonymousPrevalOwners.get(this.statementIndex).add(path);
      return;
    }
  },
};

const isVanillaPrevalFunctionCall = (
  path: NodePath<t.JSXEmptyExpression | t.Expression | null | undefined>,
  vanillaPrevalFunctionLocal?: string,
): path is NodePath<t.CallExpression> =>
  path.isCallExpression() &&
  t.isIdentifier(path.node.callee, {
    name: vanillaPrevalFunctionLocal,
  });

const statementVisitor: Visitor<
  {
    addUsedIdentifier: (ident: IdentifierName) => void;
    moduleScopeIdentifiers: Set<IdentifierName>;
    statementIndex: number;
  } & Pick<
    Context,
    | 'vanillaPrevalFunctionLocal'
    | 'anonymousPrevalOwners'
    | 'vanillaIdentifierMap'
    | 'exportStatements'
  >
> = {
  VariableDeclarator: {
    enter(path) {
      const initPath = path.get('init');

      initPath.traverse(identifierVisitor, {
        addUsedIdentifier: this.addUsedIdentifier,
        moduleScopeIdentifiers: this.moduleScopeIdentifiers,
        vanillaPrevalFunctionLocal: this.vanillaPrevalFunctionLocal,
        anonymousPrevalOwners: this.anonymousPrevalOwners,
        statementIndex: this.statementIndex,
        vanillaIdentifierMap: this.vanillaIdentifierMap,
        // Is this correct?
        insideJsxElement: false,
      });
    },
    exit(path) {
      const initPath = path.get('init');
      // Handle prevals in exported declarator inits, e.g. export const foo = css$(style({}))
      if (
        this.exportStatements.has(this.statementIndex) &&
        isVanillaPrevalFunctionCall(initPath, this.vanillaPrevalFunctionLocal)
      ) {
        this.anonymousPrevalOwners.get(this.statementIndex).add(initPath);
      }
    },
  },
};

const renameAndExportVariableDeclarationIfRequired = (
  statement: t.Statement,
  shouldExport: boolean,
  vanillaIdentifierMap: Map<string, string>,
) => {
  if (shouldExport && t.isVariableDeclaration(statement)) {
    for (const decl of statement.declarations) {
      const declarationIdentifier = decl.id;

      if (t.isIdentifier(declarationIdentifier)) {
        const vanillaIdentifierName = vanillaIdentifierMap.get(
          declarationIdentifier.name,
        );

        if (vanillaIdentifierName) {
          declarationIdentifier.name = vanillaIdentifierName;
        }
      }
    }

    return t.exportNamedDeclaration(statement);
  }

  return statement;
};

const vanillaDefaultIdentifier = '_vanilla_defaultIdentifer';

export default function (): PluginObj<Context> {
  return {
    pre() {
      this.moduleScopeIdentifiers = new Set();
      this.identifierOwners = new DefaultMap(() => new Set());
      this.depGraph = new DependencyGraph();
      this.anonymousPrevalOwners = new DefaultMap(() => new Set());
      this.vanillaIdentifierMap = new Map();
      this.exportStatements = new Set();
    },
    visitor: {
      Program: {
        enter(path, state) {
          const bodyPath = path.get('body');
          for (const statementIndex of bodyPath.keys()) {
            const statement = bodyPath[statementIndex];

            if (t.isImportDeclaration(statement.node)) {
              // The only preval function we care about is `vanillaPrevalFunctionName`
              if (statement.node.source.value === '@vanilla-extract/css') {
                for (const specifier of statement.node.specifiers) {
                  if (
                    t.isImportSpecifier(specifier) &&
                    t.isIdentifier(specifier.imported) &&
                    specifier.imported.name === vanillaPrevalFunctionName
                  ) {
                    this.vanillaPrevalFunctionLocal = specifier.imported.name;
                  }
                }
              }

              const locals = statement.node.specifiers.map(
                (specifier) => specifier.local.name,
              );

              for (const local of locals) {
                this.moduleScopeIdentifiers.add(local);
                this.identifierOwners.get(statementIndex).add(local);
              }
            } else if (
              statement.isVariableDeclaration() ||
              statement.isExportNamedDeclaration() ||
              statement.isExportDefaultDeclaration()
            ) {
              const declaredIdentifiers = new Set<IdentifierName>();

              // TODO: Handle export named declarations
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
                      this.depGraph.addDependency(declaredIdent, ident);
                    }
                  }
                },
                moduleScopeIdentifiers: this.moduleScopeIdentifiers,
                vanillaPrevalFunctionLocal: this.vanillaPrevalFunctionLocal,
                anonymousPrevalOwners: this.anonymousPrevalOwners,
                statementIndex,
                vanillaIdentifierMap: this.vanillaIdentifierMap,
                exportStatements: this.exportStatements,
              };

              if (statement.isExportDefaultDeclaration()) {
                statement.get('declaration').traverse(identifierVisitor, opts);
              } else {
                statement.traverse(statementVisitor, opts);
              }
            }
          }

          // Bail if no usage of the preval function is found
          if (!this.vanillaPrevalFunctionLocal) {
            throw new Error(
              `Failed to find usage of Vanilla Extract preval function "${vanillaPrevalFunctionName}"`,
            );
          }

          const essentialIdentifiers = new Set<IdentifierName>([
            this.vanillaPrevalFunctionLocal,
          ]);

          const { store } = state.opts;

          for (const statementIndex of Array.from(bodyPath.keys()).reverse()) {
            const anonymousPrevals = Array.from(
              this.anonymousPrevalOwners.get(statementIndex),
            );

            if (anonymousPrevals.length > 0) {
              anonymousPrevals.map((prevalCallExpressionPath, prevalIndex) => {
                const ident = t.identifier(
                  `_vanilla_anonymousIdentifier_${statementIndex}_${prevalIndex}`,
                );
                const declaration = t.exportNamedDeclaration(
                  t.variableDeclaration('const', [
                    t.variableDeclarator(ident, prevalCallExpressionPath.node),
                  ]),
                );

                store.buildTimeStatements.unshift(declaration);

                prevalCallExpressionPath.replaceWith(ident);
              });
            }

            // Should keep index if it creates/modifies an essential identifier
            // or it depends on a preval function

            const ownedIdents = this.identifierOwners.get(statementIndex);

            const ownsEssentialIdentifier = hasIntersection(
              ownedIdents,
              essentialIdentifiers,
            );
            console.log({
              statementIndex,
              ownedIdents,
              ownsEssentialIdentifier,
            });

            const statement = bodyPath[statementIndex];

            const isExportStatement = this.exportStatements.has(statementIndex);

            if (
              this.depGraph.dependsOnSome(ownedIdents, [
                this.vanillaPrevalFunctionLocal,
              ]) ||
              ownsEssentialIdentifier
            ) {
              for (const ownedIdent of ownedIdents) {
                for (const dep of this.depGraph.getDependencies(ownedIdent)) {
                  essentialIdentifiers.add(dep);
                }
              }

              // This heuristic works, but it over-exports some identifiers
              const shouldExport = ownsEssentialIdentifier;

              if (!isExportStatement) {
                store.buildTimeStatements.unshift(
                  renameAndExportVariableDeclarationIfRequired(
                    statement.node,
                    shouldExport,
                    this.vanillaIdentifierMap,
                  ),
                );
                statement.remove();
              }
            }
          }
        },
      },
    },
  };
}
