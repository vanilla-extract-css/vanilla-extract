---
title: layer
parent: api
---

# layer

Creates a single scoped [layer]. This avoids potential naming collisions with other layers.

> 🚧&nbsp;&nbsp;Ensure your target browsers [support layers].
> Vanilla Extract supports the [layers syntax][layer] but does not polyfill the feature in unsupported browsers.

```ts compiled
// framework.css.ts
import { layer } from '@vanilla-extract/css';

export const resetLayer = layer('reset');
export const libraryLayer = layer('library');
export const appLayer = layer('app');
```

Styles can then be assigned a specific layer by using the reference within the `@layer` key.

```ts compiled
// reset.css.ts
import { style } from '@vanilla-extract/css';
import { resetLayer } from './framework.css.ts';

export const noMargin = style({
  '@layer': {
    [resetLayer]: {
      margin: 0
    }
  }
});

// framework.css.ts
import { layer } from '@vanilla-extract/css';

export const resetLayer = layer('reset');
export const libraryLayer = layer('library');
export const appLayer = layer('app');
```

## Nesting layers

To facilitate organisation of styles, [layer nesting] is supported by providing a `parent` layer reference via the options object.
This will generate the shorthand syntax, i.e. `parent.child`, while also making the relationship between layers explicit.

```ts compiled
// layers.css.ts

import { layer } from '@vanilla-extract/css';

export const frameworkLayer = layer('framework');
export const layoutLayer = layer(
  { parent: frameworkLayer },
  'layout'
);
```

[layer]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
[support layers]: https://caniuse.com/css-cascade-layers
[layer nesting]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer#nesting_layers
