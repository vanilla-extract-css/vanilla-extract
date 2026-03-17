import type { EsbuildFixtureOptions } from './esbuild';
import type { NextFixtureOptions } from './next';
import type { ParcelFixtureOptions } from './parcel';
import type { ViteFixtureOptions } from './vite';
import type { WebpackFixtureOptions } from './webpack';

type BuildType =
  | WebpackFixtureOptions['type']
  | EsbuildFixtureOptions['type']
  | ViteFixtureOptions['type']
  | ParcelFixtureOptions['type']
  | NextFixtureOptions['type'];

export interface TestServer {
  type: BuildType;
  url: string;
  close: () => Promise<void>;
  stylesheet?: string;
}
