import {
  rolldown,
  type OutputOptions as RolldownOutputOptions,
} from 'rolldown';
import { rollup, type OutputOptions } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import path from 'path';

import { vanillaExtractPlugin } from '..';

async function build(outputOptions: OutputOptions) {
  const bundle = await rollup({
    input: require.resolve('@fixtures/themed/src/index.ts'),
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
  return output;
}

async function buildAndMatchSnapshot(outputOptions: OutputOptions) {
  const output = await build(outputOptions);
  expect(
    output.map((chunkOrAsset) => [
      chunkOrAsset.fileName,
      chunkOrAsset.type === 'asset' ? chunkOrAsset.source : chunkOrAsset.code,
    ]),
  ).toMatchSnapshot();
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
      preserveModulesRoot: path.dirname(
        require.resolve('@fixtures/themed/src/index.ts'),
      ),
      assetFileNames({ names }) {
        return names[0].replace(/^src\//, '') ?? '';
      },
    });
  });

  it('should build with sourcemaps', async () => {
    const output = await build({
      format: 'esm',
      preserveModules: true,
      sourcemap: true,
    });
    expect(
      output.map((chunkOrAsset) => [
        chunkOrAsset.fileName,
        chunkOrAsset.type === 'asset' ? '' : chunkOrAsset.map?.mappings,
      ]),
    ).toMatchSnapshot();
  });

  describe('should be compatible with rolldown', () => {
    async function build(outputOptions: RolldownOutputOptions) {
      const bundle = await rolldown({
        input: require.resolve('@fixtures/themed/src/index.ts'),
        plugins: [
          vanillaExtractPlugin({
            cwd: path.dirname(require.resolve('@fixtures/themed/package.json')),
          }),
        ],
        external: ['@vanilla-extract/dynamic'],
      });
      const { output } = await bundle.generate(outputOptions);
      output.sort((a, b) => a.fileName.localeCompare(b.fileName));
      return output;
    }

    async function buildAndMatchSnapshot(outputOptions: RolldownOutputOptions) {
      const output = await build(outputOptions);
      expect(
        output.map((chunkOrAsset) => [
          chunkOrAsset.fileName,
          chunkOrAsset.type === 'asset'
            ? chunkOrAsset.source
            : chunkOrAsset.code,
        ]),
      ).toMatchSnapshot();
    }

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
        preserveModulesRoot: path.dirname(
          require.resolve('@fixtures/themed/src/index.ts'),
        ),
        assetFileNames({ names }) {
          return names[0].replace(/^src\//, '') ?? '';
        },
      });
    });

    it('should build with sourcemaps', async () => {
      const output = await build({
        format: 'esm',
        preserveModules: true,
        sourcemap: true,
      });
      expect(
        output.map((chunkOrAsset) => [
          chunkOrAsset.fileName,
          chunkOrAsset.type === 'asset' ? '' : chunkOrAsset.map?.mappings,
        ]),
      ).toMatchSnapshot();
    });
  });
});
