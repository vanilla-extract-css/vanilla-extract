module.exports = {
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 60,
        trailingComma: 'none',
      },
    },
  ],
};
