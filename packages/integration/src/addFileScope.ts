import { posix } from 'path';

type FilescopeTarget = 'esm' | 'cjs' | 'bundle';

interface AddFileScopeParams {
  source: string;
  filePath: string;
  rootPath: string;
  packageName: string;
  target?: FilescopeTarget;
}
export function addFileScope({
  source,
  filePath,
  rootPath,
  packageName,
  target = 'bundle',
}: AddFileScopeParams) {
  let fileScopePath;

  if (target === 'bundle') {
    // Encode windows file paths as posix
    fileScopePath = `"${posix.relative(rootPath, filePath)}"`;
  } else if (target === 'esm') {
    fileScopePath = 'import.meta.url';
  } else {
    fileScopePath = '__filename';
  }

  if (source.indexOf('@vanilla-extract/css/fileScope') > -1) {
    return source.replace(
      /setFileScope\(((\n|.)*?)\)/,
      `setFileScope(${fileScopePath}, "${packageName}")`,
    );
  }

  return `
    import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
    setFileScope(${fileScopePath}, "${packageName}");
    ${source}
    endFileScope();
  `;
}
