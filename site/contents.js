const contents = [
  {
    group: 'overview',
    label: 'Overview',
    pages: [
      'getting-started',
      'styling',
      'theming',
      'style-composition',
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
      'create-container',
      'layer',
      'add-function-serializer',
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
      'global-layer',
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
    pages: ['vite', 'esbuild', 'webpack', 'next', 'parcel', 'rollup', 'gatsby'],
  },
];

module.exports = contents;
