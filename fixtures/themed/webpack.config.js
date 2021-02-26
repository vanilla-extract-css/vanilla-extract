const HtmlWebpackPlugin = require('html-webpack-plugin');

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
              babelrc: false,
              presets: [
                ['@babel/preset-env', { modules: false }],
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
