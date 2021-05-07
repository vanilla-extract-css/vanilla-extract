module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
    ['@babel/preset-env', { targets: { node: 14 } }],
  ],
};
