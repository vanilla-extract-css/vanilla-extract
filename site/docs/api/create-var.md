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

## CSS Properties

You can also create typed css [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) using `createVar`:

```ts compiled
// accent.css.ts

import { createVar, style } from '@vanilla-extract/css';

export const accentVar = createVar({
  syntax: '<color>',
  inherits: false,
  initialValue: 'blue'
});
```

CSS properties created with `createVar` can be used in the same way as a regular css variable:

```ts compiled
export const pink = style({
  vars: {
    [accentVar]: 'pink'
  }
});
``` 

The main benefit of using `createVar` to create typed css properties is that they can be animated via `keyframes`.

```ts compiled
const angle = createVar({
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg',
});

const angleKeyframes = keyframes({
  '0%': {
    [getVarName(angle)]: '0deg',
  },
  '100%': {
    [getVarName(angle)]: '360deg',
  },
});

export const root = style({
  backgroundImage: `linear-gradient(${angle}, rgba(153, 70, 198, 0.35) 0%, rgba(28, 56, 240, 0.46) 100%)`,
  animation: `${angleKeyframes} 7s infinite ease-in-out both`,
  
  vars: {
    // This will fallback to 180deg if the @property is not supported by the browser
    [angle]: fallbackVar(angle, '180deg'),
  }
});

```