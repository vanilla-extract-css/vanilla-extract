---
title: Next.js
parent: integrations
---

# Next.js

A plugin for integrating vanilla-extract with [Next.js](https://nextjs.org).

## Installation

```bash
npm install @vanilla-extract/next-plugin
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

Each integration will set a default value based on the configuration options passed to the bundler.
