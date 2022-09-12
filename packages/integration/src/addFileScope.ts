import { posix } from 'path';

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
  if (source.indexOf('@vanilla-extract/css/fileScope') > -1) {
    return source;
  }

  const rootRelativeFilePath = posix.relative(rootPath, filePath);

  return `
    import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
    setFileScope("${rootRelativeFilePath}", "${packageName}", import.meta.url);
    ${source}
    endFileScope();
  `;
}
