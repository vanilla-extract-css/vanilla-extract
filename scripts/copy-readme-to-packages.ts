import fs from 'fs/promises';
import path from 'path';

import glob from 'fast-glob';

(async () => {
  const packages = await glob('packages/*', {
    onlyDirectories: true,
    absolute: true,
    ignore: ['packages/sprinkles', 'packages/integration'],
  });

  for (const packageDir of packages) {
    await fs.copyFile(
      path.join(__dirname, '../README.md'),
      path.join(packageDir, 'README.md'),
    );
  }
})();
