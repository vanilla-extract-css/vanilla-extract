import {
  getStylesheet,
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';

const workerIndex = parseInt(process.env.JEST_WORKER_ID ?? '', 10);
let testCounter = 0;

const buildTypes = ['vite', 'esbuild', 'mini-css-extract'] as const;

buildTypes.forEach((buildType) => {
  describe(`low-level - ${buildType}`, () => {
    let server: TestServer;

    beforeAll(async () => {
      const portRange = 100 * workerIndex;

      server = await startFixture('low-level', {
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
