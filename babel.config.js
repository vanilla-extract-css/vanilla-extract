module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        targets: {
          browsers: 'defaults',
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
};
