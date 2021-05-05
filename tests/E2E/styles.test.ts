import {
  startFixture,
  getNodeStyles,
  TestServer,
  getTestNodes,
} from 'test-helpers';
import { Viewport } from 'puppeteer';

const compileTypes = [
  ['browser', 10000],
  ['mini-css-extract', 10010],
  ['style-loader', 10020],
  ['esbuild', 10030],
  ['esbuild-runtime', 10040],
  ['vite', 10050],
] as const;

async function getPageStyles(
  url: string,
  testNodes: Record<string, string>,
  viewport?: Viewport,
): Promise<any> {
  await page.goto(url);
  if (viewport) {
    await page.setViewport(viewport);
  }

  const styles = {};

  for (const testNodeId of Object.values(testNodes)) {
    // @ts-expect-error
    styles[testNodeId] = await getNodeStyles(page, `#${testNodeId}`);
  }

  return styles;
}

describe('Styling and specificity', () => {
  describe(`Themed`, () => {
    describe.each(compileTypes)('%s', (compileType, port) => {
      let server: TestServer;
      const testNodes = getTestNodes('themed');

      beforeAll(async () => {
        server = await startFixture('themed', {
          type: compileType,
          basePort: port,
        });
      });

      it('on mobile all builds should match', async () => {
        const pageStyles = await getPageStyles(server.url, testNodes, {
          width: 400,
          height: 800,
        });

        expect(pageStyles).toMatchSnapshot();
      });

      it('on desktop all builds should match', async () => {
        const pageStyles = await getPageStyles(server.url, testNodes, {
          width: 1200,
          height: 900,
        });

        expect(pageStyles).toMatchSnapshot();
      });

      afterAll(async () => {
        await server.close();
      });
    });
  });
});
