import type { PluginObj, PluginPass } from '@babel/core';
import { types as t } from '@babel/core';
import type { Visitor } from '@babel/traverse';
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

interface Context extends PluginPass {
  prevalFunctions: Set<IdentifierName>;
  moduleScopeIdentifiers: Set<IdentifierName>;
  identifierOwners: DefaultMap<number, Set<IdentifierName>>;
  depGraph: DependencyGraph;
}

const identifierVisitor: Visitor<{
  addUsedIdentifier: (ident: IdentifierName) => void;
}> = {
  Identifier(path) {
    if (t.isMemberExpression(path.parent, { property: path.node })) {
      // This is a property of an object so we don't want to check it against the outer scope
      return;
    }

    this.addUsedIdentifier(path.node.name);
  },
};

const statementVisitor: Visitor<{
  moduleScopeIdentifiers: Set<IdentifierName>;
  addUsedIdentifier: (ident: IdentifierName) => void;
}> = {
  VariableDeclarator(path) {
    path.get('init').traverse(identifierVisitor, {
      addUsedIdentifier: this.addUsedIdentifier,
    });
  },
};

export default function (): PluginObj<Context> {
  return {
    pre() {
      this.prevalFunctions = new Set();
      this.moduleScopeIdentifiers = new Set();
      this.identifierOwners = new DefaultMap(() => new Set());
      this.depGraph = new DependencyGraph();
    },
    visitor: {
      Program: {
        enter(path) {
          const bodyPath = path.get('body');
          for (const statementIndex of bodyPath.keys()) {
            const statement = bodyPath[statementIndex];

            if (t.isImportDeclaration(statement.node)) {
              const locals = statement.node.specifiers.map(
                (specifier) => specifier.local.name,
              );

              for (const local of locals) {
                if (statement.node.source.value === '@vanilla-extract/css') {
                  this.prevalFunctions.add(local);
                }

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
              });
            }
          }

          const essentialIdentifiers = new Set<IdentifierName>(
            this.prevalFunctions,
          );

          // console.log({
          //   essentialIdentifiers,
          // });
          // console.log(this.depGraph);

          for (const statementIndex of Array.from(bodyPath.keys()).reverse()) {
            // Should keep index if it creates/modifies an essential identifier
            // or it depends on a preval function

            const ownedIdents = this.identifierOwners.get(statementIndex);

            if (
              this.depGraph.dependsOnSome(ownedIdents, this.prevalFunctions) ||
              hasIntersection(ownedIdents, essentialIdentifiers)
            ) {
              for (const ownedIdent of ownedIdents) {
                for (const dep of this.depGraph.getDependencies(ownedIdent)) {
                  essentialIdentifiers.add(dep);
                }
              }

              continue;
            }

            const statement = bodyPath[statementIndex];
            statement.remove();
          }
        },
      },
    },
  };
}
