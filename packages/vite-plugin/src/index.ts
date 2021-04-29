import type { Plugin, ResolvedConfig } from 'vite';
import { build as esbuild } from 'esbuild';
import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
} from '@vanilla-extract/integration';
import { vanillaExtractFilescopePlugin } from '@vanilla-extract/esbuild-plugin';

export default function vanillaExtractPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'vite:vanilla-extract',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    resolveId(id) {
      if (virtualCssFileFilter.test(id)) {
        return id;
      }
    },
    async load(id, ssr) {
      if (cssFileFilter.test(id)) {
        const fileScopePlugin = vanillaExtractFilescopePlugin();
        const result = await esbuild({
          entryPoints: [id],
          metafile: true,
          bundle: true,
          external: ['@vanilla-extract'],
          platform: 'node',
          write: false,
          plugins: [fileScopePlugin],
          absWorkingDir: config.root,
        });

        const { outputFiles, metafile } = result;

        if (!outputFiles || outputFiles.length !== 1) {
          throw new Error('Invalid child compilation');
        }

        for (const file in metafile?.inputs) {
          this.addWatchFile(file);
        }

        return processVanillaFile({
          source: outputFiles[0].text,
          filePath: id,
          outputCss: !ssr,
        });
      }

      if (virtualCssFileFilter.test(id)) {
        return getSourceFromVirtualCssFile(id);
      }

      return null;
    },
  };
}
