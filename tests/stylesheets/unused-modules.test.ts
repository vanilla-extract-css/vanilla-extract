import {
  getStylesheet,
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';
import { expect, describe, beforeAll, afterAll, test } from 'vitest';

const workerIndex = parseInt(process.env.VITEST_WORKER_ID ?? '', 10);
let testCounter = 0;

const buildTypes = ['vite', 'esbuild', 'mini-css-extract'] as const;

buildTypes.forEach((buildType) => {
  describe(`unused-modules - ${buildType}`, () => {
    let server: TestServer;

    beforeAll(async () => {
      const portRange = 100 * workerIndex;

      server = await startFixture('unused-modules', {
        type: buildType,
        mode: 'production',
        basePort: 12000 + portRange + testCounter++,
      });
    });

    test('should create valid stylesheet', async () => {
      expect(
        await getStylesheet(server.url, server.stylesheet),
      ).toMatchSnapshot();
    });

    afterAll(async () => {
      await server.close();
    });
  });
});
