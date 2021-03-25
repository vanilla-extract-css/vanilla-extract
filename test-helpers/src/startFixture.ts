import { TreatPlugin } from '@mattsjones/css-webpack-plugin';
import WDS from 'webpack-dev-server';
import webpack, { Configuration } from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const getTestNodes = (fixture: string) =>
  require(`@fixtures/${fixture}/test-nodes.json`);

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
  hot?: boolean;
}
export const startFixture = (
  fixtureName: string,
  { type = 'mini-css-extract', hot = false }: FixtureOptions = {},
): Promise<TestServer> =>
  new Promise(async (resolve) => {
    console.log(
      `Starting ${fixtureName} fixture using ${type}${hot ? ' with HMR' : ''}`,
    );
    const fixtureEntry = require.resolve(`@fixtures/${fixtureName}`);
    const config = webpackMerge<Configuration>(defaultWebpackConfig, {
      entry: fixtureEntry,
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
      plugins: type !== 'browser' ? [new TreatPlugin()] : undefined,
    });
    const compiler = webpack(config);

    const port = portCounter++;
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
