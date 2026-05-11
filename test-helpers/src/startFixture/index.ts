import portfinder from 'portfinder';

import { startWebpackFixture, type WebpackFixtureOptions } from './webpack';
import { startEsbuildFixture, type EsbuildFixtureOptions } from './esbuild';
import { startViteFixture, type ViteFixtureOptions } from './vite';
import { startParcelFixture, type ParcelFixtureOptions } from './parcel';
import { type NextFixtureOptions, startNextFixture } from './next';

import type { TestServer } from './types';

export * from './types';

type SharedOptions = {
  basePort: number;
};

type FixtureOptions = SharedOptions &
  Omit<
    | EsbuildFixtureOptions
    | WebpackFixtureOptions
    | ViteFixtureOptions
    | ParcelFixtureOptions
    | NextFixtureOptions,
    'port'
  >;
export async function startFixture(
  fixtureName: string,
  { type, basePort, ...options }: FixtureOptions,
): Promise<TestServer> {
  const port = await portfinder.getPortPromise({ port: basePort });

  console.log(
    [
      `Starting ${fixtureName} fixture`,
      ...Object.entries({
        type,
        port,
        ...options,
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
      mode: options.mode,
    });
  }

  if (type === 'vite') {
    return startViteFixture(fixtureName, {
      type,
      port,
      mode: options.mode,
    });
  }

  if (type === 'parcel') {
    return startParcelFixture(fixtureName, {
      type,
      port,
      mode: options.mode,
    });
  }

  if (
    type === 'next-12-pages-router' ||
    type === 'next-13-app-router' ||
    type === 'next-16-app-pages-router'
  ) {
    return startNextFixture({
      type,
      port,
      mode: options.mode,
    });
  }

  return startWebpackFixture(fixtureName, { type, ...options, port });
}
