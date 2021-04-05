export type BuildType =
  | 'browser'
  | 'mini-css-extract'
  | 'style-loader'
  | 'esbuild'
  | 'rollup';

export interface TestServer {
  type: BuildType;
  url: string;
  close: () => Promise<void>;
}
