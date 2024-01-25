const { join } = require('path');
const { HtmlRenderPlugin } = require('html-render-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { pages } = require('./docs-manifest.json');
const legacyRoutes = require('./legacy-routes.json');
const targetDirectory = join(__dirname, 'dist');

const isProduction = process.env.NODE_ENV === 'production';

const htmlRenderPlugin = new HtmlRenderPlugin({
  routes: ['', ...pages, ...legacyRoutes.map(({ from }) => from)],
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
      open: false,
    },
    mode,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|mdx?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: true,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.mdx?$/,
          use: ['mdx-loader', './code-block-loader'],
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
      ...(process.env.CI !== 'true' && isProduction
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: false,
            }),
          ]
        : []),
    ],
    stats: 'errors-warnings',
  },
  {
    name: 'render',
    target: 'node',
    externals: [
      nodeExternals({
        allowlist: [/^react-syntax-highlighter\/dist\/esm/, /^@docsearch\/css/],
      }),
    ],
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
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|mdx?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: true,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ['null-loader'],
        },
        {
          test: /\.mdx?$/,
          use: ['mdx-loader', './code-block-loader'],
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
    stats: 'errors-warnings',
  },
];
