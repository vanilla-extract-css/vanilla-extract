import { test as base } from '@playwright/test';

type TestFixtures = {
  port: number;
  _autoSnapshotSuffix: void;
};

let testCounter = 0;

const test = base.extend<TestFixtures>({
  port: async ({}, use, workerInfo) => {
    const portRange = 100 * workerInfo.workerIndex;
    await use(10000 + portRange + testCounter++);
  },

  // Workaround from https://github.com/microsoft/playwright/issues/11134
  // Removes the platform suffix from platform agnostic snapshots.
  _autoSnapshotSuffix: [
    async ({}, use, testInfo) => {
      if (testInfo.title.includes('@agnostic')) {
        testInfo.snapshotSuffix = '';
      }
      await use();
    },
    { auto: true },
  ],
});

export default test;
