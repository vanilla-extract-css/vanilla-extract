---
title: layer
parent: api
---

# layer

Creates a single scoped [layer]. This avoids potential naming collisions with other layers.

> 🚧&nbsp;&nbsp;Ensure your target browsers [support layers].
> Vanilla Extract supports the [layers syntax][layer] but does not polyfill the feature in unsupported browsers.

```ts compiled
// layers.css.ts
import { layer } from '@vanilla-extract/css';

export const reset = layer('reset');
export const framework = layer('framework');
export const app = layer('app');
```

## Nesting layers

To facilitate organisation of styles, [layer nesting] is supported by providing a `parent` layer reference via the options object.
This will generate the shorthand syntax, i.e. `parent.child`, while also making the relationship between layers explicit.

```ts compiled
// layers.css.ts

import { layer } from '@vanilla-extract/css';

export const reset = layer('reset');
export const framework = layer('framework');
export const typography = layer(
  { parent: framework },
  'typography'
);
```

## Assigning styles

Styles can be assigned to a layer by name, using the `@layer` key in the style object.

In this example, we first import the `layers.css.ts` stylesheet, setting up the order of the layers, then create a style within the `reset` layer.

```ts compiled
// reset.css.ts
import { style } from '@vanilla-extract/css';
import { reset } from './layers.css.ts';

export const noMargin = style({
  '@layer': {
    [reset]: {
      margin: 0
    }
  }
});

// layers.css.ts
import { layer } from '@vanilla-extract/css';

export const reset = layer('reset');
export const framework = layer('framework');
export const typography = layer(
  { parent: 'framework' },
  'typography'
);
```

## Layer merging

In order to generate the smallest possible CSS output, Vanilla Extract will merge styles that are assigned to the same layer within the same file, if it can be done without impacting the precedence of the rules.

Notice in this example, while the `themedHeading` style is created before the other styles, it appears later in the stylesheet. This is due to it being assigned to the `theme` layer — which is declared after the `base` layer.

```ts compiled
// typography.css.ts
import { style, layer } from '@vanilla-extract/css';

const base = layer();
const theme = layer();

const themedHeading = style({
  '@layer': {
    [theme]: {
      color: 'rebeccapurple'
    }
  }
});
const text = style({
  '@layer': {
    [base]: {
      fontSize: '1rem'
    }
  }
});
const heading = style({
  '@layer': {
    [base]: {
      fontSize: '2.4rem'
    }
  }
});
```

[layer]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
[layer nesting]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer#nesting_layers
[support layers]: https://caniuse.com/css-cascade-layers
