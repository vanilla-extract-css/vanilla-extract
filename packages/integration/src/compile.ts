import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import merge from 'ts-deepmerge';

import { build as esbuild, Plugin, BuildOptions as EsbuildOptions } from 'esbuild';

import { cssFileFilter } from './filters';
import { addFileScope } from './addFileScope';

export const vanillaExtractFilescopePlugin = (): Plugin => ({
  name: 'vanilla-extract-filescope',
  setup(build) {
    build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
      const originalSource = await fs.readFile(path, 'utf-8');

      const source = addFileScope({
        source: originalSource,
        filePath: path,
        rootPath: build.initialOptions.absWorkingDir!,
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
  externals?: Array<string>;
  esbuildOptions?: EsbuildOptions;
}
export async function compile({
  filePath,
  cwd = process.cwd(),
  externals = [],
  esbuildOptions,
}: CompileOptions) {

  const baseOptions: EsbuildOptions = {
    entryPoints: [filePath],
    metafile: true,
    bundle: true,
    external: ['@vanilla-extract', ...externals],
    platform: 'node',
    write: false,
    plugins: [vanillaExtractFilescopePlugin()],
    absWorkingDir: cwd,
  };


  const resolvedOptions = merge(baseOptions, esbuildOptions ?? {});

  const result = await esbuild(resolvedOptions);

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
