---
title: Setup
---

# Setup

There are currently a few integrations to choose from.

## Webpack

1. Install the dependencies.

```bash
$ npm install @vanilla-extract/css @vanilla-extract/babel-plugin @vanilla-extract/webpack-plugin
```
2. Add the [Babel](https://babeljs.io) plugin.
```json
{
  "plugins": ["@vanilla-extract/babel-plugin"]
}
```

3. Add the [webpack](https://webpack.js.org) plugin.
```js
// webpack.config.js

const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = {
  plugins: [new VanillaExtractPlugin()],
};
```

> You'll need to ensure you're handling CSS files in your webpack config.

For example:

```js
// webpack.config.js


const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new VanillaExtractPlugin(),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
};
```

## esbuild

1. Install the dependencies.
```bash
$ npm install @vanilla-extract/css @vanilla-extract/esbuild-plugin
```

2. Add the [esbuild](https://esbuild.github.io/) plugin to your build script.
```js
// build.js

const { vanillaExtractPlugin } = require('@vanilla-extract/esbuild-plugin');

require('esbuild').build({
  entryPoints: ['app.ts'],
  bundle: true,
  plugins: [vanillaExtractPlugin()],
  outfile: 'out.js',
}).catch(() => process.exit(1))
```

> Please note: There are currently no automatic readable class names during development. However, you can still manually provide a debug ID as the last argument to functions that generate scoped styles, e.g. `export const className = style({ ... }, 'className');`

## Gatsby

To add to your [Gatsby](https://www.gatsbyjs.com) site, use the [gatsby-plugin-vanilla-extract](https://github.com/KyleAMathews/gatsby-plugin-vanilla-extract) plugin.
