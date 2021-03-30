import { startWebpackFixture, WebpackFixtureOptions } from './webpack';
import { startEsbuildFixture, EsbuildFixtureOptions } from './esbuild';

type StyleType = 'browser' | 'mini-css-extract' | 'style-loader' | 'esbuild';

export interface TestServer {
  type: StyleType;
  url: string;
  close: () => Promise<void>;
}

type FixtureOptions = EsbuildFixtureOptions | WebpackFixtureOptions;
export async function startFixture(
  fixtureName: string,
  options: FixtureOptions,
): Promise<TestServer> {
  if (options.type === 'esbuild') {
    return startEsbuildFixture(fixtureName, options);
  }

  return startWebpackFixture(fixtureName, options);
}
