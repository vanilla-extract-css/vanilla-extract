---
title: Next.js
---

# Next.js

1/ Install the dependencies.

```bash
npm install @vanilla-extract/css @vanilla-extract/babel-plugin @vanilla-extract/next-plugin
```

2/ If you don't have a `next.config.js` file in the root of your project, create one. Add the [Next.js](https://nextjs.org) plugin to your `next.config.js` file.

> 💡 This plugin accepts an optional [configuration object](#configuration).

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

3/ (Optional) If you want to automatically generate debug IDs during development, you can add the [Babel](https://babeljs.io) plugin. Note that this step will cause Next.js to switch from [SWC](https://github.com/swc-project/swc) to Babel, increasing build times. This may or may not be an issue depending on the size of your project.

> Note: While optional for Next.js, the Babel plugin is still required when trying to run `.css.ts` files in Node for unit testing since the files are no longer being processed by a bundler.

If you don't have a `.babelrc` file in the root of your project, create one. Add the Babel plugin to your `.babelrc` file, ensuring that you're also including `"next/babel"` in your `presets` array.

```json
{
  "presets": ["next/babel"],
  "plugins": ["@vanilla-extract/babel-plugin"]
}
```
