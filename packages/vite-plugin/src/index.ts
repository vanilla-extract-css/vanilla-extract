import path from 'path';
import type { Plugin, ResolvedConfig } from 'vite';
import { normalizePath } from 'vite';
import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  compile,
  hash,
  getPackageInfo,
  IdentifierOption,
} from '@vanilla-extract/integration';

interface Options {
  identifiers?: IdentifierOption;
}
export function vanillaExtractPlugin({ identifiers }: Options = {}): Plugin {
  let config: ResolvedConfig;
  let packageInfo: ReturnType<typeof getPackageInfo>;
  const cssMap = new Map<string, string>();

  return {
    name: 'vanilla-extract',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;

      packageInfo = getPackageInfo(config.root);
    },
    resolveId(id) {
      if (virtualCssFileFilter.test(id)) {
        const { fileName, source } = getSourceFromVirtualCssFile(id);

        // resolveId shouldn't really cause a side-effect however custom module meta isn't currently working
        // This is a hack work around until https://github.com/vitejs/vite/issues/3240 is resolved
        const shortHashFileName = normalizePath(
          `${fileName}?hash=${hash(source)}`,
        );
        cssMap.set(shortHashFileName, source);

        return shortHashFileName;
      }
    },
    load(id) {
      if (cssMap.has(id)) {
        const css = cssMap.get(id);

        cssMap.delete(id);

        return css;
      }

      return null;
    },
    async transform(code, id, ssr) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      if (ssr) {
        if (code.indexOf('@vanilla-extract/css/fileScope') > -1) {
          return code;
        }

        const filePath = normalizePath(path.relative(packageInfo.dirname, id));

        const packageName = packageInfo.name
          ? `"${packageInfo.name}"`
          : 'undefined';

        return `
          import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
          setFileScope("${filePath}", ${packageName});
          ${code}
          endFileScope();
        `;
      }

      const { source, watchFiles } = await compile({
        filePath: id,
        cwd: config.root,
      });

      for (const file of watchFiles) {
        this.addWatchFile(file);
      }

      return processVanillaFile({
        source,
        filePath: id,
        outputCss: !ssr,
        identOption:
          identifiers ?? (config.mode === 'production' ? 'short' : 'debug'),
      });
    },
  };
}
