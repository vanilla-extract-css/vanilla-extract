import { describe, beforeAll, afterAll, test, expect } from 'vitest';
import {
  getStylesheet,
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';

const workerIndex = parseInt(process.env.VITEST_POOL_ID ?? '', 10);
let testCounter = 0;

const buildTypes = [
  'vite',
  'esbuild',
  'esbuild-next',
  'mini-css-extract',
  // 'parcel',
] as const;

buildTypes.forEach((buildType) => {
  describe(`recipes - ${buildType}`, () => {
    let server: TestServer;

    beforeAll(async () => {
      const portRange = 100 * workerIndex;

      server = await startFixture('recipes', {
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
