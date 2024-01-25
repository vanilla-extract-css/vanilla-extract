import { dirname, join } from 'path';
import { promises as fs } from 'fs';

import {
  build as esbuild,
  Plugin,
  BuildOptions as EsbuildOptions,
} from 'esbuild';

import type { IdentifierOption } from './types';
import { cssFileFilter } from './filters';
import { transform } from './transform';
import { getPackageInfo } from './packageInfo';

interface VanillaExtractTransformPluginParams {
  identOption?: IdentifierOption;
}
export const vanillaExtractTransformPlugin = ({
  identOption,
}: VanillaExtractTransformPluginParams): Plugin => ({
  name: 'vanilla-extract-filescope',
  setup(build) {
    const packageInfo = getPackageInfo(build.initialOptions.absWorkingDir);

    build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
      const originalSource = await fs.readFile(path, 'utf-8');

      const source = await transform({
        source: originalSource,
        filePath: path,
        rootPath: build.initialOptions.absWorkingDir!,
        packageName: packageInfo.name,
        identOption:
          identOption ?? (build.initialOptions.minify ? 'short' : 'debug'),
      });

      return {
        contents: source,
        loader: path.match(/\.(ts|tsx)$/i) ? 'ts' : undefined,
        resolveDir: dirname(path),
      };
    });
  },
});

export interface CompileOptions {
  filePath: string;
  identOption: IdentifierOption;
  cwd?: string;
  esbuildOptions?: Pick<
    EsbuildOptions,
    'plugins' | 'external' | 'define' | 'loader' | 'tsconfig' | 'conditions'
  >;
}
export async function compile({
  filePath,
  identOption,
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
      vanillaExtractTransformPlugin({ identOption }),
      ...(esbuildOptions?.plugins ?? []),
    ],
    absWorkingDir: cwd,
    loader: esbuildOptions?.loader,
    define: esbuildOptions?.define,
    tsconfig: esbuildOptions?.tsconfig,
    conditions: esbuildOptions?.conditions,
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
