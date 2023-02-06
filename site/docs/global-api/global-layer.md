---
title: globalLayer
parent: global-api
---

# globalLayer

Creates a globally scoped [layer].

```ts compiled
// reset.css.ts

import { globalLayer, style } from '@vanilla-extract/css';

globalLayer('reset');
```

This is useful for orchestrating the order of layers within the stylesheet.

```ts compiled
// reset.css.ts

import { globalLayer, style } from '@vanilla-extract/css';

globalLayer('reset');
globalLayer('library');
globalLayer('app');
```

Styles can then be assigned a specific layer by name nested under the `@layer` key.

```ts compiled
// reset.css.ts

import { globalLayer, style } from '@vanilla-extract/css';

const reset = globalLayer('reset');

export const noMargin = style({
  '@layer': {
    [reset]: {
      margin: 0
    }
  }
});
```

As the layer name is global, it can be referred to directly by name. This means it is not necessary to use the reference being returned in order to target the layer.

```ts compiled
// reset.css.ts

import { globalLayer, style } from '@vanilla-extract/css';

globalLayer('reset');

export const noMargin = style({
  '@layer': {
    reset: {
      margin: 0
    }
  }
});
```

## Nesting layers

To facilitate organisation of styles, [layer nesting] is supported by providing a `parent` layer name via the options object.
This will generate the shorthand syntax, i.e. `parent.child`, while also making the relationship explicit.

```ts compiled
// reset.css.ts

import { globalLayer, style } from '@vanilla-extract/css';

globalLayer('library');
globalLayer({ parent: 'library' }, 'layout');
```

[layer]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
[layer nesting]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer#nesting_layers
