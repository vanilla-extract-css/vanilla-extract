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
  opts: PluginOptions;
}

const vanillaPrevalFunctionName = 'css$';

const identifierVisitor: Visitor<
  {
    addUsedIdentifier: (ident: IdentifierName) => void;
    moduleScopeIdentifiers: Set<IdentifierName>;
    statementIndex: number;
  } & Pick<Context, 'vanillaPrevalFunctionLocal' | 'anonymousPrevalOwners'>
> = {
  Identifier(path) {
    if (t.isMemberExpression(path.parent, { property: path.node })) {
      // This is a property of an object so we don't want to check it against the outer scope
      return;
    }

    this.addUsedIdentifier(path.node.name);
  },
  JSXExpressionContainer(path) {
    const expressionPath = path.get('expression');
    if (
      expressionPath.isCallExpression() &&
      t.isIdentifier(expressionPath.node.callee, {
        name: this.vanillaPrevalFunctionLocal,
      })
    ) {
      this.anonymousPrevalOwners.get(this.statementIndex).add(expressionPath);
    }
  },
};

const statementVisitor: Visitor<
  {
    addUsedIdentifier: (ident: IdentifierName) => void;
    moduleScopeIdentifiers: Set<IdentifierName>;
    statementIndex: number;
  } & Pick<Context, 'vanillaPrevalFunctionLocal' | 'anonymousPrevalOwners'>
> = {
  VariableDeclarator(path) {
    path.get('init').traverse(identifierVisitor, {
      addUsedIdentifier: this.addUsedIdentifier,
      moduleScopeIdentifiers: this.moduleScopeIdentifiers,
      vanillaPrevalFunctionLocal: this.vanillaPrevalFunctionLocal,
      anonymousPrevalOwners: this.anonymousPrevalOwners,
      statementIndex: this.statementIndex,
    });
  },
};

export default function (): PluginObj<Context> {
  return {
    pre() {
      this.moduleScopeIdentifiers = new Set();
      this.identifierOwners = new DefaultMap(() => new Set());
      this.depGraph = new DependencyGraph();
      this.anonymousPrevalOwners = new DefaultMap(() => new Set());
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
            } else if (t.isVariableDeclaration(statement.node)) {
              const declaredIdentifiers = new Set<IdentifierName>();

              for (const decl of statement.node.declarations) {
                invariant(
                  t.isIdentifier(decl.id),
                  '[TODO] Handle other types of top-level declarations',
                );

                this.moduleScopeIdentifiers.add(decl.id.name);
                declaredIdentifiers.add(decl.id.name);
                this.identifierOwners.get(statementIndex).add(decl.id.name);
              }

              statement.traverse(statementVisitor, {
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
              });
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
                const declaration = t.variableDeclaration('const', [
                  t.variableDeclarator(ident, prevalCallExpressionPath.node),
                ]);

                store.buildTimeStatements.unshift(declaration);

                prevalCallExpressionPath.replaceWith(ident);
              });

              continue;
            }

            // Should keep index if it creates/modifies an essential identifier
            // or it depends on a preval function

            const ownedIdents = this.identifierOwners.get(statementIndex);

            if (
              this.depGraph.dependsOnSome(ownedIdents, [
                this.vanillaPrevalFunctionLocal,
              ]) ||
              hasIntersection(ownedIdents, essentialIdentifiers)
            ) {
              for (const ownedIdent of ownedIdents) {
                for (const dep of this.depGraph.getDependencies(ownedIdent)) {
                  essentialIdentifiers.add(dep);
                }
              }

              const statement = bodyPath[statementIndex];
              store.buildTimeStatements.unshift(statement.node);
              statement.remove();
            }
          }
        },
      },
    },
  };
}
