import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import glob from 'fast-glob';
import { legacy, resolve } from 'resolve.exports';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
import { nodeExternals } from 'rollup-plugin-node-externals';

function resolveEntry<PackageJson>(
  pkg: PackageJson,
  entryName?: string,
): string {
  const entryPath = entryName
    ? resolve(pkg, entryName, { browser: false, require: true })
    : legacy(pkg, { browser: false, fields: ['main'] })!;

  if (!entryPath || entryPath.length === 0) {
    throw new Error('No entry found. Invalid package.json?');
  }

  if (Array.isArray(entryPath)) {
    return entryPath[0];
  }

  return entryPath;
}

async function buildEntry(packageDir: string, entryPath: string) {
  const dtsEntryPathAbsolute = path
    .join(packageDir, entryPath)
    .replace(path.extname(entryPath), '.d.ts');
  const dtsEntryPath = path.relative(process.cwd(), dtsEntryPathAbsolute);
  const outDir = path.dirname(dtsEntryPath);

  if (!existsSync(dtsEntryPath)) {
    console.warn('Skipping', dtsEntryPath, '(Not Found)');
    return;
  }

  console.log('Bundling', dtsEntryPath);

  try {
    const bundle = await rollup({
      input: dtsEntryPath,
      plugins: [
        nodeExternals({
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

    // There is a chance that two `buildEntry`s  will run at the same time
    // and one will attempt to read while the other is writing. To fix that,
    // we'll defer the overwrite until all the bundles are ready
    return async () => {
      await bundle.write({
        dir: outDir,
        entryFileNames: '[name].ts',
        minifyInternalExports: false,
      });
      await bundle.close();
    };
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

const packages = await glob('packages/*', {
  onlyDirectories: true,
  absolute: true,
});

const entryPaths: [string, string][] = [];

for (const packageDir of packages) {
  const pkg = await import(path.resolve(packageDir, 'package.json'), {
    with: { type: 'json' },
  });

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
).then((writes) => writes.map((write) => write?.()));

// Entry points might reference each other so remove old declaration files
// after we're done with everything
await Promise.all(
  entryPaths.map(([packageDir, entryPath]) =>
    removePreconstructDeclarations(packageDir, entryPath),
  ),
);
