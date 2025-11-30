import { type PlaywrightTestConfig, defineConfig } from '@playwright/test';
import { cpus } from 'os';
import { NEXT_SERVERS } from './tests/servers';

// Prevent Vite from attempting to clear the screen
process.stdout.isTTY = false;

const config: PlaywrightTestConfig = defineConfig({
  testMatch: '**/*.playwright.ts',
  updateSnapshots: 'none',
  expect: {
    toMatchSnapshot: {
      threshold: 0.2,
      maxDiffPixelRatio: 0.02,
    },
  },
  webServer: NEXT_SERVERS.map((server) => ({
    command: server.script + ` --port ${server.port}`,
    env: { NODE_ENV: server.isProduction ? 'production' : 'development' },
    url: `http://localhost:${server.port}`,
    reuseExistingServer: !process.env.CI,
  })),
  workers: process.env.CI ? cpus().length : undefined,
  retries: process.env.CI ? 2 : 0,
  timeout: 120_000,
  forbidOnly: !!process.env.CI,
  snapshotDir: 'tests/e2e/snapshots',
  // put all snapshots in one directory
  // https://playwright.dev/docs/api/class-testconfig#test-config-snapshot-path-template
  snapshotPathTemplate: '{snapshotDir}/{arg}-{projectName}-{platform}{ext}',
  projects: [
    {
      name: 'Desktop - Chromium',
      grepInvert: /@agnostic/,
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: {
          width: 1200,
          height: 1080,
        },
      },
    },
    {
      name: 'Mobile - Chromium',
      grepInvert: /@agnostic/,
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: {
          width: 414,
          height: 896,
        },
      },
    },
    {
      // If a test is browser/platform agnostic, add the @agnostic tag to the
      // test name. We omit the project name here to keep snapshot names tidy.
      name: '',
      grep: /@agnostic/,
      // put css snapshots in test filename subdirectories
      snapshotPathTemplate: '{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: {
          width: 1200,
          height: 1080,
        },
      },
    },
  ],
});

export default config;
