---
title: Vite
---

# Vite

A plugin for integrating vanilla-extract with [Vite](https://vitejs.dev/).

## Installation

```bash
npm install @vanilla-extract/vite-plugin
```

## Setup

Add the plugin to your Vite configuration.

```js
// vite.config.js

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default {
  plugins: [vanillaExtractPlugin()]
};
```

> Please note: There are currently no automatic readable class names during development. However, you can still manually provide a debug ID as the last argument to functions that generate scoped styles, e.g. `export const className = style({ ... }, 'className');`
