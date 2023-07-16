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

const CWD = process.cwd();

interface CompileOptions {
  input: string;
  filePath: string;
  identOption: IdentifierOption;
}

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

async function transformFileScope({
  input,
  filePath,
  identOption,
}: CompileOptions) {
  const vanillaExtractTransformPlugin = ({
    identOption,
  }: Pick<CompileOptions, 'identOption'>): Plugin => ({
    name: 'vanilla-extract-filescope',
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
          identOption:
            identOption ?? (build.initialOptions.minify ? 'short' : 'debug'),
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

type Options = {
  input: string;
  filePath: string;
  identifiers?: IdentifierOption;
};

const extractCss = async ({ input, filePath }: Options) => {
  let extractedCss: string = '';

  const vanillaExtractCssPlugin = (): Plugin => ({
    name: 'vanilla-extract-css',
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

export { initialize };

export async function compile({
  input,
  filePath,
  identifiers = 'debug',
}: Options) {
  filePath = `${CWD}/${filePath}`;

  const source = await transformFileScope({
    input,
    filePath,
    identOption: identifiers,
  });

  const output = await processVanillaFile({
    source,
    filePath,
    identOption: identifiers,
  });

  const css = await extractCss({
    input: output,
    filePath,
  });

  return css;
}
