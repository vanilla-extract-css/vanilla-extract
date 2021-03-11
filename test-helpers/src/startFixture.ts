import { TreatPlugin } from '@mattsjones/css-webpack-plugin';
import WDS from 'webpack-dev-server';
import webpack, { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const getTestNodes = (fixture: string) =>
  require(`@treat/fixture-${fixture}/test-nodes.json`);

const defaultWebpackConfig: Configuration = {
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
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
              babelrc: false,
              presets: [
                '@babel/preset-typescript',
                '@babel/preset-react',
                [
                  '@babel/preset-env',
                  { targets: { node: 14 }, modules: false },
                ],
              ],
              plugins: ['@mattsjones/css-babel-plugin'],
            },
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin(), new MiniCssExtractPlugin()],
};

type StyleType = 'browser' | 'mini-css-extract' | 'style-loader';

export interface TestServer {
  type: StyleType;
  url: string;
  close: () => void;
}

let portCounter = 11000;

export interface FixtureOptions {
  type?: StyleType;
}
export const startFixture = (
  fixtureName: string,
  { type = 'mini-css-extract' }: FixtureOptions = {},
): Promise<TestServer> =>
  new Promise(async (resolve) => {
    const fixtureEntry = require.resolve(`@treat/fixture-${fixtureName}`);
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
      resolve({
        url: `http://localhost:${port}`,
        close: () => {
          server.close();
        },
        type,
      });
    });

    server.listen(port);
  });
