module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-react'],

  overrides: [
    {
      include: [
        './packages/css',
        './packages/dynamic',
        './packages/private',
        './packages/recipes',
        './packages/sprinkles',
        './packages/utils',
      ],
      presets: [['@babel/preset-env', { targets: { esmodules: true } }]],
    },
  ],
};
