import { getStylesheet, startFixture, TestServer } from 'test-helpers';

const workerIndex = parseInt(process.env.JEST_WORKER_ID ?? '', 10);

const fixtures = ['unused-modules', 'themed', 'sprinkles', 'features'];

let testCounter = 0;

describe.each(fixtures)('esbuild - %s', (fixture) => {
  let server: TestServer;

  beforeAll(async () => {
    const portRange = 100 * workerIndex;
    server = await startFixture(fixture, {
      type: 'esbuild',
      mode: 'production',
      basePort: 12000 + portRange + testCounter++,
    });
  });

  it('should create valid stylesheet', async () => {
    expect(await getStylesheet(server.url, 'index.css')).toMatchSnapshot();
  });

  afterAll(async () => {
    await server.close();
  });
});
