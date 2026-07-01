---
title: Vite
parent: integrations
---

# Vite

A plugin for integrating vanilla-extract with [Vite](https://vitejs.dev/).

## Installation

```bash
npm install --save-dev @vanilla-extract/vite-plugin
```

## Setup

Add the plugin to your Vite configuration, along with any desired [plugin configuration](#configuration).

```js
// vite.config.js

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default {
  plugins: [vanillaExtractPlugin()]
};
```

## Configuration

```js
// vite.config.js

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

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

### include / exclude

Control which files the plugin processes using glob patterns or regular expressions. This uses the same filter syntax as [@rollup/pluginutils](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter).

By default, the plugin processes all files matching `.css.ts`, `.css.js`, `.css.mjs`, etc. Use `exclude` to skip pre-compiled `.css.js` files from libraries that shouldn't be reprocessed:

```ts
vanillaExtractPlugin({
  // Skip processing pre-compiled CSS from a specific library
  exclude: [/node_modules\/my-design-system/]
});
```

This is useful when consuming libraries that publish pre-compiled vanilla-extract CSS with non-serializable exports (like recipe functions). Without `exclude`, the plugin would try to reprocess these files and fail with "Invalid exports" errors.

```ts
vanillaExtractPlugin({
  // Only process files in src/
  include: ['src/**/*.css.ts'],
  // But skip any vendor styles
  exclude: ['src/vendor/**']
});
```
