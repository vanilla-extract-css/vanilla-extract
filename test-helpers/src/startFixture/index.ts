import portfinder from 'portfinder';

import { type NextFixtureOptions, startNextFixture } from './next';

import type { TestServer } from './types';

export * from './types';

type SharedOptions = {
  basePort: number;
};

type FixtureOptions = SharedOptions & Omit<NextFixtureOptions, 'port'>;

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

  if (
    type === 'next-12-pages-router' ||
    type === 'next-13-app-router' ||
    type === 'next-16-app-pages-router'
  ) {
    return startNextFixture({
      type,
      port,
      mode: options.mode,
    });
  }

  throw new Error(`Unknown fixture type: ${type}`);
}
