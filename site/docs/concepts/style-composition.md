---
title: Style composition
---

# Style composition

Style composition is a special feature of vanilla-extract that makes it easy to get maximum re-use from your styles.
It allows you to pass an array of class names and/or [style objects](/documentation/style-object/) but continue to treat them as if they are a single class name.

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';

const base = style({ padding: 12 });

const primary = style([base, { background: 'blue' }]);

const secondary = style([base, { background: 'aqua' }]);
```

Let's look at how this works in practice.

When you create a style you recieve a class name back in return.

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';

// base ≈ 'base_12345'
const base = style({ padding: 12 });
```

However, when using style composition you will recive multiple classes in a single string, separated by a single space ' ' character, often referred to as a classlist.
This doesn't affect usage when assigning to the class property on DOM elements as they already accept a classlist.
However, what if we want to use our style inside another styles selector?

```ts
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

This is solved by assigning an additional class to all style compositions so they can be uniquely identified.
When selectors are processed internally, the composed classes are removed, only leaving behind the unique identifier classes.
This allows you to treat them as if they were a single class within vanilla-extract selectors.
Finally, if the extra identifier class is unneeded, then it is removed from the output completely.

```ts
// styles.css.ts

import { style, globalStyle } from '@vanilla-extract/css';

const background = style({ background: 'mintcream' });
const padding = style({ padding: 12 });

export const container = style([background, padding]);

globalStyle(`${container} *`, {
  boxSizing: 'border-box'
});
```
