import { cssFileFilter } from '@vanilla-extract/integration';
import MagicString, { Bundle as MagicStringBundle } from 'magic-string';
import type { ModuleInfo, PluginContext } from 'rollup';
import { posix } from 'path';

/** Generate a CSS bundle from Rollup context */
export function generateCssBundle(
  plugin: Pick<PluginContext, 'getModuleIds' | 'getModuleInfo' | 'warn'>,
): {
  bundle: MagicStringBundle;
  extractedCssIds: Set<string>;
} {
  const cssBundle = new MagicStringBundle();
  const extractedCssIds = new Set<string>();

  // 1. identify CSS files to bundle
  const cssFiles: Record<string, ImportChain> = {};
  for (const id of plugin.getModuleIds()) {
    if (cssFileFilter.test(id)) {
      cssFiles[id] = buildImportChain(id, plugin);
    }
  }

  // 2. build bundle from import order
  for (const id of sortModules(cssFiles)) {
    const { importedIds } = plugin.getModuleInfo(id) ?? {};
    for (const importedId of importedIds ?? []) {
      const resolution = plugin.getModuleInfo(importedId);
      if (resolution?.meta.css && !extractedCssIds.has(resolution.id)) {
        extractedCssIds.add(resolution.id);
        cssBundle.addSource({
          filename: resolution.id,
          content: new MagicString(resolution.meta.css),
        });
      }
    }
  }

  return { bundle: cssBundle, extractedCssIds };
}

/** [id, order] tuple meant for ordering imports */
export type ImportChain = [id: string, order: number][];

/** Trace a file back through its importers, building an ordered list */
export function buildImportChain(
  id: string,
  plugin: Pick<PluginContext, 'getModuleInfo' | 'warn'>,
): ImportChain {
  let mod: ModuleInfo | null = plugin.getModuleInfo(id)!;
  if (!mod) {
    return [];
  }
  /** [id, order] */
  const chain: ImportChain = [[id, -1]];
  // resolve upwards to root entry
  while (!mod.isEntry) {
    const { id: currentId, importers } = mod;
    const lastImporterId = importers.at(-1);
    if (!lastImporterId) {
      break;
    }
    if (chain.some(([id]) => id === lastImporterId)) {
      plugin.warn(
        `Circular import detected. Can’t determine ideal import order of module.\n${chain
          .reverse()
          .join('\n  → ')}`,
      );
      break;
    }
    mod = plugin.getModuleInfo(lastImporterId);
    if (!mod) {
      break;
    }
    // importedIds preserves the import order within each module
    chain.push([lastImporterId, mod.importedIds.indexOf(currentId)]);
  }
  return chain.reverse();
}

/** Compare import chains to determine a flat ordering for modules */
export function sortModules(modules: Record<string, ImportChain>): string[] {
  const sortedModules = Object.entries(modules);

  // 2. sort CSS by import order
  sortedModules.sort(([_idA, chainA], [_idB, chainB]) => {
    const shorterChain = Math.min(chainA.length, chainB.length);
    for (let i = 0; i < shorterChain; i++) {
      const [moduleA, orderA] = chainA[i];
      const [moduleB, orderB] = chainB[i];
      // on same node, continue to next one
      if (moduleA === moduleB && orderA === orderB) {
        continue;
      }
      if (orderA !== orderB) {
        return orderA - orderB;
      }
    }
    return 0;
  });

  return sortedModules.map(([id]) => id);
}

const SIDE_EFFECT_IMPORT_RE = /^\s*import\s+['"]([^'"]+)['"]\s*;?\s*/gm;

/** Remove specific side effect imports from JS */
export function stripSideEffectImportsMatching(
  code: string,
  sources: string[],
): string {
  const matches = code.matchAll(SIDE_EFFECT_IMPORT_RE);
  if (!matches) {
    return code;
  }
  let output = code;
  for (const match of matches) {
    if (!match[1] || !sources.includes(match[1])) {
      continue;
    }
    output = output.replace(match[0], '');
  }
  return output;
}

export async function tryGetPackageName(cwd: string): Promise<string | null> {
  try {
    const packageJson = require(posix.join(cwd, 'package.json'));

    return packageJson?.name || null;
  } catch {
    return null;
  }
}
