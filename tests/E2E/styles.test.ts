import {
  startFixture,
  getNodeStyles,
  TestServer,
  getTestNodes,
} from 'test-helpers';
import { Viewport } from 'puppeteer';

let startingPort = 10000;
const getNextPort = () => (startingPort += 5);

const tests = [
  // ['themed', 'browser'],
  // ['themed', 'mini-css-extract'],
  // ['themed', 'style-loader'],
  // ['themed', 'esbuild'],
  // ['themed', 'esbuild-runtime'],
  // ['themed', 'vite'],
  // ['themed', 'snowpack'],
  // ['features', 'browser'],
  // ['features', 'mini-css-extract'],
  // ['features', 'style-loader'],
  // ['features', 'esbuild'],
  // ['features', 'esbuild-runtime'],
  ['features', 'vite'],
  // ['features', 'snowpack'],
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
  describe.each(tests)('%s %s', (fixture, compileType) => {
    let server: TestServer;
    const testNodes = getTestNodes(fixture);

    beforeAll(async () => {
      server = await startFixture(fixture, {
        type: compileType,
        basePort: getNextPort(),
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
