const contents = [
  {
    group: 'getting-started',
    label: 'Getting Started',
    pages: [
      'installation',
      'style-object',
      'theming',
      'style-composition',
      'sprinkles',
    ],
  },
  {
    group: 'api',
    label: 'API',
    pages: [
      'style',
      'style-variants',
      'create-var',
      'assign-vars',
      'fallback-var',
      'font-face',
      'keyframes',
      'create-theme',
      'create-theme-contract',
    ],
  },
  {
    group: 'global-api',
    label: 'Global API',
    pages: [
      'global-style',
      'global-font-face',
      'global-keyframes',
      'create-global-theme',
      'create-global-theme-contract',
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
    pages: [
      'vite',
      'esbuild',
      'webpack',
      'rollup',
      'next',
      'gatsby',
      'test-environments',
    ],
  },
];

module.exports = contents;
