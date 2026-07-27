import { describe, expect, it } from 'vitest';
import {
  rolldown,
  type InputOptions as RolldownInputOptions,
  type OutputOptions as RolldownOutputOptions,
} from 'rolldown';
import {
  rollup,
  type InputPluginOption,
  type OutputOptions,
  type RollupOptions,
} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import path from 'path';

import {
  vanillaExtractPlugin,
  type Options as VanillaExtractPluginOptions,
} from '..';
import { stripSideEffectImportsMatching } from '../src/lib';

type BuildOutputFile = {
  fileName: string;
  type: string;
  source?: string | Uint8Array;
  code?: string;
  map?: { mappings?: string } | null;
};

const formatOutputForSnapshot = (output: BuildOutputFile[]) =>
  output.map((chunkOrAsset) => [
    chunkOrAsset.fileName,
    chunkOrAsset.type === 'asset' ? chunkOrAsset.source : chunkOrAsset.code,
  ]);

const formatSourcemapOutputForSnapshot = (output: BuildOutputFile[]) =>
  output.map((chunkOrAsset) => [
    chunkOrAsset.fileName,
    chunkOrAsset.type === 'asset' ? '' : chunkOrAsset.map?.mappings,
  ]);

const filterJsChunkCodes = (output: BuildOutputFile[]) =>
  output
    .filter((file) => file.type === 'chunk' && file.fileName.endsWith('.js'))
    .map((file) => file.code);

const filterAssetSources = (output: BuildOutputFile[], fileName: string) =>
  output
    .filter((file) => file.type === 'asset' && file.fileName === fileName)
    .map((file) => file.source);

interface BuildOptions extends VanillaExtractPluginOptions {
  rollup: RollupOptions & { output: OutputOptions };
}

const build = async ({
  rollup: rollupOptions,
  ...pluginOptions
}: BuildOptions) => {
  const bundle = await rollup({
    input: require.resolve('@fixtures/themed/src/index.ts'),
    external: ['@vanilla-extract/dynamic'],
    ...rollupOptions,
    plugins: [
      ...((rollupOptions?.plugins as InputPluginOption[]) ?? [
        vanillaExtractPlugin({
          cwd: path.dirname(require.resolve('@fixtures/themed/package.json')),
          ...pluginOptions,
        }),
        esbuild(),
        json(),
      ]),
    ],
  });
  const { output } = await bundle.generate(rollupOptions.output);
  output.sort((a, b) => a.fileName.localeCompare(b.fileName));
  return output;
};

const buildAndMatchSnapshot = async (options: BuildOptions) => {
  const output = await build(options);
  expect(formatOutputForSnapshot(output)).toMatchSnapshot();
};

describe('rollup-plugin', () => {
  describe('options', () => {
    it('extract generates .css bundle', async () => {
      const cwd = path.dirname(
        require.resolve('@fixtures/react-library-example/package.json'),
      );
      const output = await build({
        cwd,
        extract: { name: 'app.css', sourcemap: true },
        rollup: {
          input: { app: path.join(cwd, 'src/index.ts') },
          external: ['clsx', 'react', 'react/jsx-runtime', 'react-dom'],
          output: {
            assetFileNames: '[name][extname]',
            format: 'esm',
            preserveModules: true, // not needed for output, just makes some assertions easier
          },
        },
      });

      // assert essential files were made
      expect(filterAssetSources(output, 'app.css')).toHaveLength(1);

      // assert .css imports were removed
      const jsChunkCodes = filterJsChunkCodes(output);
      expect(jsChunkCodes.length).toBeGreaterThan(0);
      for (const code of jsChunkCodes) {
        expect(code).not.toMatch(/^import .*\.css['"]/m);
      }

      // assert bundle CSS reflects order from @fixtures/react-library-example/index.ts
      const sourcemapSources = filterAssetSources(output, 'app.css.map');
      expect(sourcemapSources).toHaveLength(1);
      const map = JSON.parse(String(sourcemapSources[0]));
      expect(map.sources).toEqual([
        'src/styles/reset.css.ts.vanilla.css',
        'src/styles/vars.css.ts.vanilla.css',
        'src/button/button.css.ts.vanilla.css',
        'src/checkbox/checkbox.css.ts.vanilla.css',
        'src/radio/radio.css.ts.vanilla.css',
        'src/styles/utility.css.ts.vanilla.css', // this always should be last
      ]);

      // assert Vanilla CSS was stripped out
      expect(
        output.filter((file) => file.fileName.includes('.css.ts.vanilla')),
      ).toHaveLength(0);

      // snapshot output for everything else
      expect(
        formatOutputForSnapshot(
          output.filter(
            (chunkOrAsset) => !chunkOrAsset.fileName.endsWith('.map'),
          ),
        ),
      ).toMatchSnapshot();
    });
  });

  describe('Rollup settings', () => {
    it('should build without preserveModules', async () => {
      // Bundle all JS outputs together
      await buildAndMatchSnapshot({
        rollup: { output: { format: 'esm' } },
      });
    });

    it('should build with preserveModules', async () => {
      // Preserve JS modules
      await buildAndMatchSnapshot({
        rollup: {
          output: {
            format: 'esm',
            preserveModules: true,
          },
        },
      });
    });

    it('should build with preserveModules and inject filescopes', async () => {
      // Preserve JS modules, don't generate any CSS assets and inject filescopes
      await buildAndMatchSnapshot({
        unstable_injectFilescopes: true,
        rollup: {
          output: {
            format: 'esm',
            preserveModules: true,
          },
          external: [
            '@vanilla-extract/css/fileScope',
            '@vanilla-extract/css',
            '@vanilla-extract/dynamic',
          ],
        },
      });
    });

    it('should build with preserveModules and assetFileNames', async () => {
      // Preserve JS modules and place assets next to JS files instead of assets directory
      await buildAndMatchSnapshot({
        rollup: {
          output: {
            format: 'esm',
            preserveModules: true,
            preserveModulesRoot: path.dirname(
              require.resolve('@fixtures/themed/src/index.ts'),
            ),
            assetFileNames({ names }) {
              return names[0]?.replace(/^src\//, '') ?? '';
            },
          },
        },
      });
    });

    it('should build with sourcemaps', async () => {
      const output = await build({
        rollup: {
          output: {
            format: 'esm',
            preserveModules: true,
            sourcemap: true,
          },
        },
      });

      expect(formatSourcemapOutputForSnapshot(output)).toMatchSnapshot();
    });
  });

  describe('should be compatible with rolldown', () => {
    const build = async ({
      rollup: rollupOptions,
      ...pluginOptions
    }: VanillaExtractPluginOptions & {
      rollup: RolldownInputOptions & { output: RolldownOutputOptions };
    }) => {
      const bundle = await rolldown({
        external: [
          '@vanilla-extract/dynamic',
          '@vanilla-extract/css',
          '@vanilla-extract/css/fileScope',
        ],
        input: require.resolve('@fixtures/themed/src/index.ts'),
        plugins: [
          vanillaExtractPlugin({
            cwd: path.dirname(require.resolve('@fixtures/themed/package.json')),
            ...pluginOptions,
          }),
        ],
        ...rollupOptions,
      });
      const { output } = await bundle.generate(rollupOptions.output);
      output.sort((a, b) => a.fileName.localeCompare(b.fileName));
      return output;
    };

    const buildAndMatchSnapshot = async (
      outputOptions: RolldownOutputOptions,
      { unstable_injectFilescopes }: { unstable_injectFilescopes?: boolean } = {
        unstable_injectFilescopes: false,
      },
    ) => {
      const output = await build({
        rollup: {
          output: outputOptions,
        },
        unstable_injectFilescopes,
      });
      expect(formatOutputForSnapshot(output)).toMatchSnapshot();
    };

    const buildThirdparty = async ({
      cwd,
      outputOptions,
    }: {
      cwd: string;
      outputOptions: RolldownOutputOptions;
    }) => {
      const packageRoot = path.dirname(
        require.resolve('@fixtures/thirdparty/package.json'),
      );
      const bundle = await rolldown({
        input: path.join(packageRoot, 'src/index.ts'),
        external: ['@vanilla-extract/dynamic', '@vanilla-extract/css'],
        plugins: [vanillaExtractPlugin({ cwd })],
      });

      const { output } = await bundle.generate(outputOptions);
      output.sort((a, b) => a.fileName.localeCompare(b.fileName));

      return output;
    };

    const buildThirdpartyAndMatchSnapshot = async (cwd: string) => {
      const output = await buildThirdparty({
        cwd,
        outputOptions: {
          format: 'esm',
          preserveModules: true,
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      });

      expect(formatOutputForSnapshot(output)).toMatchSnapshot();
    };

    it('extract generates .css bundle', async () => {
      const cwd = path.dirname(
        require.resolve('@fixtures/react-library-example/package.json'),
      );
      const output = await build({
        cwd,
        extract: { name: 'app.css', sourcemap: true },
        rollup: {
          input: { app: path.join(cwd, 'src/index.ts') },
          external: ['clsx', 'react', 'react/jsx-runtime', 'react-dom'],
          output: {
            assetFileNames: '[name][extname]',
            format: 'esm',
            preserveModules: true, // not needed for output, just makes some assertions easier
          },
        },
      });

      // assert essential files were made
      expect(filterAssetSources(output, 'app.css')).toHaveLength(1);

      // assert .css imports were removed
      const jsChunkCodes = filterJsChunkCodes(output);
      expect(jsChunkCodes.length).toBeGreaterThan(0);
      for (const code of jsChunkCodes) {
        expect(code).not.toMatch(/^import .*\.css['"]/m);
      }

      // assert bundle CSS reflects order from @fixtures/react-library-example/index.ts
      const sourcemapSources = filterAssetSources(output, 'app.css.map');
      expect(sourcemapSources).toHaveLength(1);
      const map = JSON.parse(String(sourcemapSources[0]));
      expect(map.sources).toEqual([
        'src/styles/reset.css.ts.vanilla.css',
        'src/styles/vars.css.ts.vanilla.css',
        'src/button/button.css.ts.vanilla.css',
        'src/checkbox/checkbox.css.ts.vanilla.css',
        'src/radio/radio.css.ts.vanilla.css',
        'src/styles/utility.css.ts.vanilla.css', // this always should be last
      ]);

      // assert Vanilla CSS was stripped out
      expect(
        output.filter((file) => file.fileName.includes('.css.ts.vanilla')),
      ).toHaveLength(0);

      // snapshot output for everything else
      expect(
        formatOutputForSnapshot(
          output.filter(
            (chunkOrAsset) => !chunkOrAsset.fileName.endsWith('.map'),
          ),
        ),
      ).toMatchSnapshot();
    });

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

    it('should build with preserveModules and inject filescopes', async () => {
      // Preserve JS modules
      await buildAndMatchSnapshot(
        {
          format: 'esm',
          preserveModules: true,
          preserveModulesRoot: path.dirname(
            require.resolve('@fixtures/themed/src/index.ts'),
          ),
          assetFileNames({ names }) {
            return names[0].replace(/^src\//, '') ?? '';
          },
        },
        {
          unstable_injectFilescopes: true,
        },
      );
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
        rollup: {
          output: {
            format: 'esm',
            preserveModules: true,
            sourcemap: true,
          },
        },
      });

      expect(formatSourcemapOutputForSnapshot(output)).toMatchSnapshot();
    });

    it('should build thirdparty dependencies', async () => {
      const cwd = path.dirname(
        require.resolve('@fixtures/thirdparty/package.json'),
      );

      await buildThirdpartyAndMatchSnapshot(cwd);
    });

    it('should build thirdparty dependencies with nested cwd', async () => {
      const packageRoot = path.dirname(
        require.resolve('@fixtures/thirdparty/package.json'),
      );

      await buildThirdpartyAndMatchSnapshot(path.join(packageRoot, 'src'));
    });
  });
});

describe('stripSideEffectImportsMatching', () => {
  it('strips only specified side effects in ESM', () => {
    expect(
      stripSideEffectImportsMatching(
        `import React from 'react';
import 'button.vanilla.css';
import './foobar.js';

export default function Button() {
  return <button>My Button</button>;
}`,
        ['button.vanilla.css', 'checkbox.vanilla.css', 'radio.vanilla.css'],
      ),
    ).toBe(
      `import React from 'react';
import './foobar.js';

export default function Button() {
  return <button>My Button</button>;
}`,
    );
  });

  it('leaves code alone if no side effects specified', () => {
    const code = `import React from 'react';
import 'button.vanilla.css';
import './foobar.js';

export default function Button() {
  return <button>My Button</button>;
}`;
    expect(stripSideEffectImportsMatching(code, [])).toBe(code);
  });

  it('strips only specified side effects in CJS', () => {
    expect(
      stripSideEffectImportsMatching(
        `const React = require('react');
require('button.vanilla.css');
require('./foobar.js');

module.exports = function Button() {
  return <button>My Button</button>;
}`,
        ['button.vanilla.css', 'checkbox.vanilla.css', 'radio.vanilla.css'],
      ),
    ).toBe(
      `const React = require('react');
require('./foobar.js');

module.exports = function Button() {
  return <button>My Button</button>;
}`,
    );
  });
});
