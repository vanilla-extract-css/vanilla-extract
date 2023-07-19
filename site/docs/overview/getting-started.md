---
title: Getting Started
---

# Getting Started

## Installation

```bash
npm install @vanilla-extract/css
```

## Bundler Integration

Vanilla-extract requires that you have set up a bundler and configured it to handle CSS.
This allows your styles to be handled the same as any other dependencies in your code, importing and bundling only what is required.

Install your integration of preference:

- [vite]
- [esbuild]
- [webpack]
- [next]
- [parcel]
- [rollup]
- [gatsby]

## Create a style

A stylesheet can be made by adding a `.css.ts` file into your project.

For example:

```ts compiled
// app.css.ts
import { style } from '@vanilla-extract/css';

export const container = style({
  padding: 10
});
```

Importantly, this does two things:

1. creates a locally scoped class
2. exports the generated class name.

## Apply the style

To apply the style to an element, we need to import it from our stylesheet.

By importing the style we receive the scoped class name that was generated and we can apply it to the `class` attribute on the element.

```ts compiled
// app.ts
import { container } from './app.css.ts';

document.write(`
  <section class="${container}">
    ...
  </section>
`);

// styles.css.ts
import { style } from '@vanilla-extract/css';

export const container = style({
  padding: 10
});
```

As a side effect of this import, the CSS is also processed by the selected bundler integration and handled accordingly.

[vite]: /documentation/integrations/vite/
[esbuild]: /documentation/integrations/esbuild/
[webpack]: /documentation/integrations/webpack/
[next]: /documentation/integrations/next/
[rollup]: /documentation/integrations/rollup/
[gatsby]: /documentation/integrations/gatsby/
[parcel]: /documentation/integrations/parcel/
