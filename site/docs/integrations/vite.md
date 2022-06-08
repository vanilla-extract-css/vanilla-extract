---
title: Vite
---

# Vite

1/ Install the dependencies.

```bash
$ npm install @vanilla-extract/css @vanilla-extract/vite-plugin
```

2/ Add the [Vite](https://vitejs.dev/) plugin to your Vite config.

> 💡 This plugin accepts an optional [configuration object](#configuration).

```js
// vite.config.js

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default {
  plugins: [vanillaExtractPlugin()]
};
```

> Please note: There are currently no automatic readable class names during development. However, you can still manually provide a debug ID as the last argument to functions that generate scoped styles, e.g. `export const className = style({ ... }, 'className');`

## Configuration

### identifiers

Different formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can be configured by selecting from the following options:

- `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
- `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `myfile_mystyle_hnw5tz3`

Each integration will set a default value based on the configuration options passed to the bundler.

### esbuildOptions

esbuild is used internally to compile `.css.ts` files before evaluating them to extract styles. You can pass additional options here to customize that process.
Accepts a subset of esbuild build options (`plugins`, `external`, `define` and `loader`), see https://esbuild.github.io/api/#build-api.
