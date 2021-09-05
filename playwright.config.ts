import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // Look for test files in the "tests" directory, relative to this configuration file
  testMatch: '**/*.spec.ts',

  updateSnapshots: 'none',
  expect: {
    toMatchSnapshot: {
      threshold: 0.15,
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
