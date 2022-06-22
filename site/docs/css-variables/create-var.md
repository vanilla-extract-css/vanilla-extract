---
title: createVar
---

# createVar

Creates a single scoped CSS Variable reference.

```ts compiled
// style.css.ts

import { createVar, style } from '@vanilla-extract/css';

export const accentVar = createVar();
```

## Setting the variable

The variable reference created above can be applied using the `vars` key within the [style object](/documentation/style-object/#css-variables).

```ts compiled
// accent.css.ts

import { createVar, style } from '@vanilla-extract/css';

export const accentVar = createVar();

export const blueAccent = style({
  vars: {
    [accentVar]: 'blue'
  }
});

export const pinkAccent = style({
  vars: {
    [accentVar]: 'pink'
  }
});
```

Keep in mind the value of the variable can be changed in another class or media query, for example if the consumer prefers a dark color-scheme.

```ts compiled
// accent.css.ts

import { createVar, style } from '@vanilla-extract/css';

export const accentVar = createVar();

export const blueAccent = style({
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

export const pinkAccent = style({
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

export const blueAccent = style({
  vars: {
    [accentVar]: 'blue'
  }
});

export const pinkAccent = style({
  vars: {
    [accentVar]: 'pink'
  }
});
```
