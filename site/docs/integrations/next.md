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

If you don't have a `next.config.js` or `next.config.ts` file in the root of your project, create one. Add the plugin to your Next.js config file.

```ts
// next.config.ts
import type { NextConfig } from 'next';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {};

export default withVanillaExtract(nextConfig);
```

If required, this plugin can be composed with other plugins.

```ts
// next.config.ts
import type { NextConfig } from 'next';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import createMDX from '@next/mdx';

const withVanillaExtract = createVanillaExtractPlugin();

const withMDX = createMDX({
  extension: /\.mdx$/
});

const nextConfig: NextConfig = {};

export default withVanillaExtract(withMDX(nextConfig));
```

## Version Support

- **Next.js >= 15.3**: Both Turbopack and Webpack are supported
- **Next.js <= 15.2**: Webpack-only support

## Configuration

The plugin accepts the following as optional configuration, passed to `createVanillaExtractPlugin`.

### identifiers

Different formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can be configured by selecting from the following options:

- `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
- `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `myfile_mystyle_hnw5tz3`
- A custom identifier function takes an object parameter with properties `hash`, `filePath`, `debugId`, and `packageName`, and returns a customized identifier. e.g.

```ts
// next.config.ts
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin({
  identifiers: ({ hash }) => `prefix_${hash}`
});
```

Each integration will set a default value based on the configuration options passed to the bundler.

### turbopackMode

You can control Turbopack autoconfiguration using `turbopackMode`:

- `auto` (default): enable Turbopack config only when Next >= 15.3
- `on`: force-enable Turbopack config
- `off`: never configure Turbopack (Webpack-only)

Disable Turbopack integration explicitly:

```ts
// next.config.ts
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin({
  turbopackMode: 'off'
});

export default withVanillaExtract({});
```

Force-enable Turbopack integration:

```ts
// next.config.ts
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin({
  turbopackMode: 'on'
});

export default withVanillaExtract({});
```

If you already manage `turbopack.rules` yourself for the same file globs, the plugin will throw to avoid rule conflicts. In that case, set `turbopackMode: 'off'` and apply your Turbopack config manually.

### turbopackGlob

By default Turbopack integration processes `**/*.css.{ts,tsx,js,jsx}`. You can override this via `turbopackGlob`:

```ts
// next.config.ts
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin({
  turbopackGlob: ['**/*.css.ts', '**/*.css.tsx']
});

export default withVanillaExtract({});
```

## Transpiling Vanilla Extract-dependent Libraries

By default, Next.js does not allow importing of TypeScript files outside of the app root.

If your application depends on a TypeScript library, whether that be a local package within your app's monorepo, or a dependency inside `node_modules`, and that library styles its components with Vanilla Extract, but does _not_ compile its styles, then that library needs to be added to [`transpilePackages`] in your Next.js config:

```tsx
// App.tsx
import { Button } from '@company/design-system';

export default function App() {
  // This is unstyled and/or throws errors about Vanilla Extract being used in runtime
  return <Button>Hello, World!</Button>;
}
```

```ts
// next.config.ts
import type { NextConfig } from 'next';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  transpilePackages: ['@company/design-system']
};

// Next.js Vanilla Extract integration will now compile @company/design-system styles
export default withVanillaExtract(nextConfig);
```

[`transpilepackages`]: https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages
