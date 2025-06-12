import fs from 'fs/promises';
import path from 'path';

import { glob } from 'tinyglobby';

const packages = await glob('packages/*', {
  onlyDirectories: true,
  absolute: true,
  ignore: ['packages/sprinkles', 'packages/integration', 'packages/compiler'],
  expandDirectories: false,
});

for (const packageDir of packages) {
  await fs.copyFile(
    path.join(import.meta.dirname, '../README.md'),
    path.join(packageDir, 'README.md'),
  );
}
