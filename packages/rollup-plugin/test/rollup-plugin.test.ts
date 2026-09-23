import { describe, expect, it } from 'vitest';
import path from 'path';

import { BUNDLERS, bundle, fixtureRoot } from './helpers';

/**
 * Strips content hashes from asset names and scope hashes from identifiers, so
 * two builds can be compared on the CSS they describe rather than on hashes
 * that are expected to differ.
 */
const withoutHashes = (assets: Array<[string, string]>) =>
  assets
    .map(
      ([name, css]) =>
        [
          name.replace(/-[\w-]{8,}(\.\w+)$/, '-[hash]$1'),
          css.replace(/__[a-z0-9]+\b/g, '__[hash]'),
        ] as [string, string],
    )
    .sort((a, b) => a.join().localeCompare(b.join()));

/**
 * Every case runs against both bundlers. Where behaviour legitimately differs,
 * the difference is expressed as an option override rather than a forked test,
 * so the two can never silently drift apart.
 */
describe.each(BUNDLERS)('%s', (bundler) => {
  describe('CSS asset emission', () => {
    it('bundles all CSS into shared assets alongside a single JS chunk', async () => {
      const result = await bundle({
        bundler,
        fixture: 'themed',
        output: { format: 'esm' },
      });

      expect(result.jsChunks()).toHaveLength(1);
      expect(result.cssAssets()).toMatchSnapshot();
    });

    it('emits a CSS asset per module when preserveModules is enabled', async () => {
      const result = await bundle({
        bundler,
        fixture: 'themed',
        output: { format: 'esm', preserveModules: true },
      });

      expect(result.jsChunks().length).toBeGreaterThan(1);
      expect(result.cssAssets()).toMatchSnapshot();
    });

    it('places CSS assets alongside JS modules when assetFileNames is customised', async () => {
      const result = await bundle({
        bundler,
        fixture: 'themed',
        output: {
          format: 'esm',
          preserveModules: true,
          preserveModulesRoot: path.join(fixtureRoot('themed'), 'src'),
          assetFileNames({ names }) {
            return names[0]?.replace(/^src\//, '') ?? '';
          },
        },
      });

      // Default behaviour would nest these under `assets/`.
      for (const name of result.cssAssetNames()) {
        expect(name).not.toMatch(/^assets\//);
      }
      expect(result.cssAssets()).toMatchSnapshot();
    });

    it('rewrites CSS imports to relative paths resolving to emitted assets', async () => {
      const result = await bundle({
        bundler,
        fixture: 'themed',
        output: { format: 'esm', preserveModules: true },
      });

      const specifiers = result.allCssImportSpecifiers();
      // Guard against the assertions below passing vacuously.
      expect(specifiers.length).toBeGreaterThan(0);

      for (const [, specifier] of specifiers) {
        // Bare or absolute specifiers break consumers of the output bundle.
        expect(specifier).toMatch(/^\.{1,2}\//);
      }

      // Every rewritten import must point at a file that was actually emitted.
      const targets = new Set(
        result
          .jsChunks()
          .flatMap(([chunkName]) => result.resolvedCssImports(chunkName)),
      );
      for (const target of targets) {
        expect(result.fileNames).toContain(target);
      }
    });
  });

  describe('extract', () => {
    const extractBuild = (plugin: { name?: string; sourcemap?: boolean }) =>
      bundle({
        bundler,
        fixture: 'react-library-example',
        plugin: { extract: plugin },
        input: { app: 'src/index.ts' },
        external: ['clsx', 'react', 'react/jsx-runtime', 'react-dom'],
        output: {
          format: 'esm',
          preserveModules: true,
          assetFileNames: '[name][extname]',
        },
      });

    it('emits a single CSS bundle instead of per-module assets', async () => {
      const result = await extractBuild({ name: 'app.css', sourcemap: true });

      expect(result.cssAssetNames()).toEqual(['app.css']);
      // The per-module virtual CSS must not leak into the output.
      expect(
        result.fileNames.filter((name) => name.includes('.css.ts.vanilla')),
      ).toHaveLength(0);
      expect(result.asset('app.css')).toMatchSnapshot();
    });

    it('defaults the bundle name to bundle.css', async () => {
      const result = await extractBuild({});

      expect(result.cssAssetNames()).toEqual(['bundle.css']);
    });

    it('removes CSS side-effect imports from JS chunks', async () => {
      const result = await extractBuild({ name: 'app.css' });

      expect(result.jsChunks().length).toBeGreaterThan(0);
      expect(result.allCssImportSpecifiers()).toEqual([]);
    });

    it('orders extracted CSS by the import order of the entry module', async () => {
      const result = await extractBuild({ name: 'app.css', sourcemap: true });

      const map = JSON.parse(result.asset('app.css.map'));
      expect(map.sources).toEqual([
        'src/styles/reset.css.ts.vanilla.css',
        'src/styles/vars.css.ts.vanilla.css',
        'src/button/button.css.ts.vanilla.css',
        'src/checkbox/checkbox.css.ts.vanilla.css',
        'src/radio/radio.css.ts.vanilla.css',
        // Imported last by the entry, so it must win the cascade.
        'src/styles/utility.css.ts.vanilla.css',
      ]);
    });

    it('omits the sourcemap unless extract.sourcemap is enabled', async () => {
      const result = await extractBuild({ name: 'app.css' });

      expect(result.fileNames).not.toContain('app.css.map');
    });
  });

  describe('unstable_injectFilescopes', () => {
    it('injects filescope calls instead of emitting CSS', async () => {
      const result = await bundle({
        bundler,
        fixture: 'themed',
        plugin: { unstable_injectFilescopes: true },
        output: { format: 'esm', preserveModules: true },
      });

      // Consumers process the .css.ts themselves, so nothing is emitted here.
      expect(result.cssAssets()).toEqual([]);
      expect(result.allCssImportSpecifiers()).toEqual([]);

      const styles = result.chunk('src/styles.css.js');
      expect(styles).toContain('setFileScope');
      expect(styles).toContain('endFileScope');
      expect(styles).toMatchSnapshot();
    });
  });

  describe('sourcemaps', () => {
    it('returns empty mappings for .css.ts modules and preserves them elsewhere', async () => {
      const result = await bundle({
        bundler,
        fixture: 'themed',
        output: { format: 'esm', preserveModules: true, sourcemap: true },
      });

      // The plugin deliberately returns empty mappings for compiled CSS
      // modules — their output bears no relation to the authored source.
      for (const [name] of result.jsChunks()) {
        if (name.endsWith('.css.js')) {
          expect(result.mappings(name)).toMatch(/^;*$/);
        }
      }

      // Non-CSS modules must keep working sourcemaps.
      expect(result.mappings('src/index.js')).not.toMatch(/^;*$/);
    });
  });

  describe('identifiers', () => {
    it('produces terse class names when identifiers is "short"', async () => {
      const result = await bundle({
        bundler,
        fixture: 'themed',
        plugin: { identifiers: 'short' },
        output: { format: 'esm', preserveModules: true },
      });

      const css = result
        .cssAssets()
        .map(([, source]) => source)
        .join('\n');
      expect(css).not.toMatch(/\.styles_button__/);
      expect(css).toMatch(/^\.[a-z0-9]+ \{/m);
    });
  });

  describe('third-party dependencies', () => {
    const thirdpartyOutput = {
      format: 'esm' as const,
      preserveModules: true,
      assetFileNames: 'assets/[name]-[hash][extname]',
    };

    it('compiles .css.mjs from nested node_modules packages', async () => {
      const result = await bundle({
        bundler,
        fixture: 'thirdparty',
        output: thirdpartyOutput,
      });

      expect(result.cssAssets()).toMatchSnapshot();
    });

    it('resolves the same third-party modules when cwd is nested below the package root', async () => {
      const nested = await bundle({
        bundler,
        fixture: 'thirdparty',
        cwd: path.join(fixtureRoot('thirdparty'), 'src'),
        output: thirdpartyOutput,
      });
      const fromRoot = await bundle({
        bundler,
        fixture: 'thirdparty',
        output: thirdpartyOutput,
      });

      // Identifier hashes are derived from each file's path relative to `cwd`,
      // so they legitimately differ between the two. What must not change is
      // which modules are found or what rules they produce.
      expect(withoutHashes(nested.cssAssets())).toEqual(
        withoutHashes(fromRoot.cssAssets()),
      );
    });
  });
});
