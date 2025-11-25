import fs from 'fs/promises';
import path from 'path';

const packagesGlob = fs.glob('packages/*', {
  exclude: ['packages/sprinkles', 'packages/integration', 'packages/compiler'],
});

const rootReadmePath = path.join(import.meta.dirname, '../README.md');

for await (const packageDir of packagesGlob) {
  await fs.copyFile(rootReadmePath, path.join(packageDir, 'README.md'));
}
