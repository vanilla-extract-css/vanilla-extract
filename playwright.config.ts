import { PlaywrightTestConfig, devices } from '@playwright/test';

// Prevent Vite from attempting to clear the screen
process.stdout.isTTY = false;

const config: PlaywrightTestConfig = {
  testMatch: '**/*.playwright.ts',
  updateSnapshots: 'none',
  expect: {
    toMatchSnapshot: {
      threshold: 0.2,
      maxDiffPixelRatio: 0.02,
    },
  },
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
};

export default config;
