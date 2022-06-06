import { dirname, join } from 'path';
import { promises as fs } from 'fs';

import {
  build as esbuild,
  Plugin,
  BuildOptions as EsbuildOptions,
} from 'esbuild';

import { cssFileFilter } from './filters';
import { addFileScope } from './addFileScope';
import { getPackageInfo } from './packageInfo';

export const vanillaExtractFilescopePlugin = (): Plugin => ({
  name: 'vanilla-extract-filescope',
  setup(build) {
    const packageInfo = getPackageInfo(build.initialOptions.absWorkingDir);

    build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
      const originalSource = await fs.readFile(path, 'utf-8');

      const source = addFileScope({
        source: originalSource,
        filePath: path,
        rootPath: build.initialOptions.absWorkingDir!,
        packageName: packageInfo.name,
      });

      return {
        contents: source,
        loader: path.match(/\.(ts|tsx)$/i) ? 'ts' : undefined,
        resolveDir: dirname(path),
      };
    });
  },
});

interface CompileOptions {
  filePath: string;
  cwd?: string;
  esbuildOptions?: Pick<
    EsbuildOptions,
    'plugins' | 'external' | 'define' | 'loader'
  >;
}
export async function compile({
  filePath,
  cwd = process.cwd(),
  esbuildOptions,
}: CompileOptions) {
  const result = await esbuild({
    entryPoints: [filePath],
    metafile: true,
    bundle: true,
    external: ['@vanilla-extract', ...(esbuildOptions?.external ?? [])],
    platform: 'node',
    write: false,
    plugins: [
      vanillaExtractFilescopePlugin(),
      ...(esbuildOptions?.plugins ?? []),
    ],
    absWorkingDir: cwd,
    loader: esbuildOptions?.loader,
    define: esbuildOptions?.define,
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
