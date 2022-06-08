---
title: styleVariants
---

# styleVariants

Creates a collection of named style variants.

```tsx
// styles.css.ts

import { styleVariants } from '@vanilla-extract/css';

export const variant = styleVariants({
  primary: { background: 'blue' },
  secondary: { background: 'aqua' }
});
```

> 💡 This is useful for mapping component props to styles, e.g. `<button className={styles.variant[props.variant]}>`

Multiple styles can be composed into a single rule by providing an array of styles.

```ts
// styles.css.ts

import { styleVariants } from '@vanilla-extract/css';

const base = style({ padding: 12 });

export const variant = styleVariants({
  primary: [base, { background: 'blue' }],
  secondary: [base, { background: 'aqua' }]
});
```

You can also transform the values by providing a map function as the second argument.

```ts
// styles.css.ts

import { styleVariants } from '@vanilla-extract/css';

const base = style({ padding: 12 });

const backgrounds = {
  primary: 'blue',
  secondary: 'aqua'
} as const;

export const variant = styleVariants(
  backgrounds,
  (background) => [base, { background }]
);
```
