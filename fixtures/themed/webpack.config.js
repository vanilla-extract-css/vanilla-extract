const HtmlWebpackPlugin = require('html-webpack-plugin');
const { TreatPlugin } = require('@treat/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: require.resolve('./src/index.ts'),
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
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new TreatPlugin({ outputLoaders: [MiniCssExtractPlugin.loader] }),
  ],
};
