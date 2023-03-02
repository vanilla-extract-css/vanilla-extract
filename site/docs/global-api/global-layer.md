---
title: globalLayer
parent: global-api
---

# globalLayer

Creates a globally scoped [layer].

> 🚧&nbsp;&nbsp;Ensure your target browsers [support layers].
> Vanilla Extract supports the [layers syntax][layer] but does not polyfill the feature in unsupported browsers.

```ts compiled
// layers.css.ts

import { globalLayer } from '@vanilla-extract/css';

globalLayer('reset');
```

Useful for orchestrating the order of layers within the stylesheet, for example:

```ts compiled
// layers.css.ts

import { globalLayer } from '@vanilla-extract/css';

globalLayer('reset');
globalLayer('framework');
globalLayer('app');
```

## Nesting layers

To facilitate organisation of styles, [layer nesting] is supported by providing a `parent` layer name via the options object.
This will generate the shorthand syntax, i.e. `parent.child`, while also making the relationship between layers explicit.

```ts compiled
// layers.css.ts

import { globalLayer } from '@vanilla-extract/css';

globalLayer('reset');
globalLayer('framework');
globalLayer({ parent: 'framework' }, 'typography');
```

## Assigning styles

Styles can be assigned to a layer by name, using the `@layer` key in the style object.

In this example, we first import the `layers.css.ts` stylesheet, setting up the order of the layers, then create a style within the `reset` layer.

```ts compiled
// reset.css.ts

import { style } from '@vanilla-extract/css';
import './layers.css.ts';

export const noMargin = style({
  '@layer': {
    reset: {
      margin: 0
    }
  }
});

// layers.css.ts

import { globalLayer } from '@vanilla-extract/css';

globalLayer('reset');
globalLayer('framework');
globalLayer({ parent: 'framework' }, 'typography');
```

Best practice would be to expose the layer references from the `layers.css.ts` stylesheet, and use those when creating styles.

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

import { globalLayer } from '@vanilla-extract/css';

export const reset = globalLayer('reset');
export const framework = globalLayer('framework');
export const typography = globalLayer(
  { parent: 'framework' },
  'typography'
);
```

This is particularly useful when using the nested layers feature, as the parent and child names are computed.

In our example, the name of the typography layer becomes `framework.typography`:

```ts compiled
// text.css.ts

import { style } from '@vanilla-extract/css';
import { typography } from './layers.css.ts';

export const standard = style({
  '@layer': {
    [typography]: {
      fontSize: '1rem'
    }
  }
});

// layers.css.ts

import { globalLayer } from '@vanilla-extract/css';

export const reset = globalLayer('reset');
export const framework = globalLayer('framework');
export const typography = globalLayer(
  { parent: 'framework' },
  'typography'
);
```

## Layer merging

In order to generate the smallest possible CSS output, Vanilla Extract will merge styles that are assigned to the same layer within the same file, if it can be done without impacting the precedence of the rules.

Notice in this example, while the `themedHeading` style is created before the other styles, it appears later in the stylesheet. This is due to it being assigned to the `theme` layer — which is declared after the `base` layer.

```ts compiled
// typography.css.ts
import { style, globalLayer } from '@vanilla-extract/css';

const base = globalLayer('base');
const theme = globalLayer('theme');

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
