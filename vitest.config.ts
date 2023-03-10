import { defineConfig } from 'vitest/config';
import { join, dirname, basename } from 'path';

export default defineConfig({
  test: {
    include: ['**/*.vitest.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    resolveSnapshotPath: (testPath, snapExtension) => {
      return join(
        join(dirname(testPath), '__vitestSnapshots__'),
        `${basename(testPath)}${snapExtension}`,
      );
    },
  },
});
