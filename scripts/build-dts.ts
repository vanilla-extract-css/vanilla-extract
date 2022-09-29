import { build } from 'tsup';
import fs from 'fs/promises';
import path from 'path';

import { legacy, resolve } from 'resolve.exports';

import glob from 'fast-glob';

function resolveEntry<PackageJson>(pkg: PackageJson, entryName?: string) {
  const entryPath = entryName
    ? resolve(pkg, entryName, { conditions: ['node', 'default'] })
    : legacy(pkg, { browser: false, fields: ['main'] })!;

  if (!entryPath) {
    throw new Error('No entry found. Invalid package.json?');
  }

  return entryPath;
}

async function buildEntry(entryPath: string) {
  await build({
    dts: {
      only: true,
      compilerOptions: { incremental: false },
    },
    entry: [entryPath],
    outDir: path.dirname(entryPath),
  });
}

async function removeOldDeclarations(entryPath: string) {
  await fs.rm(path.join(entryPath, '../declarations'), {
    force: true,
    recursive: true,
  });
}

(async () => {
  const packages = await glob('packages/*', {
    onlyDirectories: true,
    absolute: true,
  });

  const entryPaths: string[] = [];

  for (const packageDir of packages) {
    const pkg = require(path.join(packageDir, 'package.json'));

    if (pkg.exports) {
      const pkgExports = Object.keys(pkg.exports);

      for (const entryName of pkgExports) {
        if (entryName.endsWith('package.json')) continue;

        entryPaths.push(path.join(packageDir, resolveEntry(pkg, entryName)));
      }
    } else {
      entryPaths.push(path.join(packageDir, resolveEntry(pkg)));
    }
  }

  await Promise.all(entryPaths.map(buildEntry));

  // Entry points might reference each other so remove old declaration files
  // after we're done with everything
  await Promise.all(entryPaths.map(removeOldDeclarations));
})();
