interface ServerDefinition {
  name: string;
  isProduction: boolean;
  script: string;
  port: number;
  suite: 'full' | 'limited';
}

export interface BundlerServerDefinition {
  name: string;
  type: string;
  mode: 'development' | 'production';
  port: number;
  snapshotCss: boolean;
  fixtures: string[];
}

const STANDARD_FIXTURES = [
  'features',
  'layers',
  'low-level',
  'recipes',
  'sprinkles',
  'themed',
  'thirdparty',
];

const WEBPACK_FIXTURES = [...STANDARD_FIXTURES, 'template-string-paths'];

export const BUNDLER_SERVERS: BundlerServerDefinition[] = [
  {
    name: 'Vite Dev',
    type: 'vite',
    mode: 'development',
    port: 4001,
    snapshotCss: false,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'Vite Prod',
    type: 'vite',
    mode: 'production',
    port: 4002,
    snapshotCss: true,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'Webpack MiniCssExtract Dev',
    type: 'mini-css-extract',
    mode: 'development',
    port: 4003,
    snapshotCss: true,
    fixtures: WEBPACK_FIXTURES,

  },
  {
    name: 'Webpack MiniCssExtract Prod',
    type: 'mini-css-extract',
    mode: 'production',
    port: 4004,
    snapshotCss: true,
    fixtures: WEBPACK_FIXTURES,

  },
  {
    name: 'Webpack StyleLoader Dev',
    type: 'style-loader',
    mode: 'development',
    port: 4005,
    snapshotCss: false,
    fixtures: WEBPACK_FIXTURES,

  },
  {
    name: 'esbuild Dev',
    type: 'esbuild',
    mode: 'development',
    port: 4006,
    snapshotCss: true,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'esbuild Prod',
    type: 'esbuild',
    mode: 'production',
    port: 4007,
    snapshotCss: true,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'esbuild-runtime Dev',
    type: 'esbuild-runtime',
    mode: 'development',
    port: 4008,
    snapshotCss: false,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'esbuild-runtime Prod',
    type: 'esbuild-runtime',
    mode: 'production',
    port: 4009,
    snapshotCss: false,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'esbuild-next Dev',
    type: 'esbuild-next',
    mode: 'development',
    port: 4010,
    snapshotCss: true,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'esbuild-next Prod',
    type: 'esbuild-next',
    mode: 'production',
    port: 4011,
    snapshotCss: true,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'esbuild-next-runtime Dev',
    type: 'esbuild-next-runtime',
    mode: 'development',
    port: 4012,
    snapshotCss: false,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'esbuild-next-runtime Prod',
    type: 'esbuild-next-runtime',
    mode: 'production',
    port: 4013,
    snapshotCss: false,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'Parcel Dev',
    type: 'parcel',
    mode: 'development',
    port: 4014,
    snapshotCss: true,
    fixtures: STANDARD_FIXTURES,

  },
  {
    name: 'Parcel Prod',
    type: 'parcel',
    mode: 'production',
    port: 4015,
    snapshotCss: true,
    fixtures: STANDARD_FIXTURES,

  },
];

export const NEXT_SERVERS: ServerDefinition[] = [
  {
    name: 'Next 12 Dev Server',
    isProduction: false,
    script: 'pnpm --filter=next-12-pages-router dev',
    port: 3001,
    suite: 'limited',
  },
  {
    name: 'Next 12 Build',
    isProduction: true,
    script: 'pnpm --filter=next-12-pages-router start',
    port: 3002,
    suite: 'limited',
  },
  {
    name: 'Next 13 Dev Server',
    isProduction: false,
    script: 'pnpm --filter=next-13-app-router dev',
    port: 3003,
    suite: 'limited',
  },
  {
    name: 'Next 13 Build',
    isProduction: true,
    script: 'pnpm --filter=next-13-app-router start',
    port: 3004,
    suite: 'limited',
  },
  {
    name: 'Next 16 Dev Server (Webpack)',
    isProduction: false,
    script: 'pnpm --filter=next-16-app-pages-router dev-webpack',
    port: 3005,
    suite: 'full',
  },
  {
    name: 'Next 16 Build (Webpack)',
    isProduction: true,
    script: 'pnpm --filter=next-16-app-pages-router start-webpack',
    port: 3006,
    suite: 'full',
  },
  {
    name: 'Next 16 Dev Server (Turbopack)',
    isProduction: false,
    script: 'pnpm --filter=next-16-app-pages-router dev-turbo',
    port: 3007,
    suite: 'full',
  },
  {
    name: 'Next 16 Build (Turbopack)',
    isProduction: true,
    script: 'pnpm --filter=next-16-app-pages-router start-turbo',
    port: 3008,
    suite: 'full',
  },
];
