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

### emitCssInSsr

Historically, extracting CSS was a side effect of building the browser bundle, with the server or static build process only needing the JavaScript references. However, many frameworks are now moving the evaluation of CSS to be a server-side or compile-time responsibility.

For the most common frameworks, Vanilla Extract will set this flag internally based on the plugins it discovers in the consumers Vite configuration.
This makes the plugin essentially zero config for the majority of cases.

For other cases, such as newer frameworks, it may be necessary to manually opt in to emitting CSS during server side rendering:

```js
// vite.config.js

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default {
  plugins: [
    vanillaExtractPlugin({
      emitCssInSsr: true
    })
  ]
};
```

### esbuildOptions

esbuild is used internally to compile `.css.ts` files before evaluating them to extract styles. You can pass additional options here to customize that process.
Accepts a subset of esbuild build options (`plugins`, `external`, `define`, `loader` and `tsconfig`). See the [build API](https://esbuild.github.io/api/#build-api) documentation.
