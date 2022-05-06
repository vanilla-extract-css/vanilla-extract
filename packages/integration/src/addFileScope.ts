import { posix, relative, sep } from 'path';

interface AddFileScopeParams {
  source: string;
  filePath: string;
  rootPath: string;
  packageName: string;
}
export function addFileScope({
  source,
  filePath,
  rootPath,
  packageName,
}: AddFileScopeParams) {
  // Encode windows file paths as posix
  const normalizedPath = posix.join(...relative(rootPath, filePath).split(sep));

  if (source.indexOf('@vanilla-extract/css/fileScope') > -1) {
    return source.replace(
      /setFileScope\(((\n|.)*?)\)/,
      `setFileScope("${normalizedPath}", "${packageName}")`,
    );
  }

  return `
    import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
    setFileScope("${normalizedPath}", "${packageName}");
    ${source}
    endFileScope();
  `;
}
