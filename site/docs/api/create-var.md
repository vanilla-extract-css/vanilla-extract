---
title: createVar
parent: api
---

# createVar

Creates a single scoped CSS Variable reference.

```ts compiled
// accent.css.ts

import { createVar, style } from '@vanilla-extract/css';

export const accentVar = createVar();
```

As you can see, no CSS is generated when you create a variable, it is only a reference that can be set later on.

## Setting the variable

The variable reference created above can be set using the [“vars” key](/documentation/styling/#css-variables).

```ts compiled
// accent.css.ts

import { createVar, style } from '@vanilla-extract/css';

export const accentVar = createVar();

export const blue = style({
  vars: {
    [accentVar]: 'blue'
  }
});

export const pink = style({
  vars: {
    [accentVar]: 'pink'
  }
});
```

Keep in mind the value of the variable can be changed in another class or even in a media query. For example, let’s change the value when the user prefers a dark color-scheme:

```ts compiled
// accent.css.ts

import { createVar, style } from '@vanilla-extract/css';

export const accentVar = createVar();

export const blue = style({
  vars: {
    [accentVar]: 'blue'
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: {
        [accentVar]: 'lightblue'
      }
    }
  }
});

export const pink = style({
  vars: {
    [accentVar]: 'pink'
  },
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: {
        [accentVar]: 'lightpink'
      }
    }
  }
});
```

## Using the variable

The variable reference can then be passed as the value for any CSS property.

```ts compiled
// style.css.ts

import { createVar, style } from '@vanilla-extract/css';
import { accentVar } from './accent.css.ts';

export const accentText = style({
  color: accentVar
});

// accent.css.ts
import { createVar, style } from '@vanilla-extract/css';

export const accentVar = createVar();

export const blue = style({
  vars: {
    [accentVar]: 'blue'
  }
});

export const pink = style({
  vars: {
    [accentVar]: 'pink'
  }
});
```

## Assigning variables dynamically

CSS variables can also be assigned dynamically using APIs in [the `@vanilla-extract/dynamic` package](/documentation/packages/dynamic).
