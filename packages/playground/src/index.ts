// importing directly from source so we don't bundle esbuild
import { processVanillaFile } from '@vanilla-extract/integration/src/processVanillaFile';
import { virtualCssFileFilter } from '@vanilla-extract/integration/src/filters';
import { getSourceFromVirtualCssFile } from '@vanilla-extract/integration/src/virtualFile';
import { transform } from '@vanilla-extract/integration/src/transform';
import type { IdentifierOption } from '@vanilla-extract/integration/src/types';
import {
  initialize,
  build as esbuild,
  type Plugin,
  type BuildOptions as EsbuildOptions,
  type BuildResult as EsbuildResult,
} from 'esbuild-wasm';

let CWD = '';

const runEsbuild = async (esbuildOptions: EsbuildOptions) =>
  esbuild({
    metafile: true,
    bundle: true,
    external: ['@vanilla-extract', ...(esbuildOptions?.external ?? [])],
    platform: 'node',
    write: false,
    absWorkingDir: CWD,
    ...esbuildOptions,
  });
const getEsbuildResult = (result: EsbuildResult) => {
  const { outputFiles } = result;

  if (!outputFiles || outputFiles.length !== 1) {
    throw new Error('Invalid child compilation');
  }

  return outputFiles[0].text;
};

interface TransformFileScopeParams {
  input: string;
  filePath: string;
  identOption: IdentifierOption;
}
async function transformFileScope({
  input,
  filePath,
  identOption,
}: TransformFileScopeParams) {
  const vanillaExtractTransformPlugin = ({
    identOption,
  }: Pick<TransformFileScopeParams, 'identOption'>): Plugin => ({
    name: 'playground-filescope',
    setup(build) {
      build.onResolve({ filter: /^<stdin>$/ }, () => {
        return { path: filePath, namespace: 'stdin' };
      });

      build.onLoad({ filter: /.*/, namespace: 'stdin' }, async ({ path }) => {
        const source = await transform({
          source: input,
          filePath: path,
          rootPath: build.initialOptions.absWorkingDir!,
          packageName: 'playground',
          identOption: identOption,
        });

        return {
          contents: source,
          loader: 'ts',
          resolveDir: CWD,
        };
      });
    },
  });

  const result = await runEsbuild({
    entryPoints: ['<stdin>'],
    plugins: [vanillaExtractTransformPlugin({ identOption })],
  });

  return getEsbuildResult(result);
}

export interface CompileOptions {
  mode?: 'client' | 'server';
  input: string;
  filePath: string;
  identifiers?: IdentifierOption;
}

const extractCss = async ({ input, filePath }: CompileOptions) => {
  let extractedCss = '';

  const vanillaExtractCssPlugin = (): Plugin => ({
    name: 'playground-css',
    setup(build) {
      build.onResolve({ filter: virtualCssFileFilter }, async ({ path }) => {
        const { fileName: _fileName, source } =
          await getSourceFromVirtualCssFile(path);

        extractedCss = source;

        return { path, external: true };
      });
    },
  });

  const result = await runEsbuild({
    stdin: {
      contents: input,
      sourcefile: filePath,
      loader: 'ts',
      resolveDir: CWD,
    },
    plugins: [vanillaExtractCssPlugin()],
  });

  getEsbuildResult(result);

  return extractedCss;
};

export const init = initialize({
  wasmURL: './node_modules/esbuild-wasm/esbuild.wasm',
});

export async function compile({
  mode = 'server',
  input,
  filePath,
  identifiers = 'debug',
}: CompileOptions) {
  CWD = mode === 'server' ? process.cwd() : '/dummy';
  filePath = `${CWD}/${filePath}`;

  const source = await transformFileScope({
    input,
    filePath,
    identOption: identifiers,
  });

  // console.log('source:', source);

  const output = await processVanillaFile({
    source,
    filePath,
    identOption: identifiers,
  });

  // console.log('output:', output);

  const css = await extractCss({
    input: output,
    filePath,
  });

  return { css };
}
