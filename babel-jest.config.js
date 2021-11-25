const baseConfig = require('./babel.config');

module.exports = {
  ...baseConfig,
  plugins: [
    ...(baseConfig.plugins ?? []),
    require.resolve('@vanilla-extract/babel-plugin'),
  ],
};
