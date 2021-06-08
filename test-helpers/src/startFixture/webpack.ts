import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import WDS from 'webpack-dev-server';
import webpack, { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { stylesheetName } from '../getStylesheet';
import { TestServer } from './types';

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

export interface WebpackFixtureOptions {
  type: 'browser' | 'mini-css-extract' | 'style-loader';
  hot?: boolean;
  mode?: 'development' | 'production';
  port: number;
  logLevel?: Configuration['stats'];
}
export const startWebpackFixture = (
  fixtureName: string,
  {
    type,
    hot = false,
    mode = 'development',
    port,
    logLevel = 'errors-only',
  }: WebpackFixtureOptions,
): Promise<TestServer> =>
  new Promise(async (resolve) => {
    const fixtureEntry = require.resolve(`@fixtures/${fixtureName}`);
    const config = webpackMerge<Configuration>(defaultWebpackConfig, {
      entry: fixtureEntry,
      mode,
      module: {
        rules: [
          {
            test: /\.vanilla\.css$/i,
            use: [
              type === 'mini-css-extract'
                ? MiniCssExtractPlugin.loader
                : 'style-loader',
              {
                loader: 'css-loader',
                options: {
                  url: false,
                },
              },
            ],
          },
        ],
      },
      plugins: type !== 'browser' ? [new VanillaExtractPlugin()] : undefined,
    });
    const compiler = webpack(config);

    const server = new WDS(compiler, {
      hot,
      stats: logLevel,
      noInfo: true,
      onListening: () => {
        resolve({
          url: `http://localhost:${port}`,
          close: () =>
            new Promise<void>((resolveClose) =>
              server.close(() => {
                compiler.close(() => resolveClose());
              }),
            ),
          type,
        });
      },
    });

    server.listen(port);
  });
