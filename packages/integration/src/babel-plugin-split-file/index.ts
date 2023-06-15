import type { PluginObj, PluginPass } from '@babel/core';
import { ContentGraph } from '@parcel/graph';
import { types as t } from '@babel/core';
import type { NodePath, Visitor } from '@babel/traverse';
import invariant from 'assert';
import { DefaultMap } from './DefaultMap';
import { DependencyGraph } from './DependencyGraph';

type Graph = any;
type NodeId = number;

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

const declarationVisitor: Visitor<{
  graph: Graph;
  rootNode: number;
  declaredNodeIds: Array<NodeId>;
}> = {
  ImportSpecifier(path) {
    const importNodeId = this.graph.addNodeByContentKey(path.node.local.name, {
      type: 'import',
      local: path.node.local.name,
    });

    this.declaredNodeIds.push(importNodeId);
    this.graph.addEdge(this.rootNode, importNodeId);
  },
  ImportDefaultSpecifier(path) {
    const importNodeId = this.graph.addNodeByContentKey(path.node.local.name, {
      type: 'import',
      local: path.node.local.name,
    });

    this.declaredNodeIds.push(importNodeId);
    this.graph.addEdge(this.rootNode, importNodeId);
  },
  ImportNamespaceSpecifier(path) {
    const importNodeId = this.graph.addNodeByContentKey(path.node.local.name, {
      type: 'import',
      local: path.node.local.name,
    });

    this.declaredNodeIds.push(importNodeId);
    this.graph.addEdge(this.rootNode, importNodeId);
  },
  VariableDeclarator(path) {
    const names: Array<string> = [];

    const { node } = path;
    if (t.isIdentifier(node.id)) {
      names.push(node.id.name);
    } else {
      path.get('id').traverse({
        Identifier({ node }) {
          names.push(node.name);
        },
      });
    }

    for (const local of names) {
      const identNodeId = this.graph.addNodeByContentKey(local, {
        type: 'identifier',
        local,
      });

      this.declaredNodeIds.push(identNodeId);
      this.graph.addEdge(this.rootNode, identNodeId);
    }
    path.stop();
  },
  FunctionDeclaration(path) {
    if (path.node.id) {
      const identNodeId = this.graph.addNodeByContentKey(path.node.id.name, {
        type: 'identifier',
        local: path.node.id.name,
      });

      this.declaredNodeIds.push(identNodeId);
      this.graph.addEdge(this.rootNode, identNodeId);
    }
    path.stop();
  },
  ClassDeclaration(path) {
    const identNodeId = this.graph.addNodeByContentKey(path.node.id.name, {
      type: 'identifier',
      local: path.node.id.name,
    });

    this.declaredNodeIds.push(identNodeId);
    this.graph.addEdge(this.rootNode, identNodeId);
    path.stop();
  },
};

const referenceVisitor: Visitor<{
  graph: Graph;
  parentNodeIds: Array<NodeId>;
}> = {
  Identifier(path) {
    const { name } = path.node;

    if (this.graph.hasContentKey(name)) {
      const identNodeId = this.graph.getNodeIdByContentKey(name);

      for (const parentNodeId of this.parentNodeIds) {
        this.graph.addEdge(parentNodeId, identNodeId);
      }
    }
  },
  CallExpression(path) {
    // Walk macros n stuff
  },
};

interface PluginOptions {
  macros: Array<string>;
}

interface Context extends PluginPass {
  graph: Graph;
  rootNode: number;
  opts: PluginOptions;
}

const isVanillaMacroFunctionCall = (
  path: NodePath<t.CallExpression>,
  vanillaMacros: string[],
): path is NodePath<t.CallExpression> =>
  t.isIdentifier(path.node.callee) &&
  vanillaMacros.includes(path.node.callee.name);

const vanillaDefaultIdentifier = '_vanilla_defaultIdentifer';

type Node =
  | { type: 'root' }
  | { type: 'identifier'; local: string }
  | { type: 'import'; local: string };

export default function (): PluginObj<Context> {
  return {
    pre({ opts }) {
      this.graph = new ContentGraph();
      this.rootNode = this.graph.addNodeByContentKey('root', { type: 'root' });
    },
    visitor: {
      Program: {
        enter(path, state) {
          const bodyPath = path.get('body');
          const { macros } = state.opts;

          invariant(macros.length > 0, 'Must define at least one macro');

          this.macros = macros;

          for (const statementIndex of bodyPath.keys()) {
            const statement = bodyPath[statementIndex];

            const declaredNodeIds = [];
            // Find which idents are declared by this statement
            // add all delcared idents to graph
            statement.traverse(declarationVisitor, {
              ...this,
              declaredNodeIds,
            });

            // Attach all references to graph
            statement.traverse(referenceVisitor, {
              ...this,
              parentNodeIds: declaredNodeIds,
            });
          }

          let doesOneDependOnTwo = false;

          this.graph.traverse((nodeId, _, actions) => {
            const node = this.graph.getNode(nodeId);

            if (node.local === 'React') {
              doesOneDependOnTwo = true;
              actions.stop();
            }
          }, this.graph.getNodeIdByContentKey('one'));

          console.log({ doesOneDependOnTwo });
        },
      },
    },
  };
}
