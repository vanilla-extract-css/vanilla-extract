import { cssFileFilter } from '@vanilla-extract/integration';
import MagicString, { Bundle as MagicStringBundle } from 'magic-string';

/**
 * Machinery for the `extract` option, ported from
 * `@vanilla-extract/rollup-plugin/src/lib.ts` so the Vite plugin stays
 * self-contained. behavioural changes here should generally be mirrored
 * there.
 *
 * Deliberate divergences: the side-effect import regex below must also match
 * Vite's minified single-line output, and the compiled CSS is narrowed with
 * `typeof css === 'string'` rather than a truthy check to satisfy Vite 8's
 * (rolldown) module meta typing.
 */

/**
 * Minimal structural types for the parts of the bundler plugin context used
 * below, so this module doesn't need to depend on bundler types directly.
 */
interface VanillaModuleInfo {
  id: string;
  isEntry: boolean;
  /** The ids of the modules importing this module */
  importers: readonly string[];
  /** The ids of the modules imported by this module, in import order */
  importedIds: readonly string[];
  /** Custom plugin options, e.g. `meta.css` for extracted CSS */
  meta: Record<string, unknown>;
}

interface CssBundlePluginContext {
  getModuleIds: () => Iterable<string>;
  getModuleInfo: (id: string) => VanillaModuleInfo | null;
  warn: (warning: string) => void;
}

/** Generate a CSS bundle from a Rollup context */
export function generateCssBundle(plugin: CssBundlePluginContext): {
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
      const css = resolution?.meta.css;

      if (
        resolution &&
        typeof css === 'string' &&
        !extractedCssIds.has(resolution.id)
      ) {
        extractedCssIds.add(resolution.id);
        cssBundle.addSource({
          filename: resolution.id,
          content: new MagicString(css),
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
  plugin: Pick<CssBundlePluginContext, 'getModuleInfo' | 'warn'>,
): ImportChain {
  let mod: VanillaModuleInfo | null = plugin.getModuleInfo(id);
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

// Matches side-effect `import '...'` / `require('...')` statements. Unlike the
// equivalent helper in the Rollup plugin, this is not anchored to the start of
// a line and allows no whitespace after `import`, so it also matches the
// minified single-line output Vite emits by default. The lookbehind ensures
// the keyword isn't part of a longer identifier (e.g. `foo.import`).
const SIDE_EFFECT_IMPORT_RE =
  /(?<![\w.$])(?:import\s*['"]([^'"]+)['"]\s*;?|require\s*\(\s*['"]([^'"]+)['"]\s*\)\s*;?)[ \t]*(?:\r?\n)?/g;

/** Remove specific side effect imports and requires from JS */
export const stripSideEffectImportsMatching = (
  code: string,
  sources: string[],
): string =>
  code.replace(SIDE_EFFECT_IMPORT_RE, (match, importSource, requireSource) =>
    sources.includes(importSource ?? requireSource) ? '' : match,
  );
