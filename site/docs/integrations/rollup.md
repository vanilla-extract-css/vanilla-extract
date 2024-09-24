---
title: Rollup
parent: integrations
---

# Rollup

A plugin for integrating vanilla-extract with [Rollup](https://rollupjs.org/).

This plugin is useful for library development but not suitable for application bundles.
Rollup has no built-in CSS bundling, so this plugin just outputs styles as individual CSS assets.

For applications we instead recommend to use Vite
(which itself uses Rollup under the hood but comes with its own CSS bundling).

## Installation

```bash
npm install --save-dev @vanilla-extract/rollup-plugin
```

## Setup

Add the plugin to your Rollup configuration, along with any desired [plugin configuration](#configuration).

```js
// rollup.config.js
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';

export default {
  plugins: [vanillaExtractPlugin()]
};
```

This plugin works well with Rollup's `preserveModules`.

Rollup by default places assets in an "assets" directory.
You can configure [asset file names](https://rollupjs.org/guide/en/#outputassetfilenames)
if you care about CSS assets being placed right next to the corresponding JS files.

```js
// rollup.config.js
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';

export default {
  plugins: [vanillaExtractPlugin()],
  output: {
    preserveModules: true,
    assetFileNames({ name }) {
      return name?.replace(/^src\//, '') ?? '';
    }
  }
};
```

## Configuration

```js
// rollup.config.js
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';

export default {
  plugins: [
    vanillaExtractPlugin({
      // configuration
    })
  ]
};
```

The plugin accepts the following as optional configuration:

### identifiers

Different formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can be configured by selecting from the following options:

- `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
- `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `myfile_mystyle_hnw5tz3`
- A custom identifier function takes an object parameter with properties `hash`, `filePath`, `debugId`, and `packageName`, and returns a customized identifier. e.g.

```ts
vanillaExtractPlugin({
  identifiers: ({ hash }) => `prefix_${hash}`
});
```

Each integration will set a default value based on the configuration options passed to the bundler.

### esbuildOptions

esbuild is used internally to compile `.css.ts` files before evaluating them to extract styles. You can pass additional options here to customize that process.
Accepts a subset of esbuild build options (`plugins`, `external`, `define`, `loader`, `tsconfig` and `conditions`). See the [build API](https://esbuild.github.io/api/#build-api) documentation.
