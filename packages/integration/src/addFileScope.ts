import { posix, relative, sep } from 'path';
import type { PackageInfo } from './packageInfo';

interface AddFileScopeParams {
  source: string;
  filePath: string;
  packageInfo: PackageInfo;
}
export function addFileScope({
  source,
  filePath,
  packageInfo,
}: AddFileScopeParams) {
  if (source.indexOf('@vanilla-extract/css/fileScope') > -1) {
    return { source, updated: false };
  }

  // Encode windows file paths as posix
  const normalizedPath = posix.join(
    ...relative(packageInfo.dirname, filePath).split(sep),
  );

  const contents = `
    import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
    setFileScope("${normalizedPath}", ${
    packageInfo.name ? `"${packageInfo.name}"` : 'undefined'
  });
    ${source}
    endFileScope()
  `;

  return { source: contents, updated: true };
}
