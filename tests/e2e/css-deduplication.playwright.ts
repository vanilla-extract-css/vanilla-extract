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
  test('shared globalStyle should only appear once in production build', async () => {
    const distDir = path.join(fixtureDir, 'dist');

    const cssFiles = globSync('**/*.css', { cwd: distDir });
    expect(cssFiles.length).toBeGreaterThan(0);

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
