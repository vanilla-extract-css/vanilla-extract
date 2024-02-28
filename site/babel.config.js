module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { bugfixes: true, targets: 'last 2 Chrome versions' },
    ],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
