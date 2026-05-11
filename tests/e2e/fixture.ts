import { test as base } from '@playwright/test';

type TestFixtures = {
  port: number;
};

let testCounter = 0;

const test = base.extend<TestFixtures>({
  // Playwright has to have a destructure as the first arg for some reason
  // oxlint-disable-next-line no-empty-pattern
  port: async ({}, use, workerInfo) => {
    const portRange = 100 * workerInfo.workerIndex;
    await use(9000 + portRange + testCounter++);
  },
});

export default test;
