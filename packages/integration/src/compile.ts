import { dirname, relative, join } from 'path';
import { promises as fs } from 'fs';

import { build as esbuild, Plugin } from 'esbuild';

import { cssFileFilter } from './filters';
import { getPackageInfo } from './packageInfo';

export const vanillaExtractFilescopePlugin = (): Plugin => ({
  name: 'vanilla-extract-filescope',
  setup(build) {
    const packageInfo = getPackageInfo(build.initialOptions.absWorkingDir);

    build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
      const originalSource = await fs.readFile(path, 'utf-8');

      if (originalSource.indexOf('@vanilla-extract/css/fileScope') === -1) {
        const filePath = relative(packageInfo.dirname, path);

        const contents = `
        import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
        setFileScope("${filePath}", ${
          packageInfo.name ? `"${packageInfo.name}"` : 'undefined'
        });

        ${originalSource}
        endFileScope()
        `;

        return {
          contents,
          loader: path.match(/\.(ts|tsx)$/i) ? 'ts' : undefined,
          resolveDir: dirname(path),
        };
      }
    });
  },
});

interface CompileOptions {
  filePath: string;
  cwd?: string;
  externals?: Array<string>;
}
export async function compile({
  filePath,
  cwd = process.cwd(),
  externals = [],
}: CompileOptions) {
  const result = await esbuild({
    entryPoints: [filePath],
    metafile: true,
    bundle: true,
    external: ['@vanilla-extract', ...externals],
    platform: 'node',
    write: false,
    plugins: [vanillaExtractFilescopePlugin()],
    absWorkingDir: cwd,
  });

  const { outputFiles, metafile } = result;

  if (!outputFiles || outputFiles.length !== 1) {
    throw new Error('Invalid child compilation');
  }

  return {
    source: outputFiles[0].text,
    watchFiles: Object.keys(metafile?.inputs || {}).map((filePath) =>
      join(cwd, filePath),
    ),
  };
}
