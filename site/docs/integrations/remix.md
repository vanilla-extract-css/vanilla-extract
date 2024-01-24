---
title: Remix
parent: integrations
---

# Remix

[Remix](https://remix.run) provides support for Vanilla Extract out of the box. See [Vanilla Extract | Remix](https://remix.run/docs/en/main/styling/vanilla-extract) for details.

Remix's (unstable) Vite compiler also works with the [Vite integration](/vite). It's as simple as adding the `@vanilla-extract/vite-plugin` to your Vite config:

```js
import { unstable_vitePlugin as remix } from '@remix-run/dev';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [remix(), vanillaExtractPlugin()]
});
```

See [Vite (Unstable) | Remix](https://remix.run/docs/en/main/future/vite#add-vanilla-extract-plugin) for more details.
