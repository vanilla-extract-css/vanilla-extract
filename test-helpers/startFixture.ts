import WDS from 'webpack-dev-server';
import webpack from 'webpack';

export interface TestServer {
  url: string;
  close: () => void;
}

let portCounter = 11000;

export const startFixture = (fixtureName: string): Promise<TestServer> =>
  new Promise(async (resolve) => {
    const config = require(`../fixtures/${fixtureName}/webpack.config.js`);
    const compiler = webpack(config);

    const port = portCounter++;
    const server = new WDS(compiler);

    compiler.hooks.done.tap('treat-test-helper', () => {
      resolve({ url: `http://localhost:${port}`, close: () => server.close() });
    });

    server.listen(port);
  });

const fixtureName = process.argv[2];

startFixture(fixtureName).then((server) => {
  // eslint-disable-next-line no-console
  console.log('Fixture running on', server.url);
});
