import path from 'path';
import json5 from 'json5';
import fs from 'node:fs';
import findUp from 'find-up';

export interface PackageInfo {
  name: string;
  path: string;
  dirname: string;
}

function getClosestPackageInfo(directory: string): PackageInfo | undefined {
  const packageJsonPath = findUp.sync('package.json', {
    cwd: directory,
  });

  if (packageJsonPath) {
    const { name } = require(packageJsonPath);

    return {
      name,
      path: packageJsonPath,
      dirname: path.dirname(packageJsonPath),
    };
  }
}

function getClosestDenoJson(directory: string): PackageInfo | undefined {
  const denoJsonPath = findUp.sync(['deno.json', 'deno.jsonc'], {
    cwd: directory,
  });

  if (denoJsonPath) {
    const { name } = json5.parse(fs.readFileSync(denoJsonPath, 'utf-8'));

    return {
      name,
      path: denoJsonPath,
      dirname: path.dirname(denoJsonPath),
    };
  }
}

const isDeno = typeof process.versions.deno === 'string';
const packageInfoCache = new Map<string, PackageInfo>();

export function getPackageInfo(cwd?: string | null): PackageInfo {
  const resolvedCwd = cwd ?? process.cwd();
  const cachedValue = packageInfoCache.get(resolvedCwd);

  if (cachedValue) {
    return cachedValue;
  }

  let packageInfo: PackageInfo | undefined;

  // Deno projects don't necessarily have a package.json
  if (isDeno) {
    packageInfo = getClosestDenoJson(resolvedCwd);

    // No need to look further as nested deno.json files is not supported
    // in Deno without being a workspace member. If they are a workspace
    // member, they are expected to have the `name` field anyway.
  }

  if (!packageInfo) {
    packageInfo = getClosestPackageInfo(resolvedCwd);

    while (packageInfo && !packageInfo.name) {
      packageInfo = getClosestPackageInfo(
        path.resolve(packageInfo.dirname, '..'),
      );
    }
  }

  if (!packageInfo || !packageInfo.name) {
    if (isDeno) {
      throw new Error(
        `Couldn't find parent deno.json, deno.jsonc or package.json with a name field from '${resolvedCwd}'`,
      );
    }

    throw new Error(
      `Couldn't find parent package.json with a name field from '${resolvedCwd}'`,
    );
  }

  packageInfoCache.set(resolvedCwd, packageInfo);

  return packageInfo;
}
