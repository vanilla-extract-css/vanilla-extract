import {
  startFixture,
  getNodeStyles,
  TestServer,
  getTestNodes,
} from 'test-helpers';
import { Viewport } from 'puppeteer';

const variations = ['browser', 'mini-css-extract', 'style-loader'] as const;

async function getPageStyles(
  url: string,
  testNodes: Record<string, string>,
  viewport?: Viewport,
) {
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
    let servers: Array<TestServer>;
    const testNodes = getTestNodes('themed');

    beforeAll(async () => {
      servers = await Promise.all(
        variations.map((variation) =>
          startFixture('themed', {
            type: variation,
          }),
        ),
      );
    });

    describe('on mobile', () => {
      it('all builds should match', async () => {
        const results = await Promise.all(
          servers.map((server) =>
            getPageStyles(server.url, testNodes, { width: 400, height: 800 }),
          ),
        );

        for (const result of results) {
          expect(result).toEqual(results[0]);
        }

        expect(results[0]).toMatchSnapshot();
      });
    });

    describe('on desktop', () => {
      it('all builds should match', async () => {
        const results = await Promise.all(
          servers.map((server) =>
            getPageStyles(server.url, testNodes, { width: 1200, height: 900 }),
          ),
        );

        for (const result of results) {
          expect(result).toEqual(results[0]);
        }

        expect(results[0]).toMatchSnapshot();
      });
    });

    afterAll(() => {
      for (const server of servers) {
        server.close();
      }
    });
  });
});
