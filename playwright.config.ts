import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testMatch: '**/*.playwright.ts',
  updateSnapshots: 'none',
  expect: {
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  projects: [
    {
      name: 'Desktop - Chromium',
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
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        viewport: {
          width: 414,
          height: 896,
        },
      },
    },
  ],
};
export default config;
