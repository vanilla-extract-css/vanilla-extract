export type BuildType =
  | 'browser'
  | 'mini-css-extract'
  | 'style-loader'
  | 'esbuild'
  | 'vite';

export interface TestServer {
  type: BuildType;
  url: string;
  close: () => Promise<void>;
}
