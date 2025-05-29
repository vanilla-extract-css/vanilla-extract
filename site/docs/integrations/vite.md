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

### enableDevCache

This option can help mitigate dev mode [performance issues](https://github.com/vanilla-extract-css/vanilla-extract/issues/1488) in large projects, especially those using `sprinkles` or other common `.css.ts` imports. It ensures that `.vanilla.css` virtual files are only invalidated and re-fetched when their contents have actually change. This is accomplished by creating a map of `.css.ts` file paths to MD5 hashes of their content.

The trade-offs for this option include more filesystem operations and potentially higher memory usage in the plugin.

```js
// vite.config.js

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default {
  plugins: [
    vanillaExtractPlugin({
      enableDevCache: true
    })
  ]
};
```