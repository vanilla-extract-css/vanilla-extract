const contents = [
  {
    group: 'overview',
    label: 'Overview',
    pages: [
      'getting-started',
      'style-object',
      'theming',
      'style-composition',
      'sprinkles',
      'test-environments',
    ],
  },
  {
    group: 'api',
    label: 'API',
    pages: [
      'style',
      'style-variants',
      'create-var',
      'fallback-var',
      'create-theme',
      'create-theme-contract',
      'assign-vars',
      'font-face',
      'keyframes',
    ],
  },
  {
    group: 'global-api',
    label: 'Global API',
    pages: [
      'global-style',
      'create-global-theme',
      'create-global-theme-contract',
      'global-font-face',
      'global-keyframes',
    ],
  },
  {
    group: 'packages',
    label: 'Packages',
    pages: ['sprinkles', 'recipes', 'dynamic', 'css-utils'],
  },
  {
    group: 'integrations',
    label: 'Integrations',
    pages: ['vite', 'esbuild', 'webpack', 'next', 'rollup', 'gatsby'],
  },
];

module.exports = contents;
