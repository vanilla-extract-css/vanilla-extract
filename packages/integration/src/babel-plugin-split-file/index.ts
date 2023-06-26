import type { PluginObj, PluginPass } from '@babel/core';
import { types as t } from '@babel/core';
import type { Binding, NodePath, Visitor } from '@babel/traverse';
import invariant from 'assert';
import { DefaultMap } from './DefaultMap';

interface Context extends PluginPass {
  macroReferences: DefaultMap<string, number>;
  identifierCount: number;
  injectedStatements: DefaultMap<number, Array<t.Statement>>;
  moduleScopeBindings: {
    [name: string]: Binding;
  };
  createVanillaIdentifierName: () => string;
  isMacroCallExpression: (
    path: NodePath<t.CallExpression>,
  ) => path is NodePath<t.CallExpression>;
  opts: PluginOptions;
  macros: string[];
}

const importDeclarationVisitor: Visitor<Context> = {
  ImportDeclaration(path) {
    const specifierLocals = path.node.specifiers.map(
      (specifier) => specifier.local.name,
    );

    if (
      specifierLocals.every((local) => {
        if (this.macros.includes(local)) {
          return true;
        }

        const localBinding = path.scope.bindings[local];
        const bindingReferences = localBinding.references;
        return (
          bindingReferences === this.macroReferences.get(local) &&
          bindingReferences > 0
        );
      })
    ) {
      path.remove();
    }

    // TODO: Maybe clean up dangling specifiers
  },
};

export interface Store {
  buildTimeStatements: Array<t.Statement>;
}

interface PluginOptions {
  store: Store;
  macros: Array<string>;
}

const macroVisitor: Visitor<Context> = {
  CallExpression(path) {
    if (this.isMacroCallExpression(path)) {
      for (const arg of path.get('arguments')) {
        arg.traverse(
          {
            Identifier({ node }) {
              // TODO: Ensure this identifier corresponds to the imported binding
              if (node.name in this.moduleScopeBindings) {
                this.macroReferences.set(
                  node.name,
                  this.macroReferences.get(node.name) + 1,
                );
              }
            },
          },
          this,
        );
      }

      const injectedIndentifier = t.identifier(
        this.createVanillaIdentifierName(),
      );
      const declaration = t.exportNamedDeclaration(
        t.variableDeclaration('const', [
          t.variableDeclarator(injectedIndentifier, path.node),
        ]),
      );
      const statementIndex = getStatementIndex(path);

      this.injectedStatements.get(statementIndex).push(declaration);
      path.replaceWith(injectedIndentifier);
    }
  },
};

export default function (): PluginObj<Context> {
  return {
    pre() {
      this.macroReferences = new DefaultMap(() => 0);
      this.identifierCount = 0;
      this.injectedStatements = new DefaultMap(() => []);
    },
    visitor: {
      Program: {
        enter(path, state) {
          const { macros, store } = state.opts;
          this.macros = macros;

          invariant(macros.length > 0, 'Must define at least one macro');

          this.moduleScopeBindings = path.scope?.bindings ?? {};

          this.isMacroCallExpression = (
            path: NodePath<t.CallExpression>,
          ): path is NodePath<t.CallExpression> =>
            t.isIdentifier(path.node.callee) &&
            macros.includes(path.node.callee.name);

          this.createVanillaIdentifierName = () =>
            `_vanilla_identifier_${this.identifierCount++}`;

          path.traverse(macroVisitor, this);

          const bodyPath = path.get('body');
          for (const statementIndex of bodyPath.keys()) {
            const statement = bodyPath[statementIndex];

            for (const injectedStatment of this.injectedStatements.get(
              statementIndex,
            )) {
              store.buildTimeStatements.push(injectedStatment);
            }

            store.buildTimeStatements.push(statement.node);
          }

          path.traverse(importDeclarationVisitor, this);
        },
      },
    },
  };
}

function getStatementIndex(path: NodePath<t.CallExpression>): number {
  const pathLocation = path.getStatementParent()?.getPathLocation();
  invariant(pathLocation != null, 'Could not get statment parent of macro');

  const indexMatch = pathLocation.match(/program.body\[(\d+)]/);
  invariant(indexMatch != null, 'Could not parse path location');

  return parseInt(indexMatch[1], 10);
}
