import {
  rolldown,
  type InputOptions as RolldownInputOptions,
  type OutputOptions as RolldownOutputOptions,
} from 'rolldown';
import {
  rollup,
  type InputPluginOption,
  type OutputAsset,
  type OutputChunk,
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

interface BuildOptions extends VanillaExtractPluginOptions {
  rollup: RollupOptions & { output: OutputOptions };
}

async function build({
  rollup: rollupOptions,
  ...pluginOptions
}: BuildOptions) {
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
}

async function buildAndMatchSnapshot(options: BuildOptions) {
  const output = await build(options);
  expect(
    output.map((chunkOrAsset) => [
      chunkOrAsset.fileName,
      chunkOrAsset.type === 'asset' ? chunkOrAsset.source : chunkOrAsset.code,
    ]),
  ).toMatchSnapshot();
}

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
      const bundleAsset = output.find(
        (file) => file.type === 'asset' && file.fileName === 'app.css',
      );
      expect(bundleAsset).toBeTruthy();
      const sourcemapAsset = output.find(
        (file) => file.type === 'asset' && file.fileName === 'app.css.map',
      );
      expect(sourcemapAsset).toBeTruthy();

      // assert .css imports were removed
      const jsFiles = output.filter(
        (file) => file.type === 'chunk' && file.fileName.endsWith('.js'),
      ) as OutputChunk[];
      for (const jsFile of jsFiles) {
        expect(jsFile.code).not.toMatch(/^import .*\.css['"]/m);
      }

      // assert bundle CSS reflects order from @fixtures/react-library-example/index.ts
      const map = JSON.parse(String((sourcemapAsset as OutputAsset).source));
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
        output
          .filter((chunkOrAsset) => !chunkOrAsset.fileName.endsWith('.map')) // remove .msps
          .map((chunkOrAsset) => [
            chunkOrAsset.fileName,
            chunkOrAsset.type === 'asset'
              ? chunkOrAsset.source
              : chunkOrAsset.code,
          ]),
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
      expect(
        output.map((chunkOrAsset) => [
          chunkOrAsset.fileName,
          chunkOrAsset.type === 'asset' ? '' : chunkOrAsset.map?.mappings,
        ]),
      ).toMatchSnapshot();
    });
  });

  describe('should be compatible with rolldown', () => {
    async function build({
      rollup: rollupOptions,
      ...pluginOptions
    }: VanillaExtractPluginOptions & {
      rollup: RolldownInputOptions & { output: RolldownOutputOptions };
    }) {
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
    }

    async function buildAndMatchSnapshot(
      outputOptions: RolldownOutputOptions,
      { unstable_injectFilescopes }: { unstable_injectFilescopes?: boolean } = {
        unstable_injectFilescopes: false,
      },
    ) {
      const output = await build({
        rollup: {
          output: outputOptions,
        },
        unstable_injectFilescopes,
      });
      expect(
        output.map((chunkOrAsset) => [
          chunkOrAsset.fileName,
          chunkOrAsset.type === 'asset'
            ? chunkOrAsset.source
            : chunkOrAsset.code,
        ]),
      ).toMatchSnapshot();
    }

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
      const bundleAsset = output.find(
        (file) => file.type === 'asset' && file.fileName === 'app.css',
      );
      expect(bundleAsset).toBeTruthy();
      const sourcemapAsset = output.find(
        (file) => file.type === 'asset' && file.fileName === 'app.css.map',
      );
      expect(sourcemapAsset).toBeTruthy();

      // assert .css imports were removed
      const jsFiles = output.filter(
        (file) => file.type === 'chunk' && file.fileName.endsWith('.js'),
      ) as OutputChunk[];
      for (const jsFile of jsFiles) {
        expect(jsFile.code).not.toMatch(/^import .*\.css['"]/m);
      }

      // assert bundle CSS reflects order from @fixtures/react-library-example/index.ts
      const map = JSON.parse(String((sourcemapAsset as OutputAsset).source));
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
        output
          .filter((chunkOrAsset) => !chunkOrAsset.fileName.endsWith('.map')) // remove .msps
          .map((chunkOrAsset) => [
            chunkOrAsset.fileName,
            chunkOrAsset.type === 'asset'
              ? chunkOrAsset.source
              : chunkOrAsset.code,
          ]),
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
      expect(
        output.map((chunkOrAsset) => [
          chunkOrAsset.fileName,
          chunkOrAsset.type === 'asset' ? '' : chunkOrAsset.map?.mappings,
        ]),
      ).toMatchSnapshot();
    });
  });
});

describe('stripSideEffectImportsMatching', () => {
  it('strips only specified side effects', () => {
    // assert all specified imports are stripped
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
    // assert empty array returns code as expected
    const code = `import React from 'react';
import 'button.vanilla.css';
import './foobar.js';

export default function Button() {
  return <button>My Button</button>;
}`;
    expect(stripSideEffectImportsMatching(code, [])).toBe(code);
  });
});
