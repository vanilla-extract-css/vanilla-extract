import { rollup, OutputOptions } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import path from 'path';

import { vanillaExtractPlugin } from '..';

async function buildAndMatchSnapshot(outputOptions: OutputOptions) {
  const bundle = await rollup({
    input: require.resolve('@fixtures/themed'),
    plugins: [
      vanillaExtractPlugin({
        cwd: path.dirname(require.resolve('@fixtures/themed/package.json')),
      }),
      esbuild(),
      json(),
    ],
    external: ['@vanilla-extract/dynamic'],
  });
  const { output } = await bundle.generate(outputOptions);
  output.sort((a, b) => a.fileName.localeCompare(b.fileName));
  expect(
    output.map((chunkOrAsset) => [
      chunkOrAsset.fileName,
      chunkOrAsset.type === 'asset' ? chunkOrAsset.source : chunkOrAsset.code,
    ]),
  ).toMatchSnapshot();
  if (bundle) {
    await bundle.close();
  }
}

describe('rollup-plugin', () => {
  it('should build without preserveModules', async () => {
    // Bundle all JS outputs together
    await buildAndMatchSnapshot({
      format: 'esm',
    });
  });

  it('should build with preserveModules', async () => {
    // Preserve JS modules
    await buildAndMatchSnapshot({
      format: 'esm',
      preserveModules: true,
    });
  });

  it('should build with preserveModules and assetFileNames', async () => {
    // Preserve JS modules and place assets next to JS files instead of assets directory
    await buildAndMatchSnapshot({
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: path.dirname(require.resolve('@fixtures/themed')),
      assetFileNames({ name }) {
        return name?.replace(/^src\//, '') ?? '';
      },
    });
  });
});
