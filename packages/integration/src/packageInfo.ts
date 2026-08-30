import path from 'path';

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

const packageInfoCache = new Map<string, PackageInfo>();

export function getPackageInfo(cwd?: string | null): PackageInfo | undefined {
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

  if (!packageInfo || !packageInfo.name) {
    return undefined;
  }

  packageInfoCache.set(resolvedCwd, packageInfo);

  return packageInfo;
}
