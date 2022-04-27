---
title: Fillings API
---

# Fillings API

Generate a static set of dynamically assignable properties. This API allows you to create component interface similar to the one known from [styled-system](https://styled-system.com/getting-started), without the usual style generation overhead of CSS-in-JS. You can think about this API as a dynamic equivalent of **Sprinkles**, where user is free to specify any value to the properties.

## createFillings

Create static definition of you CSS classes. This function generates respective class names with associated CSS variables.

```ts
// styles.css.ts
import { createFillings } from '@vanilla-extract/fillings';

export const sizeFillings = createFillings({
  properties: ['width', 'height']
});
```

## computeFillings

In the runtime compute necessary className list and create handler to assign only necessary CSS variables

```tsx
// app.tsx
import { computeFillings } from '@vanilla-extract/fillings';
import type { FillingsProps } from '@vanilla-extract/fillings';
import { sizeFillings } from './styles.css.ts';
import { ReactNode } from 'react';

type Props = FillingsProps<typeof sizeFillings> & {
  children: ReactNode;
};

const Box = forwardRef(({ children, ...props }: Props) => {
  const { className, assignVars } = computeFillings({
    fillings: sizeFillings,
    props
  });

  return (
    <div style={assignVars()} className={className}>
      {children}
    </div>
  );
});

const App = () => (
  <Box width="100vw" height="100vh">
    ... App content
  </Box>
);
```

## Conditional styles

This API really shines when used in combination with `@media`/`@supports`/`selector` conditions, creating dynamic API that remove the need to create custom styles every time you would want to assign different values to CSS properties on different screen sizes, color modes or other conditions.

```ts
// styles.css.ts
import { createFillings } from '@vanilla-extract/fillings';

const responsive = {
  sm: { '@media': '' }, // treated as special case - style not wrapped with selector
  lg: { '@media': 'screen and (min-width: 986px)' }
} as const;

export const sizeFillings = createFillings({
  conditions: responsive,
  defaultCondition: 'sm',
  properties: ['width', 'height']
});
```

```tsx
// app.tsx
import { computeFillings } from '@vanilla-extract/fillings';
import type { FillingsProps } from '@vanilla-extract/fillings';
import { sizeFillings } from './styles.css.ts';

type Props = FillingsProps<typeof sizeFillings>;

const Box = forwardRef(({ ...children, props }: Props) => {
  const { className, assignVars } = computeFillings({
    fillings: sizeFillings,
    props
  });

  return (
    <div style={assignVars()} className={className}>
      {children}
    </div>
  );
});

const App = () => (
  <Box
    width={{ sm: '200px', lg: '400px' }}
    height={{ sm: '200px', lg: '400px' }}
  >
    ... App content
  </Box>
);
```
