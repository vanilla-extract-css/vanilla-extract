import {
  getStylesheet,
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';

const workerIndex = parseInt(process.env.JEST_WORKER_ID ?? '', 10);
let testCounter = 0;

const buildTypes = ['vite', 'esbuild', 'mini-css-extract', 'parcel'] as const;

buildTypes.forEach((buildType) => {
  describe(`themed - ${buildType}`, () => {
    let server: TestServer;

    beforeAll(async () => {
      const portRange = 100 * workerIndex;

      server = await startFixture('themed', {
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
