import { dirname, join } from 'path';
import { promises as fs } from 'fs';

import { build as esbuild, Plugin } from 'esbuild';

import { cssFileFilter } from './filters';
import { getPackageInfo } from './packageInfo';
import { addFileScope } from './addFileScope';

export const vanillaExtractFilescopePlugin = (): Plugin => ({
  name: 'vanilla-extract-filescope',
  setup(build) {
    const packageInfo = getPackageInfo(build.initialOptions.absWorkingDir);

    build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
      const originalSource = await fs.readFile(path, 'utf-8');

      const { source, updated } = addFileScope({
        source: originalSource,
        filePath: path,
        packageInfo,
      });

      if (updated) {
        return {
          contents: source,
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
    source: outputFiles[0].text
      .replace(new RegExp('__' + 'filename', 'g'), JSON.stringify(filePath))
      .replace(
        new RegExp('__' + 'dirname', 'g'),
        JSON.stringify(dirname(filePath)),
      ),
    watchFiles: Object.keys(metafile?.inputs || {}).map((filePath) =>
      join(cwd, filePath),
    ),
  };
}
