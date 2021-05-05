import path from 'path';

import findUp from 'find-up';

interface PackageInfo {
  name: string;
  path: string;
  dirname: string;
}

const packageInfoCache = new Map<string, PackageInfo>();

export function getPackageInfo(cwd?: string | null): PackageInfo {
  const resolvedCwd = cwd ?? process.cwd();
  const cachedValue = packageInfoCache.get(resolvedCwd);

  if (cachedValue) {
    return cachedValue;
  }

  const packageJsonPath = findUp.sync('package.json', {
    cwd: resolvedCwd,
  });

  if (!packageJsonPath) {
    throw new Error(`Can't find package.json`);
  }

  const { name } = require(packageJsonPath);

  const packageInfo = {
    name,
    path: packageJsonPath,
    dirname: path.dirname(packageJsonPath),
  };

  packageInfoCache.set(resolvedCwd, packageInfo);

  return packageInfo;
}
