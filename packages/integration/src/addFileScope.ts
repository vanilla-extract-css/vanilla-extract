import { posix, relative, win32 } from 'path';
import { detectSyntax } from 'mlly';
import dedent from 'dedent';

// Inlined from @rollup/pluginutils
// https://github.com/rollup/plugins/blob/33174f956304ab4aad4bbaba656f627c31679dc5/packages/pluginutils/src/normalizePath.ts#L5-L7
export const normalizePath = (filename: string) =>
  filename.split(win32.sep).join(posix.sep);

interface AddFileScopeParams {
  source: string;
  filePath: string;
  rootPath: string;
  packageName: string;
  globalAdapterIdentifier?: string;
}
export function addFileScope({
  source,
  filePath,
  rootPath,
  packageName,
  globalAdapterIdentifier,
}: AddFileScopeParams) {
  // Encode windows file paths as posix
  const normalizedPath = normalizePath(relative(rootPath, filePath));

  const { hasESM, isMixed } = detectSyntax(source);

  if (source.includes('@vanilla-extract/css/fileScope')) {
    source = source.replace(
      /setFileScope\(((\n|.)*?)\)/,
      `setFileScope("${normalizedPath}", "${packageName}")`,
    );
  } else {
    if (hasESM && !isMixed) {
      source = dedent(`
        import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
        setFileScope("${normalizedPath}", "${packageName}");
        ${source}
        endFileScope();
      `);
    } else {
      source = dedent(`
        const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
        __vanilla_filescope__.setFileScope("${normalizedPath}", "${packageName}");
        ${source}
        __vanilla_filescope__.endFileScope();
      `);
    }
  }

  if (globalAdapterIdentifier) {
    const adapterImport =
      hasESM && !isMixed
        ? 'import * as __vanilla_css_adapter__ from "@vanilla-extract/css/adapter";'
        : 'const __vanilla_css_adapter__ = require("@vanilla-extract/css/adapter");';

    source = dedent(`
      ${adapterImport}
      __vanilla_css_adapter__.setAdapter(${globalAdapterIdentifier});
      ${source}
      __vanilla_css_adapter__.removeAdapter();
    `);
  }

  return source;
}
