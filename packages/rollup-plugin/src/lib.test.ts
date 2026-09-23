import { describe, expect, it, vi } from 'vitest';
import path from 'path';
import type { ModuleInfo, PluginContext } from 'rollup';

import {
  buildImportChain,
  sortModules,
  stripSideEffectImportsMatching,
  tryGetPackageName,
  type ImportChain,
} from './lib';

describe('stripSideEffectImportsMatching', () => {
  const cssSources = [
    'button.vanilla.css',
    'checkbox.vanilla.css',
    'radio.vanilla.css',
  ];

  const esm = `import React from 'react';
import 'button.vanilla.css';
import './foobar.js';

export default function Button() {
  return <button>My Button</button>;
}`;

  const esmStripped = `import React from 'react';
import './foobar.js';

export default function Button() {
  return <button>My Button</button>;
}`;

  const cjs = `const React = require('react');
require('button.vanilla.css');
require('./foobar.js');

module.exports = function Button() {
  return <button>My Button</button>;
}`;

  const cjsStripped = `const React = require('react');
require('./foobar.js');

module.exports = function Button() {
  return <button>My Button</button>;
}`;

  it.each([
    ['ESM', esm, esmStripped],
    ['CJS', cjs, cjsStripped],
  ])(
    'strips only the listed side-effect imports in %s',
    (_module, source, expected) => {
      expect(stripSideEffectImportsMatching(source, cssSources)).toBe(expected);
    },
  );

  it.each([
    ['ESM', esm],
    ['CJS', cjs],
  ])('leaves %s untouched when no sources are listed', (_module, source) => {
    expect(stripSideEffectImportsMatching(source, [])).toBe(source);
  });

  it('leaves imports with bindings alone', () => {
    const code = `import styles from 'button.vanilla.css';`;

    expect(stripSideEffectImportsMatching(code, cssSources)).toBe(code);
  });
});

type FakeModule = Partial<
  Pick<ModuleInfo, 'isEntry' | 'importers' | 'importedIds'>
>;

/** Builds a stub plugin context over a described module graph. */
const fakeGraph = (modules: Record<string, FakeModule>) => {
  const warn = vi.fn();

  return {
    warn,
    getModuleInfo: (id: string) =>
      modules[id]
        ? {
            id,
            isEntry: false,
            importers: [],
            importedIds: [],
            ...modules[id],
          }
        : null,
  } as Pick<PluginContext, 'getModuleInfo' | 'warn'> & {
    warn: ReturnType<typeof vi.fn>;
  };
};

describe('buildImportChain', () => {
  it('returns an empty chain for a module outside the graph', () => {
    expect(buildImportChain('nope', fakeGraph({}))).toEqual([]);
  });

  it('returns just the module itself when it is the entry', () => {
    const graph = fakeGraph({ entry: { isEntry: true } });

    expect(buildImportChain('entry', graph)).toEqual([['entry', -1]]);
  });

  it('walks up to the entry, recording each import position', () => {
    const graph = fakeGraph({
      entry: { isEntry: true, importedIds: ['a.css.ts', 'b.css.ts'] },
      'b.css.ts': { importers: ['entry'] },
    });

    // `b` is the entry's second import, hence order 1.
    expect(buildImportChain('b.css.ts', graph)).toEqual([
      ['entry', 1],
      ['b.css.ts', -1],
    ]);
  });

  it('stops at a module that has no importers', () => {
    const graph = fakeGraph({ orphan: {} });

    expect(buildImportChain('orphan', graph)).toEqual([['orphan', -1]]);
  });

  it('warns and terminates on a circular import rather than looping forever', () => {
    const graph = fakeGraph({
      a: { importers: ['b'], importedIds: ['b'] },
      b: { importers: ['a'], importedIds: ['a'] },
    });

    const chain = buildImportChain('a', graph);

    expect(graph.warn).toHaveBeenCalledTimes(1);
    expect(graph.warn.mock.calls[0][0]).toContain('Circular import detected');

    // BUG: formatting the warning above calls `chain.reverse()`, which mutates
    // in place, so the final `chain.reverse()` in `buildImportChain` undoes it.
    // Circular chains are therefore returned leaf-first, while every other
    // chain is returned entry-first. Pinned here as the behaviour that ships;
    // fixing it belongs in a change that can carry a changeset.
    expect(chain).toEqual([
      ['a', -1],
      ['b', 0],
    ]);
  });
});

describe('sortModules', () => {
  it('orders modules by their position in the importing module', () => {
    const modules: Record<string, ImportChain> = {
      second: [
        ['entry', 1],
        ['second', -1],
      ],
      first: [
        ['entry', 0],
        ['first', -1],
      ],
    };

    expect(sortModules(modules)).toEqual(['first', 'second']);
  });

  it('orders by the first point at which two chains diverge', () => {
    const modules: Record<string, ImportChain> = {
      lateBranch: [
        ['entry', 1],
        ['b.ts', 0],
        ['lateBranch', -1],
      ],
      earlyBranch: [
        ['entry', 0],
        ['a.ts', 5],
        ['earlyBranch', -1],
      ],
    };

    // `entry` order decides it; the deeper positions are never reached.
    expect(sortModules(modules)).toEqual(['earlyBranch', 'lateBranch']);
  });

  it('keeps a module ahead of one nested deeper beneath it', () => {
    const modules: Record<string, ImportChain> = {
      nested: [
        ['entry', 0],
        ['shared.ts', 1],
        ['nested', -1],
      ],
      direct: [
        ['entry', 0],
        ['shared.ts', 0],
        ['direct', -1],
      ],
    };

    expect(sortModules(modules)).toEqual(['direct', 'nested']);
  });

  it('preserves input order for chains that never diverge', () => {
    const chain: ImportChain = [
      ['entry', 0],
      ['x', -1],
    ];

    expect(sortModules({ a: chain, b: chain })).toEqual(['a', 'b']);
  });
});

describe('tryGetPackageName', () => {
  it('reads the name from the package.json at the given cwd', async () => {
    const cwd = path.dirname(require.resolve('@fixtures/themed/package.json'));

    await expect(tryGetPackageName(cwd)).resolves.toBe('@fixtures/themed');
  });

  it('resolves to null when there is no package.json to read', async () => {
    const cwd = path.join(__dirname, 'does-not-exist');

    await expect(tryGetPackageName(cwd)).resolves.toBeNull();
  });
});
