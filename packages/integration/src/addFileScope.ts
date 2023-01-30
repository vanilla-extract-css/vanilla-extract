import { posix, relative, sep } from 'path';
import { detectSyntax } from 'mlly';

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

  const { hasESM, isMixed } = detectSyntax(source);

  if (hasESM && !isMixed) {
    return `
      import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
      setFileScope("${normalizedPath}", "${packageName}");
      ${source}
      endFileScope();
    `;
  }

  return `
    const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
    __vanilla_filescope__.setFileScope("${normalizedPath}", "${packageName}");
    ${source}
    __vanilla_filescope__.endFileScope();
  `;
}
