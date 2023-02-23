import { test, describe, expect, beforeAll, afterAll } from 'vitest';
import {
  getStylesheet,
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';

const workerIndex = parseInt(process.env.VITEST_POOL_ID ?? '', 10);

const buildTypes = [
  'vite',
  'esbuild',
  'mini-css-extract',
  // 'parcel'
] as const;

buildTypes.forEach((buildType, index) => {
  describe(`features - ${buildType}`, () => {
    let server: TestServer;

    beforeAll(async () => {
      const portRange = 100 * workerIndex;

      server = await startFixture('features', {
        type: buildType,
        mode: 'production',
        basePort: 12000 + portRange + index,
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
