---
title: Rollup
---

# Rollup

A plugin for integrating vanilla-extract with [Rollup](https://rollupjs.org/).

> Note: This option is useful for library development but not suitable for application bundles.
> Rollup has no built-in CSS bundling, so this plugin just outputs styles as individual CSS assets.
> For applications we instead recommend to use Vite
> (which itself uses Rollup under the hood but comes with its own CSS bundling).

## Installation

```bash
npm install @vanilla-extract/rollup-plugin
```

## Setup

Add the plugin to your Rollup configuration.

```js
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';

// rollup.config.js
export default {
  plugins: [vanillaExtractPlugin(), ...]
}
```

This plugin works well with Rollup's `preserveModules`.

Rollup by default places assets in an "assets" directory.
You can configure [asset file names](https://rollupjs.org/guide/en/#outputassetfilenames)
if you care about CSS assets being placed right next to the corresponding JS files.

```js
  preserveModules: true,
  assetFileNames({ name }) {
    return name?.replace(/^src\//, '') ?? '';
  },
```
