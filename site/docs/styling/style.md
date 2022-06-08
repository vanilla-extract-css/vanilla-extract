---
title: style
---

# style

Creates styles attached to a locally scoped class name.

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

Selectors can also contain references to other scoped class names.

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const parentClass = style({});

export const childClass = style({
  selectors: {
    [`${parentClass}:focus &`]: {
      background: '#fafafa'
    }
  }
});
```

> 💡 To improve maintainability, each style block can only target a single element. To enforce this, all selectors must target the “&” character which is a reference to the current element.
>
> For example, `'&:hover:not(:active)'` and `` [`${parentClass} &`] `` are considered valid, while `'& a[href]'` and `` [`& ${childClass}`] `` are not.
>
> If you want to target another scoped class then it should be defined within the style block of that class instead.
>
> For example, `` [`& ${childClass}`] `` is invalid since it doesn’t target “&”, so it should instead be defined in the style block for `childClass`.
>
> If you want to globally target child nodes within the current element (e.g. `'& a[href]'`), you should use [`globalStyle`](#globalstyle) instead.

For fallback styles you may simply pass an array of properties instead of a single prop.

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const exampleStyle = style({
  // in Firefox and IE the "overflow: overlay" will be ignored and the "overflow: auto" will be applied
  overflow: ['auto', 'overlay']
});
```

Multiple styles can be composed into a single rule by providing an array of styles.

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';

const base = style({ padding: 12 });

export const primary = style([
  base,
  { background: 'blue' }
]);

export const secondary = style([
  base,
  { background: 'aqua' }
]);
```

When style compositions are used in selectors, they are assigned an additional class if required so they can be uniquely identified. When selectors are processed internally, the composed classes are removed, only leaving behind the unique identifier classes. This allows you to treat them as if they were a single class within vanilla-extract selectors.

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
