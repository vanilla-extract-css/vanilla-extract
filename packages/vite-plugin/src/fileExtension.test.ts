import { describe, expect, it } from 'vitest';
import type { Plugin } from 'vite';

/**
 * Helper to create a minimal mock plugin context for testing transform hooks.
 */
function createMockPluginContext() {
  return {
    meta: { watchMode: false },
    moduleIds: [],
    getModuleIds: () => [][Symbol.iterator](),
    getModuleInfo: () => null,
    parse: () => ({}),
    resolve: async () => null,
    load: async () => ({ code: '' }),
    addWatchFile: () => {},
    emitFile: () => '',
    setAssetSource: () => {},
    getFileName: () => '',
    error: () => {},
    warn: () => {},
    getCombinedSourcemap: () => ({ mappings: '' }),
  };
}

describe('vanillaExtractPlugin fileExtension option (full extension)', () => {
  /**
   * Test that the Options interface includes fileExtension.
   */
  it('accepts fileExtension option in plugin options type', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    const plugins = vanillaExtractPlugin({
      fileExtension: '.ve.ts',
    });

    expect(plugins).toBeDefined();
    expect(Array.isArray(plugins)).toBe(true);
  });

  /**
   * Test that transform returns null for .css.ts files when fileExtension is '.ve.ts'
   */
  it('does NOT process .css.ts files when fileExtension is set to .ve.ts', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    const plugins = vanillaExtractPlugin({
      fileExtension: '.ve.ts',
    });

    const mainPlugin = plugins.find(
      (p): p is Plugin => p.name === 'vite-plugin-vanilla-extract',
    );
    expect(mainPlugin).toBeDefined();
    expect(mainPlugin?.transform).toBeDefined();

    const transformFn = mainPlugin!.transform as Function;
    const mockContext = createMockPluginContext();

    const result = await transformFn.call(
      mockContext,
      'import { style } from "@vanilla-extract/css";',
      '/project/src/styles.css.ts',
    );

    // Should return null because .css.ts doesn't match .ve.ts
    expect(result).toBeNull();
  });

  /**
   * Test that transform DOES process .ve.ts files when fileExtension is '.ve.ts'
   */
  it('processes .ve.ts files when fileExtension is set to .ve.ts', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    const plugins = vanillaExtractPlugin({
      fileExtension: '.ve.ts',
    });

    const mainPlugin = plugins.find(
      (p): p is Plugin => p.name === 'vite-plugin-vanilla-extract',
    );
    expect(mainPlugin).toBeDefined();

    const transformFn = mainPlugin!.transform as Function;
    const mockContext = createMockPluginContext();

    // The transform should attempt to process .ve.ts files (will throw because no compiler,
    // but the key is it doesn't return null early like it would for non-matching files)
    let didAttemptTransform = false;
    try {
      await transformFn.call(
        mockContext,
        'import { style } from "@vanilla-extract/css";',
        '/project/src/styles.ve.ts',
      );
    } catch {
      // An error means the transform was attempted (compiler not set up)
      didAttemptTransform = true;
    }

    expect(didAttemptTransform).toBe(true);
  });

  /**
   * Test that .ve.tsx is NOT matched when only .ve.ts is specified
   */
  it('does NOT process .ve.tsx when only .ve.ts is specified', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    const plugins = vanillaExtractPlugin({
      fileExtension: '.ve.ts', // Only .ve.ts, not .ve.tsx
    });

    const mainPlugin = plugins.find(
      (p): p is Plugin => p.name === 'vite-plugin-vanilla-extract',
    );
    expect(mainPlugin).toBeDefined();

    const transformFn = mainPlugin!.transform as Function;
    const mockContext = createMockPluginContext();

    // .ve.tsx should NOT be matched since only .ve.ts was specified
    const result = await transformFn.call(
      mockContext,
      'export const x = 1;',
      '/project/src/styles.ve.tsx',
    );

    expect(result).toBeNull();
  });

  /**
   * Test that default behavior (no fileExtension) still processes .css.ts files
   */
  it('processes .css.ts files by default when fileExtension is not specified', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    const plugins = vanillaExtractPlugin({});

    const mainPlugin = plugins.find(
      (p): p is Plugin => p.name === 'vite-plugin-vanilla-extract',
    );
    expect(mainPlugin).toBeDefined();

    const transformFn = mainPlugin!.transform as Function;
    const mockContext = createMockPluginContext();

    let didAttemptTransform = false;
    try {
      await transformFn.call(
        mockContext,
        'import { style } from "@vanilla-extract/css";',
        '/project/src/styles.css.ts',
      );
    } catch {
      didAttemptTransform = true;
    }

    expect(didAttemptTransform).toBe(true);
  });

  /**
   * Test that multiple full extensions can be specified
   */
  it('supports array of full file extensions', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    const plugins = vanillaExtractPlugin({
      fileExtension: ['.ve.ts', '.ve.tsx', '.styles.ts'],
    });

    const mainPlugin = plugins.find(
      (p): p is Plugin => p.name === 'vite-plugin-vanilla-extract',
    );
    expect(mainPlugin).toBeDefined();

    const transformFn = mainPlugin!.transform as Function;
    const mockContext = createMockPluginContext();

    // .ve.ts should be processed
    let veAttempted = false;
    try {
      await transformFn.call(
        mockContext,
        'export const x = 1;',
        '/project/src/styles.ve.ts',
      );
    } catch {
      veAttempted = true;
    }
    expect(veAttempted).toBe(true);

    // .ve.tsx should be processed
    let veTsxAttempted = false;
    try {
      await transformFn.call(
        mockContext,
        'export const x = 1;',
        '/project/src/styles.ve.tsx',
      );
    } catch {
      veTsxAttempted = true;
    }
    expect(veTsxAttempted).toBe(true);

    // .styles.ts should be processed
    let stylesAttempted = false;
    try {
      await transformFn.call(
        mockContext,
        'export const x = 1;',
        '/project/src/button.styles.ts',
      );
    } catch {
      stylesAttempted = true;
    }
    expect(stylesAttempted).toBe(true);

    // .css.ts should NOT be processed
    const cssResult = await transformFn.call(
      mockContext,
      'export const x = 1;',
      '/project/src/styles.css.ts',
    );
    expect(cssResult).toBeNull();
  });

  /**
   * Test handling of Vite's ?used query parameter
   */
  it('handles Vite ?used query parameter', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    const plugins = vanillaExtractPlugin({
      fileExtension: '.ve.ts',
    });

    const mainPlugin = plugins.find(
      (p): p is Plugin => p.name === 'vite-plugin-vanilla-extract',
    );
    expect(mainPlugin).toBeDefined();

    const transformFn = mainPlugin!.transform as Function;
    const mockContext = createMockPluginContext();

    // Files with ?used should still be processed (Vite adds this)
    let didAttemptTransform = false;
    try {
      await transformFn.call(
        mockContext,
        'export const x = 1;',
        '/project/src/styles.ve.ts?used',
      );
    } catch {
      didAttemptTransform = true;
    }

    expect(didAttemptTransform).toBe(true);
  });
});

describe('DEFAULT_FILE_EXTENSIONS', () => {
  it('exports DEFAULT_FILE_EXTENSIONS constant', async () => {
    const { DEFAULT_FILE_EXTENSIONS } = await import('./index');

    expect(DEFAULT_FILE_EXTENSIONS).toBeDefined();
    expect(Array.isArray(DEFAULT_FILE_EXTENSIONS)).toBe(true);
  });

  it('contains all standard vanilla-extract extensions', async () => {
    const { DEFAULT_FILE_EXTENSIONS } = await import('./index');

    expect(DEFAULT_FILE_EXTENSIONS).toContain('.css.ts');
    expect(DEFAULT_FILE_EXTENSIONS).toContain('.css.tsx');
    expect(DEFAULT_FILE_EXTENSIONS).toContain('.css.js');
    expect(DEFAULT_FILE_EXTENSIONS).toContain('.css.jsx');
    expect(DEFAULT_FILE_EXTENSIONS).toContain('.css.mjs');
    expect(DEFAULT_FILE_EXTENSIONS).toContain('.css.cjs');
  });

  it('can be spread with custom extensions', async () => {
    const { vanillaExtractPlugin, DEFAULT_FILE_EXTENSIONS } = await import(
      './index'
    );

    // Should work with spread operator to combine defaults + custom
    const plugins = vanillaExtractPlugin({
      fileExtension: [...DEFAULT_FILE_EXTENSIONS, '.ve.ts', '.ve.tsx'],
    });

    expect(plugins).toBeDefined();
    expect(Array.isArray(plugins)).toBe(true);
  });

  it('processes default extensions when combined with custom ones', async () => {
    const { vanillaExtractPlugin, DEFAULT_FILE_EXTENSIONS } = await import(
      './index'
    );

    const plugins = vanillaExtractPlugin({
      fileExtension: [...DEFAULT_FILE_EXTENSIONS, '.ve.ts'],
    });

    const mainPlugin = plugins.find(
      (p): p is Plugin => p.name === 'vite-plugin-vanilla-extract',
    );
    expect(mainPlugin).toBeDefined();

    const transformFn = mainPlugin!.transform as Function;
    const mockContext = createMockPluginContext();

    // .css.ts should still be processed
    let cssAttempted = false;
    try {
      await transformFn.call(
        mockContext,
        'export const x = 1;',
        '/project/src/styles.css.ts',
      );
    } catch {
      cssAttempted = true;
    }
    expect(cssAttempted).toBe(true);

    // .ve.ts should also be processed
    let veAttempted = false;
    try {
      await transformFn.call(
        mockContext,
        'export const x = 1;',
        '/project/src/styles.ve.ts',
      );
    } catch {
      veAttempted = true;
    }
    expect(veAttempted).toBe(true);
  });
});
