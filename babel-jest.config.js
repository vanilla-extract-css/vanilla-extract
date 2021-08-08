const baseConfig = require('./babel.config');

module.exports = {
  ...baseConfig,
  plugins: [...(baseConfig.plugins ?? []), '@vanilla-extract/babel-plugin'],
};
