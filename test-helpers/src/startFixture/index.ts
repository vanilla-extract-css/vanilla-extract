import portfinder from 'portfinder';

import { startWebpackFixture, type WebpackFixtureOptions } from './webpack';
import { startEsbuildFixture, type EsbuildFixtureOptions } from './esbuild';
import { startViteFixture, type ViteFixtureOptions } from './vite';
import { startParcelFixture, type ParcelFixtureOptions } from './parcel';
import { type NextFixtureOptions, startNextFixture } from './next';

import type { TestServer } from './types';
import { startViteSsrFixture, type ViteSsrFixtureOptions } from './vite-ssr';

export * from './types';

type SharedOptions = {
  basePort: number;
};

// Regular Omit doesn't distribute over union types, but using `extends` forces distribution
// over the union, which is what we want here. Without distributing, the union type is collapsed and
// then `port` is omitted, which means we can't discriminate over the `type` field and extract
// bundler-specific options when needed.
type DistributedOmit<T, K extends keyof T> = T extends any ? Omit<T, K> : never;

type BundleFixtureOptions =
  | EsbuildFixtureOptions
  | WebpackFixtureOptions
  | ViteFixtureOptions
  | ViteSsrFixtureOptions
  | ParcelFixtureOptions
  | NextFixtureOptions;

type FixtureOptions = SharedOptions &
  DistributedOmit<BundleFixtureOptions, 'port'>;

export async function startFixture(
  fixtureName: string,
  options: FixtureOptions,
): Promise<TestServer> {
  const { type, basePort, ...restOptions } = options;
  const port = await portfinder.getPortPromise({ port: basePort });

  console.log(
    [
      `Starting ${fixtureName} fixture`,
      ...Object.entries({
        type,
        port,
        ...restOptions,
      }).map(([key, value]) => `- ${key}: ${value}`),
    ].join('\n'),
  );

  if (
    type === 'esbuild' ||
    type === 'esbuild-runtime' ||
    type === 'esbuild-next' ||
    type === 'esbuild-next-runtime'
  ) {
    return startEsbuildFixture(fixtureName, {
      type,
      port,
      ...restOptions,
    });
  }

  if (type === 'vite') {
    return startViteFixture(fixtureName, {
      type,
      port,
      ...restOptions,
    });
  }

  if (type === 'vite-ssr') {
    if (fixtureName !== 'vite-react-ssr') {
      throw new Error(
        'Currently only the "vite-react-ssr" fixture is supported for vite-ssr',
      );
    }
    return startViteSsrFixture(fixtureName, {
      type,
      port,
      ...restOptions,
    });
  }

  if (type === 'parcel') {
    return startParcelFixture(fixtureName, {
      type,
      port,
      ...restOptions,
    });
  }

  if (type === 'next-pages-router' || type === 'next-app-router') {
    return startNextFixture({
      type,
      port,
      ...restOptions,
    });
  }

  return startWebpackFixture(fixtureName, { type, port, ...restOptions });
}
