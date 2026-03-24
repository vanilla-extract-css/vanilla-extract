import { createRequire } from 'module';
import minimist from 'minimist';
import path from 'path';
import http from 'http';

const require = createRequire(import.meta.url);
import webpack, { type Configuration } from 'webpack';
import WDS from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import handler from 'serve-handler';

const argv = minimist(process.argv.slice(2));
const port = Number(argv.port) || 4003;
const mode: 'development' | 'production' =
  argv.mode === 'production' ? 'production' : 'development';
const cssLoader: 'mini-css-extract' | 'style-loader' =
  argv['css-loader'] === 'style-loader' ? 'style-loader' : 'mini-css-extract';

const fixtures = [
  'features',
  'layers',
  'low-level',
  'recipes',
  'sprinkles',
  'themed',
  'thirdparty',
  'template-string-paths',
];

const entries = Object.fromEntries(
  fixtures.map((f) => [f, require.resolve(`@fixtures/${f}/src/index.ts`)]),
);

const config: Configuration = {
  entry: entries,
  mode,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  output: {
    path: path.resolve(import.meta.dirname, 'dist'),
    filename: '[name]/bundle.js',
    pathinfo: false,
  },
  module: {
    rules: [
      {
        test: /\.vanilla\.css$/i,
        use: [
          cssLoader === 'mini-css-extract'
            ? MiniCssExtractPlugin.loader
            : require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: { url: false },
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
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VanillaExtractPlugin(),
    ...(cssLoader === 'mini-css-extract'
      ? [new MiniCssExtractPlugin({ filename: '[name]/main.css' })]
      : []),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(import.meta.dirname, 'index.html'),
      chunks: [],
    }),
    ...fixtures.map(
      (f) =>
        new HtmlWebpackPlugin({
          filename: `${f}/index.html`,
          chunks: [f],
        }),
    ),
  ],
  infrastructureLogging: {
    level: 'none',
  },
};

if (mode === 'development') {
  const compiler = webpack(config);
  const server = new WDS(
    {
      hot: false,
      port,
      devMiddleware: { stats: 'errors-only' },
    },
    compiler,
  );

  server.startCallback((err) => {
    if (err) throw err;
    console.log(`Webpack dev server listening on port ${port}`);
  });
} else {
  webpack(config, (err, stats) => {
    if (err) throw err;
    if (stats?.hasErrors()) {
      console.error(stats.toString('errors-only'));
      process.exit(1);
    }
    const distDir = path.resolve(import.meta.dirname, 'dist');
    const server = http.createServer((req, res) =>
      handler(req, res, { public: distDir }),
    );
    server.listen(port, () => {
      console.log(`Webpack prod server listening on port ${port}`);
    });
  });
}
