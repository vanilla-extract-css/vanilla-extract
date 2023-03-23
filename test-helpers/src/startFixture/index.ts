import portfinder from 'portfinder';

import { startWebpackFixture, WebpackFixtureOptions } from './webpack';
import { startEsbuildFixture, EsbuildFixtureOptions } from './esbuild';
import { startViteFixture, ViteFixtureOptions } from './vite';
import { startParcelFixture, ParcelFixtureOptions } from './parcel';

type BuildType =
  | 'browser'
  | 'mini-css-extract'
  | 'style-loader'
  | 'esbuild'
  | 'esbuild-next'
  | 'esbuild-runtime'
  | 'esbuild-next-runtime'
  | 'vite'
  | 'parcel';

export interface TestServer {
  type: BuildType;
  url: string;
  close: () => Promise<void>;
  stylesheet?: string;
}

type SharedOptions = {
  basePort: number;
};

type FixtureOptions = SharedOptions &
  Omit<
    | EsbuildFixtureOptions
    | WebpackFixtureOptions
    | ViteFixtureOptions
    | ParcelFixtureOptions,
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
  return startWebpackFixture(fixtureName, { type, ...options, port });
}
