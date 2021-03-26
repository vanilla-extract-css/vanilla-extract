import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import WDS from 'webpack-dev-server';
import webpack, { Configuration } from 'webpack';
import portfinder from 'portfinder';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { stylesheetName } from './getStylesheet';

export const getTestNodes = (fixture: string) =>
  require(`@fixtures/${fixture}/test-nodes.json`);

const defaultWebpackConfig: Configuration = {
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
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
              plugins: ['@vanilla-extract/babel-plugin'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: stylesheetName,
    }),
  ],
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
  hot?: boolean;
  mode?: 'development' | 'production';
  basePort?: number;
}
export const startFixture = (
  fixtureName: string,
  {
    type = 'mini-css-extract',
    hot = false,
    mode = 'development',
    basePort,
  }: FixtureOptions = {},
): Promise<TestServer> =>
  new Promise(async (resolve) => {
    console.log(`Starting ${fixtureName} fixture`);
    console.table(
      Object.entries({
        type,
        hot,
        mode,
      }),
    );
    const fixtureEntry = require.resolve(`@fixtures/${fixtureName}`);
    const config = webpackMerge<Configuration>(defaultWebpackConfig, {
      entry: fixtureEntry,
      mode,
      module: {
        rules: [
          {
            test: /\.css$/i,
            use: [
              type === 'mini-css-extract'
                ? MiniCssExtractPlugin.loader
                : 'style-loader',
              'css-loader',
            ],
          },
        ],
      },
      plugins: type !== 'browser' ? [new VanillaExtractPlugin()] : undefined,
    });
    const compiler = webpack(config);

    const port = await portfinder.getPortPromise({ port: basePort });
    const server = new WDS(compiler, {
      hot,
    });

    compiler.hooks.done.tap('vanilla-extract-test-helper', () => {
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
