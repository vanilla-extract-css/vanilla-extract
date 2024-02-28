import { EsbuildFixtureOptions } from './esbuild';
import { ParcelFixtureOptions } from './parcel';
import { ViteFixtureOptions } from './vite';
import { WebpackFixtureOptions } from './webpack';

type BuildType =
  | WebpackFixtureOptions['type']
  | EsbuildFixtureOptions['type']
  | ViteFixtureOptions['type']
  | ParcelFixtureOptions['type'];

export interface TestServer {
  type: BuildType;
  url: string;
  close: () => Promise<void>;
  stylesheet?: string;
}
