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

Each integration will set a default value based on the configuration options passed to the bundler.
