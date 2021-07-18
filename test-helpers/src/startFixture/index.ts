import portfinder from 'portfinder';

import { startWebpackFixture, WebpackFixtureOptions } from './webpack';
import { startEsbuildFixture, EsbuildFixtureOptions } from './esbuild';
import { startViteFixture, ViteFixtureOptions } from './vite';
import { startSnowpackFixture, SnowpackFixtureOptions } from './snowpack';

type BuildType =
  | 'browser'
  | 'mini-css-extract'
  | 'style-loader'
  | 'esbuild'
  | 'esbuild-runtime'
  | 'vite'
  | 'snowpack';

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
    | SnowpackFixtureOptions,
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

  if (type === 'esbuild' || type === 'esbuild-runtime') {
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

  if (type === 'snowpack') {
    return startSnowpackFixture(fixtureName, {
      type,
      port,
      mode: options.mode,
    });
  }

  return startWebpackFixture(fixtureName, { type, ...options, port });
}
