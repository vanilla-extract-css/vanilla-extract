import { posix } from 'path';
import { pathToFileURL } from 'url';

interface AddFileScopeParams {
  source: string;
  filePath: string;
  rootPath: string;
  packageName: string;
  target?: 'library' | 'app';
}
export function addFileScope({
  source,
  filePath,
  rootPath,
  packageName,
  target = 'app',
}: AddFileScopeParams) {
  const fileUrl =
    target === 'library'
      ? 'import.meta.url'
      : JSON.stringify(pathToFileURL(filePath));

  if (source.indexOf('@vanilla-extract/css/fileScope') > -1) {
    return source.replace(/setFileScope\(((\n|.)*?)\)/, (_, params: string) => {
      const paramList = params
        .split(',')
        .map((param) => param.trim())
        .filter(Boolean);

      const fixedParams = [
        paramList[0],
        paramList[1] || 'undefined',
        fileUrl,
      ].join(', ');

      return `setFileScope(${fixedParams})`;
    });
  }

  const rootRelativeFilePath = posix.relative(rootPath, filePath);

  return `
    import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
    setFileScope("${rootRelativeFilePath}", "${packageName}", ${fileUrl});
    ${source}
    endFileScope();
  `;
}
