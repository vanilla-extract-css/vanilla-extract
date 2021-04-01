import { getStylesheet, startFixture, TestServer } from 'test-helpers';

const fixtures = ['unused-modules', 'themed'];

describe('Stylesheet', () => {
  describe.each(fixtures)('%s - webpack', (fixture) => {
    let server: TestServer;

    beforeAll(async () => {
      server = await startFixture(fixture, {
        type: 'mini-css-extract',
        mode: 'production',
        basePort: 9000,
      });
    });

    it('should create valid stylesheet', async () => {
      expect(await getStylesheet(server.url)).toMatchSnapshot();
    });

    afterAll(async () => {
      await server.close();
    });
  });

  describe.each(fixtures)('%s - esbuild', (fixture) => {
    let server: TestServer;

    beforeAll(async () => {
      server = await startFixture(fixture, {
        type: 'esbuild',
        mode: 'production',
        basePort: 9000,
      });
    });

    it('should create valid stylesheet', async () => {
      expect(await getStylesheet(server.url, 'index.css')).toMatchSnapshot();
    });

    afterAll(async () => {
      await server.close();
    });
  });
});
