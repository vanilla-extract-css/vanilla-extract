import fs from 'fs/promises';
import path from 'path';

import glob from 'fast-glob';

const packages = await glob('packages/*', {
  onlyDirectories: true,
  absolute: true,
  ignore: ['packages/sprinkles', 'packages/integration', 'packages/compiler'],
});

for (const packageDir of packages) {
  await fs.copyFile(
    path.join(import.meta.dirname, '../README.md'),
    path.join(packageDir, 'README.md'),
  );
}
