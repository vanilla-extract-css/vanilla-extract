---
title: Next.js
parent: integrations
---

# Next.js

A plugin for integrating vanilla-extract with [Next.js](https://nextjs.org).

## Installation

```bash
npm install --save-dev @vanilla-extract/next-plugin
```

## Setup

If you don't have a `next.config.js` file in the root of your project, create one. Add the plugin to your `next.config.js` file.

```js
const {
  createVanillaExtractPlugin
} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withVanillaExtract(nextConfig);
```

If required, this plugin can be composed with other plugins.

```js
const {
  createVanillaExtractPlugin
} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

const withMDX = require('@next/mdx')({
  extension: /\.mdx$/
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withVanillaExtract(withMDX(nextConfig));
```

## Configuration

The plugin accepts the following as optional configuration:

### identifiers

Different formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can be configured by selecting from the following options:

- `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
- `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `myfile_mystyle_hnw5tz3`
- A custom identifier function takes an object parameter with properties `hash`, `filePath`, `debugId`, and `packageName`, and returns a customized identifier. e.g.

```ts
const withVanillaExtract = createVanillaExtractPlugin({
  identifiers: ({ hash }) => `prefix_${hash}`
});
```

Each integration will set a default value based on the configuration options passed to the bundler.

## Transpiling Vanilla Extract-dependent Libraries

By default, Next.js does not allow importing of TypeScript files outside of the app root.

If your application depends on a TypeScript library, whether that be a local package within your app's monorepo, or a dependnecy inside `node_modules`, and that library styles its components with Vanilla Extract, but does _not_ compile its styles, then that library needs to be added to [`transpilePackages`] in your Next.js config:

```tsx
// App.tsx
import { Button } from '@company/design-system';

export default function App() {
  // This is unstyled and/or throws errors about Vanilla Extract being used in runtime
  return <Button>Hello, World!</Button>;
}
```

```js
// next.config.js
import createVanillaExtractPlugin from '@vanilla-extract/next-plugin';

const nextConfig = {
  transpilePackages: ['@company/design-system']
};

// Next.js Vanilla Extract integration will now compile @company/design-system styles
module.exports = createVanillaExtractPlugin(nextConfig);
```

[`transpilepackages`]: https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages
