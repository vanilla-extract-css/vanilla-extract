const { join } = require('path');
const { HtmlRenderPlugin } = require('html-render-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const docs = require('./docs-manifest.json');
const targetDirectory = join(__dirname, 'dist');

const isProduction = process.env.NODE_ENV === 'production';

const htmlRenderPlugin = new HtmlRenderPlugin({
  routes: ['', ...docs],
  renderConcurrency: 'parallel',
  renderDirectory: targetDirectory,
  mapStatsToParams: ({ webpackStats }) => {
    const { publicPath, entrypoints } = webpackStats.toJson();

    return {
      publicPath,
      entrypoints,
    };
  },
  extraGlobals: {
    Buffer,
  },
});

const publicPath = '/';
const mode = isProduction ? 'production' : 'development';

module.exports = [
  {
    name: 'client',
    output: {
      filename: 'client.js',
      path: targetDirectory,
      publicPath: '/',
    },
    entry: require.resolve('./src/client.tsx'),
    devServer: {
      open: !isProduction,
    },
    mode,
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|mdx?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  '@babel/preset-typescript',
                  [
                    '@babel/preset-env',
                    { modules: false, targets: 'last 2 Chrome versions' },
                  ],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: ['@vanilla-extract/babel-plugin'],
              },
            },
          ],
        },
        {
          test: /\.vanilla\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.mdx?$/,
          use: ['mdx-loader'],
        },
        {
          test: /\.(png?)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new VanillaExtractPlugin({
        test: /\.css\.ts$/,
        outputCss: true,
      }),
      new MiniCssExtractPlugin(),
      htmlRenderPlugin.statsCollectorPlugin,
      new CopyPlugin({
        patterns: [{ from: join(__dirname, 'src/assets') }],
      }),
      ...(process.env.CI !== 'true'
        ? [
            new BundleAnalyzerPlugin({
              openAnalyzer: false,
            }),
          ]
        : []),
    ],
    stats: 'errors-only',
  },
  {
    name: 'render',
    target: 'node',
    externals: [nodeExternals()],
    output: {
      filename: 'render.js',
      path: targetDirectory,
      libraryExport: 'default',
      library: 'static',
      libraryTarget: 'umd2',
      publicPath,
    },
    entry: require.resolve('./src/render.tsx'),
    mode,
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|mdx?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  '@babel/preset-typescript',
                  [
                    '@babel/preset-env',
                    { modules: false, targets: 'last 2 Chrome versions' },
                  ],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                plugins: ['@vanilla-extract/babel-plugin'],
              },
            },
          ],
        },
        {
          test: /\.vanilla\.css$/i,
          use: ['css-loader'],
        },
        {
          test: /\.mdx?$/,
          use: ['mdx-loader'],
        },
        {
          test: /\.(png?)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new VanillaExtractPlugin({
        test: /\.css\.ts$/,
        outputCss: false,
      }),
      htmlRenderPlugin.rendererPlugin,
    ],
    stats: 'errors-only',
  },
];
