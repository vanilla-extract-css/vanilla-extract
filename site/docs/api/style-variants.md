---
title: styleVariants
---

# styleVariants

Creates a collection of named style rules.

This is useful for mapping component props to styles, for example: `<button className={styles.background[props.variant]}>`

```ts compiled
// styles.css.ts
import { styleVariants } from '@vanilla-extract/css';

export const background = styleVariants({
  primary: { background: 'blue' },
  secondary: { background: 'aqua' }
});

// app.tsx
import { background } from './styles.css.ts';

interface SectionProps {
  variant: keyof typeof background;
}

const Section = ({ variant }: SectionProps) => (
  <section className={background[variant]}>...</section>
);
```

## Style composition

Variant styles can also be composed into a single rule by providing an array of styles.

> ✨&nbsp;&nbsp;Curious about style composition? Make sure you’ve read the [style composition overview](/documentation/style-composition) first.

```ts compiled
// styles.css.ts
import { style, styleVariants } from '@vanilla-extract/css';

const base = style({ padding: 12 });

export const variant = styleVariants({
  primary: [base, { background: 'blue' }],
  secondary: [base, { background: 'aqua' }]
});
```

## Mapping variants

To make generating sets of style variants easier, a mapping function can be provided as the second argument.

For example, we can iterate over the `palette` below, without having to define the style rule explicitly for each entry.

```ts compiled
// styles.css.ts

import { style, styleVariants } from '@vanilla-extract/css';

const base = style({ padding: 12 });

const palette = {
  primary: 'blue',
  secondary: 'aqua'
};

export const variant = styleVariants(
  palette,
  (paletteColor) => [base, { background: paletteColor }]
);
```
