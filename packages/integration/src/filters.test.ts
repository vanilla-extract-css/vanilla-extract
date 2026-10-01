import { describe, it, expect } from 'vitest';
import { cssFileFilter, DEFAULT_FILE_EXTENSIONS } from './filters';

describe('filters', () => {
  describe('DEFAULT_FILE_EXTENSIONS and cssFileFilter sync', () => {
    it('exports DEFAULT_FILE_EXTENSIONS', () => {
      expect(DEFAULT_FILE_EXTENSIONS).toBeDefined();
      expect(Array.isArray(DEFAULT_FILE_EXTENSIONS)).toBe(true);
    });

    it('cssFileFilter matches every extension in DEFAULT_FILE_EXTENSIONS', () => {
      for (const ext of DEFAULT_FILE_EXTENSIONS) {
        const testFile = `some/path/styles${ext}`;
        expect(cssFileFilter.test(testFile)).toBe(true);
      }
    });

    it('cssFileFilter matches every extension with ?used suffix', () => {
      for (const ext of DEFAULT_FILE_EXTENSIONS) {
        const testFile = `some/path/styles${ext}?used`;
        expect(cssFileFilter.test(testFile)).toBe(true);
      }
    });

    it('cssFileFilter does not match extensions outside DEFAULT_FILE_EXTENSIONS', () => {
      const nonMatchingExtensions = [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.css',
        '.scss',
        '.ve.ts',
        '.styles.ts',
      ];
      for (const ext of nonMatchingExtensions) {
        const testFile = `some/path/styles${ext}`;
        expect(cssFileFilter.test(testFile)).toBe(false);
      }
    });
  });
});
