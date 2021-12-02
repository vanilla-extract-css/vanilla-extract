module.exports = {
  extends: './babel.config',
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
  plugins: [require.resolve('@vanilla-extract/babel-plugin')],
};
