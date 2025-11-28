import { expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { globSync } from 'node:fs';
import path from 'path';

import test from './fixture';

const fixtureDir = path.resolve(
  __dirname,
  '../../fixtures/next-16-app-pages-router',
);

test.describe('CSS deduplication @agnostic', () => {
  const buildTypes = [
    { name: 'webpack', distDir: 'dist/webpack' },
    { name: 'turbopack', distDir: 'dist/turbo' },
  ];

  buildTypes.forEach(({ name, distDir: distDirName }) => {
    test(`shared globalStyle should only appear once in ${name} production build`, async () => {
      const distDir = path.join(fixtureDir, distDirName);

      const cssFiles = globSync('**/*.css', { cwd: distDir });
      expect(cssFiles.length).toBeGreaterThan(0);
      console.log(name, cssFiles);

      let totalOccurrences = 0;
      const cssPattern = /body\s*\{\s*background-color:\s*#0cdbcd;?\s*\}/g;

      for (const cssFile of cssFiles) {
        const content = readFileSync(path.join(distDir, cssFile), 'utf-8');
        const matches = content.match(cssPattern);
        if (matches) {
          totalOccurrences += matches.length;
        }
      }

      expect(totalOccurrences).toBe(1);
    });
  });
});
