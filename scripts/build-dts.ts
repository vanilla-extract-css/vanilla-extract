import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import glob from 'fast-glob';
import { legacy, resolve } from 'resolve.exports';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
import { externals } from 'rollup-plugin-node-externals';

function resolveEntry<PackageJson>(pkg: PackageJson, entryName?: string) {
  const entryPath = entryName
    ? resolve(pkg, entryName, { conditions: ['node', 'default'] })
    : legacy(pkg, { browser: false, fields: ['main'] })!;

  if (!entryPath) {
    throw new Error('No entry found. Invalid package.json?');
  }

  return entryPath;
}

async function buildEntry(packageDir: string, entryPath: string) {
  const dtsEntryPathAbsolute = path
    .join(packageDir, entryPath)
    .replace(path.extname(entryPath), '.d.ts');
  const dtsEntryPath = path.relative(process.cwd(), dtsEntryPathAbsolute);
  const outDir = path.dirname(dtsEntryPath);

  if (!existsSync(dtsEntryPath)) return;

  console.log('Bundling', dtsEntryPath);

  try {
    const bundle = await rollup({
      input: dtsEntryPath,
      plugins: [
        externals({
          packagePath: path.resolve(packageDir, 'package.json'),
          deps: true,
          devDeps: false,
          exclude: ['@vanilla-extract/private'], // always bundle
          include: ['@jest/transform'], // don't bundle
        }),
        dts({
          compilerOptions: {
            incremental: false,
            noEmitOnError: false,
          },
          respectExternal: true,
        }),
      ],
    });

    await bundle.write({
      dir: outDir,
      entryFileNames: '[name].ts',
      minifyInternalExports: false,
    });

    await bundle.close();
  } catch (e: any) {
    console.error('Error bundling', dtsEntryPath);
    console.error(e);
    throw e;
  }
}

async function removePreconstructDeclarations(
  packageDir: string,
  entryPath: string,
) {
  await fs.rm(path.join(packageDir, entryPath, '../declarations'), {
    force: true,
    recursive: true,
  });
}

(async () => {
  const packages = await glob('packages/*', {
    onlyDirectories: true,
    absolute: true,
  });

  const entryPaths: [string, string][] = [];

  for (const packageDir of packages) {
    const pkg = require(path.resolve(packageDir, 'package.json'));

    if (pkg.exports) {
      const pkgExports = Object.keys(pkg.exports);

      for (const entryName of pkgExports) {
        if (entryName.endsWith('package.json')) continue;

        entryPaths.push([packageDir, resolveEntry(pkg, entryName)]);
      }
    } else {
      entryPaths.push([packageDir, resolveEntry(pkg)]);
    }
  }

  await Promise.all(
    entryPaths.map(([packageDir, entryPath]) =>
      buildEntry(packageDir, entryPath),
    ),
  );

  // Entry points might reference each other so remove old declaration files
  // after we're done with everything
  await Promise.all(
    entryPaths.map(([packageDir, entryPath]) =>
      removePreconstructDeclarations(packageDir, entryPath),
    ),
  );
})();
