import { test as base } from '@playwright/test';

type TestFixtures = {
  port: number;
};

let testCounter = 0;

const test = base.extend<TestFixtures>({
  port: async ({}, use, workerInfo) => {
    const portRange = 100 * workerInfo.workerIndex;
    await use(10000 + portRange + testCounter++);
  },
});

export default test;
