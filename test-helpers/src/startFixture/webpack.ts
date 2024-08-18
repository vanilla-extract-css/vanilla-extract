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
  output: {
    // For less noisy CSS snapshots
    // https://webpack.js.org/configuration/output/#outputpathinfo
    pathinfo: false,
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
    type = 'mini-css-extract',
    hot = false,
    mode = 'development',
    port,
    logLevel = 'errors-only',
  }: WebpackFixtureOptions,
): Promise<TestServer> =>
  new Promise(async (resolve) => {
    const fixtureEntry = require.resolve(
      `@fixtures/${fixtureName}/src/index.ts`,
    );
    const config = webpackMerge<Configuration>(defaultWebpackConfig, {
      entry: fixtureEntry,
      infrastructureLogging: {
        level: 'none',
      },
      mode,
      module: {
        rules: [
          {
            test: /\.vanilla\.css$/i,
            use: [
              type === 'mini-css-extract'
                ? MiniCssExtractPlugin.loader
                : require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  url: false,
                },
              },
            ],
          },
          {
            test: /\.(js|ts|tsx)$/,
            exclude: [/node_modules/],
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  presets: [
                    [
                      require.resolve('@babel/preset-env'),
                      { bugfixes: true, targets: 'last 2 Chrome versions' },
                    ],
                    require.resolve('@babel/preset-typescript'),
                    [
                      require.resolve('@babel/preset-react'),
                      { runtime: 'automatic' },
                    ],
                  ],
                },
              },
            ],
          },
        ],
      },
      plugins: type !== 'browser' ? [new VanillaExtractPlugin()] : undefined,
    });
    const compiler = webpack(config);

    const server = new WDS(
      {
        hot,
        onListening: () => {
          resolve({
            url: `http://localhost:${port}`,
            close: () =>
              new Promise<void>((resolveClose) =>
                server.stopCallback(() => {
                  compiler.close(() => resolveClose());
                }),
              ),
            type,
            stylesheet: 'main.css',
          });
        },
        port,
        devMiddleware: {
          stats: logLevel,
        },
      },
      compiler,
    );

    server.startCallback((err) => {
      console.log('Started webpack-dev-server');

      if (err) {
        throw err;
      }
    });
  });
