import { rollup, OutputOptions } from 'rollup';
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import esbuild from 'rollup-plugin-esbuild';
import { resolve } from 'path';

async function buildAndMatchSnapshot(outputOptions: OutputOptions) {
  const inputOptions = {
    input: resolve(__dirname, 'src/index.ts'),
    plugins: [vanillaExtractPlugin({ cwd: __dirname }), esbuild()],
  };
  const bundle = await rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  output.sort((a, b) => a.fileName.localeCompare(b.fileName));
  expect(output.map((chunkOrAsset) => ({
    name: chunkOrAsset.name,
    fileName: chunkOrAsset.fileName,
    code: chunkOrAsset.type === 'asset' ? chunkOrAsset.source : chunkOrAsset.code,
  }))).toMatchSnapshot();
  if (bundle) {
    await bundle.close();
  }
}

describe('rollup-plugin', () => {
  it('should build without preserveModules', async () => {
    // Bundle all JS outputs together
    const outputOptions = {
      format: 'esm',
    } as const;
    await buildAndMatchSnapshot(outputOptions);
  });

  it('should build with preserveModules', async () => {
    // Preserve JS modules
    const outputOptions = {
      format: 'esm',
      preserveModules: true,
    } as const;
    await buildAndMatchSnapshot(outputOptions);
  });
  
  it('should build with preserveModules and assetFileNames', async () => {
    // Preserve JS modules and place assets next to JS files instead of assets directory
    const outputOptions = {
      format: 'esm',
      preserveModules: true,
      assetFileNames({ name }) {
        return name.replace(new RegExp(`^@fixtures/rollup-plugin/src/`), '');
      },
    } as const;
    await buildAndMatchSnapshot(outputOptions);
  });
});

