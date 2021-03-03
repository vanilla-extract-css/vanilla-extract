import { TreatPlugin } from '@treat/webpack-plugin';
import WDS from 'webpack-dev-server';
import webpack, { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const defaultWebpackConfig: Configuration = {
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin(), new MiniCssExtractPlugin()],
};

export interface TestServer {
  url: string;
  close: () => void;
}

let portCounter = 11000;

interface FixtureOptions {
  type?: 'browser' | 'mini-css-extract' | 'style-loader';
}
export const startFixture = (
  fixtureName: string,
  { type = 'mini-css-extract' }: FixtureOptions = {},
): Promise<TestServer> =>
  new Promise(async (resolve) => {
    const fixtureEntry = require.resolve(`../fixtures/${fixtureName}`);
    const config = webpackMerge<Configuration>(defaultWebpackConfig, {
      entry: fixtureEntry,
      plugins:
        type !== 'browser'
          ? [
              new TreatPlugin({
                outputLoaders:
                  type === 'mini-css-extract'
                    ? [MiniCssExtractPlugin.loader]
                    : undefined,
              }),
            ]
          : undefined,
    });
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
