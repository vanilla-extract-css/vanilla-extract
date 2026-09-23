import path, { posix } from 'path';
import { rollup, type OutputOptions as RollupOutputOptions } from 'rollup';
import {
  rolldown,
  type OutputOptions as RolldownOutputOptions,
} from 'rolldown';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

import {
  vanillaExtractPlugin,
  type Options as VanillaExtractPluginOptions,
} from '..';

export const BUNDLERS = ['rollup', 'rolldown'] as const;
export type Bundler = (typeof BUNDLERS)[number];

export type Fixture = 'themed' | 'react-library-example' | 'thirdparty';

export const fixtureRoot = (fixture: Fixture) =>
  path.dirname(require.resolve(`@fixtures/${fixture}/package.json`));

/**
 * Rolldown resolves bare specifiers out of `node_modules` natively, whereas
 * Rollup only does so via `@rollup/plugin-node-resolve`. Externalising the
 * vanilla-extract runtime in both keeps the two bundlers comparable - without
 * this, Rolldown would inline the runtime and Rollup would not.
 */
const RUNTIME_EXTERNALS = [
  '@vanilla-extract/dynamic',
  '@vanilla-extract/css',
  '@vanilla-extract/css/fileScope',
];

const FIXTURE_ENTRY: Record<Fixture, string | Record<string, string>> = {
  themed: 'src/index.ts',
  'react-library-example': 'src/index.ts',
  thirdparty: 'src/index.ts',
};

export interface BundleOptions {
  bundler: Bundler;
  fixture: Fixture;
  /**
   * Options for the plugin under test. Always namespaced so they can never be
   * confused with the bundler's own options.
   */
  plugin?: VanillaExtractPluginOptions;
  /** Defaults to the fixture's `src/index.ts`. */
  input?: string | Record<string, string>;
  /** Externals to merge with the vanilla-extract runtime externals. */
  external?: string[];
  output?: RolldownOutputOptions & RollupOutputOptions;
  /**
   * Overrides the plugin's `cwd`, which otherwise defaults to the fixture root.
   */
  cwd?: string;
}

type OutputFile = {
  fileName: string;
  type: string;
  source?: string | Uint8Array;
  code?: string;
  map?: { mappings?: string } | null;
};

const CSS_IMPORT_RE = /(?:import|from)\s*['"]([^'"]+\.css)['"]/g;

/**
 * A queryable view over bundler output, so tests can assert on the specific
 * thing they care about rather than snapshotting everything.
 */
export class BuildResult {
  constructor(private readonly files: OutputFile[]) {}

  get fileNames(): string[] {
    return this.files.map((file) => file.fileName);
  }

  /** Emitted CSS, as `[fileName, css]` pairs. */
  cssAssets(): Array<[string, string]> {
    return this.files
      .filter((file) => file.type === 'asset' && file.fileName.endsWith('.css'))
      .map((file) => [file.fileName, String(file.source)]);
  }

  cssAssetNames(): string[] {
    return this.cssAssets().map(([fileName]) => fileName);
  }

  jsChunks(): Array<[string, string]> {
    return this.files
      .filter((file) => file.type === 'chunk' && file.fileName.endsWith('.js'))
      .map((file) => [file.fileName, file.code ?? '']);
  }

  chunk(fileName: string): string {
    const file = this.files.find(
      (candidate) =>
        candidate.fileName === fileName && candidate.type === 'chunk',
    );
    if (!file) {
      throw new Error(
        `No chunk "${fileName}" in output. Available: ${this.fileNames.join(', ')}`,
      );
    }
    return file.code ?? '';
  }

  asset(fileName: string): string {
    const file = this.files.find(
      (candidate) =>
        candidate.fileName === fileName && candidate.type === 'asset',
    );
    if (!file) {
      throw new Error(
        `No asset "${fileName}" in output. Available: ${this.fileNames.join(', ')}`,
      );
    }
    return String(file.source);
  }

  /** Sourcemap mappings for a chunk, or `undefined` when none was generated. */
  mappings(fileName: string): string | undefined {
    return this.files.find((file) => file.fileName === fileName)?.map?.mappings;
  }

  /** The raw CSS specifiers a chunk imports. */
  cssImportSpecifiers(fileName: string): string[] {
    return [...this.chunk(fileName).matchAll(CSS_IMPORT_RE)].map(
      ([, specifier]) => specifier,
    );
  }

  /** Every CSS specifier across all JS chunks, as `[chunkName, specifier]`. */
  allCssImportSpecifiers(): Array<readonly [string, string]> {
    return this.jsChunks().flatMap(([fileName]) =>
      this.cssImportSpecifiers(fileName).map(
        (specifier) => [fileName, specifier] as const,
      ),
    );
  }

  /**
   * A chunk's CSS imports resolved against its own directory, giving paths
   * relative to the output root that should match emitted asset names.
   */
  resolvedCssImports(fileName: string): string[] {
    const dir = posix.dirname(fileName);
    return this.cssImportSpecifiers(fileName).map((specifier) =>
      posix.normalize(posix.join(dir, specifier)),
    );
  }
}

const pluginsFor = (
  bundler: Bundler,
  pluginOptions: VanillaExtractPluginOptions,
) => {
  const vanillaExtract = vanillaExtractPlugin(pluginOptions);

  // Rolldown handles TypeScript, JSON and node resolution natively.
  return bundler === 'rolldown'
    ? [vanillaExtract]
    : [
        vanillaExtract,
        nodeResolve({ exportConditions: ['import'] }),
        esbuild(),
        json(),
      ];
};

/**
 * Builds a fixture with the plugin under test and returns a queryable result.
 *
 * The VE plugin is always included - callers configure it via `plugin`, and cannot
 * accidentally replace it by supplying their own bundler options.
 */
export const bundle = async ({
  bundler,
  fixture,
  plugin = {},
  input,
  external = [],
  output = {},
  cwd,
}: BundleOptions): Promise<BuildResult> => {
  const root = fixtureRoot(fixture);
  const entry = input ?? FIXTURE_ENTRY[fixture];
  const resolveEntry = (value: string) =>
    path.isAbsolute(value) ? value : path.join(root, value);

  const inputOptions = {
    input:
      typeof entry === 'string'
        ? resolveEntry(entry)
        : Object.fromEntries(
            Object.entries(entry).map(([name, value]) => [
              name,
              resolveEntry(value),
            ]),
          ),
    external: [...RUNTIME_EXTERNALS, ...external],
    plugins: pluginsFor(bundler, { cwd: cwd ?? root, ...plugin }),
  };

  const build = bundler === 'rollup' ? rollup : rolldown;
  const bundlerBuild = await build(inputOptions);
  const { output: files } = await bundlerBuild.generate(output);

  return new BuildResult(
    [...files].sort((a, b) => a.fileName.localeCompare(b.fileName)),
  );
};
