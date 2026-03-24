import type { NextFixtureOptions } from './next';

type BuildType = NextFixtureOptions['type'];

export interface TestServer {
  type: BuildType;
  url: string;
  close: () => Promise<void>;
  stylesheet?: string;
}
