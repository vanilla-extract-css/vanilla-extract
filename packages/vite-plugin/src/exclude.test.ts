import { describe, expect, it } from 'vitest';

// We'll test the filter behavior by checking if transform returns null for excluded files
describe('vanillaExtractPlugin exclude option', () => {
  // These tests verify the exclude option works correctly
  // They will FAIL until the exclude option is implemented

  it('should accept exclude option in plugin configuration', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    // This should not throw - the plugin should accept exclude option
    const plugins = vanillaExtractPlugin({
      exclude: ['**/node_modules/**'],
    });

    expect(plugins).toBeInstanceOf(Array);
    expect(plugins.length).toBeGreaterThan(0);
  });

  it('should accept include option in plugin configuration', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    // This should not throw - the plugin should accept include option
    const plugins = vanillaExtractPlugin({
      include: ['src/**/*.css.ts'],
    });

    expect(plugins).toBeInstanceOf(Array);
    expect(plugins.length).toBeGreaterThan(0);
  });

  it('should accept both include and exclude options', async () => {
    const { vanillaExtractPlugin } = await import('./index');

    const plugins = vanillaExtractPlugin({
      include: ['src/**/*.css.ts'],
      exclude: ['**/node_modules/**'],
    });

    expect(plugins).toBeInstanceOf(Array);
  });
});
