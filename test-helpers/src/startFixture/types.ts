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
