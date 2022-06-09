---
title: style
---

# style

Creates styles attached to a locally scoped class name using the [Style object](/documentation/style-object/).

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const className = style({
  display: 'flex'
});
```

CSS Variables, simple pseudos, selectors and media/feature queries are all supported.

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';
import { vars } from './vars.css.ts';

export const className = style({
  display: 'flex',
  vars: {
    [vars.localVar]: 'green',
    '--global-variable': 'purple'
  },
  ':hover': {
    color: 'red'
  },
  selectors: {
    '&:nth-child(2n)': {
      background: '#fafafa'
    }
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 10
    }
  },
  '@supports': {
    '(display: grid)': {
      display: 'grid'
    }
  }
});
```

[Style composition](/documentation/style-composition/) can be used by passing an array.

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';

const base = style({ padding: 12 });

const primary = style([base, { background: 'blue' }]);
```
