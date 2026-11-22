interface ServerDefinition {
  name: string;
  isProduction: boolean;
  script: string;
  port: number;
  suite: 'full' | 'limited';
}

export const NEXT_SERVERS: ServerDefinition[] = [
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
