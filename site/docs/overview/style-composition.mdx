---
title: Composition
---

# Style Composition

Style composition is a special feature of vanilla-extract that makes it easy to get maximum re-use from your styles.
It allows you to pass an array of class names and/or [styles] but continue to treat them as if they are a single class name.

```ts compiled
// styles.css.ts

import { style } from '@vanilla-extract/css';

const base = style({ padding: 12 });

const primary = style([base, { background: 'blue' }]);

const secondary = style([base, { background: 'aqua' }]);
```

Let's look at how this works in practice.

When you create a style you receive a class name back in return.

```ts compiled
// styles.css.ts

import { style } from '@vanilla-extract/css';

// base = 'styles_base__8uideo0'
const base = style({ padding: 12 });
```

However, when using style composition you will receive multiple classes in a single string, separated by a single space character, often referred to as a classlist.

```ts compiled
// styles.css.ts

import { style } from '@vanilla-extract/css';

// base = 'styles_base__8uideo0'
const base = style({ padding: 12 });

// primary = 'styles_base__8uideo0 styles_primary__8uideo1'
const primary = style([base, { background: 'blue' }]);
```

This doesn't affect usage when assigning to the class property on DOM elements as they already accept a classlist.
However, what if we want to use our style inside another styles selector?

```ts compiled
// styles.css.ts

import { style } from '@vanilla-extract/css';

const base = style({ padding: 12 });

const primary = style([base, { background: 'blue' }]);

const text = style({
  selectors: {
    [`${primary} &`]: {
      color: 'white'
    }
  }
});
```

When selectors are processed internally, the composed classes are removed, only leaving behind a single unique identifier class.
This allows you to treat them as if they were a single class within vanilla-extract selectors.

To ensure that this behaviour works as expected, when multiple pre-existing classes are composed, a new identifier is created and added to the classlist.

```ts compiled
// styles.css.ts

import { style, globalStyle } from '@vanilla-extract/css';

const background = style({ background: 'mintcream' });
const padding = style({ padding: 12 });

// container = 'styles_container__8uideo2'
export const container = style([background, padding]);

globalStyle(`${container} *`, {
  boxSizing: 'border-box'
});
```

[styles]: /documentation/styling/
