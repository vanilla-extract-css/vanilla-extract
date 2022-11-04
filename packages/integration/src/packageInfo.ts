import path from 'path';

import findUp from 'find-up';

export interface PackageInfo {
  name: string;
  path: string;
  dirname: string;
}

function getClosestPackageInfo(directory: string) {
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

const packageInfoCache = new Map<string, PackageInfo>();

export function getPackageInfo(cwd?: string | null): PackageInfo {
  const resolvedCwd = cwd ?? process.cwd();
  const cachedValue = packageInfoCache.get(resolvedCwd);

  if (cachedValue) {
    return cachedValue;
  }

  let packageInfo = getClosestPackageInfo(resolvedCwd);

  while (packageInfo && !packageInfo.name) {
    packageInfo = getClosestPackageInfo(
      path.resolve(packageInfo.dirname, '..'),
    );
  }

  if (!packageInfo) {
    throw new Error(`Couldn't find parent package.json from '${resolvedCwd}'`);
  }

  if (!packageInfo.name) {
    throw new Error(`Please, Set the name field in package.json`);
  }

  packageInfoCache.set(resolvedCwd, packageInfo);

  return packageInfo;
}
