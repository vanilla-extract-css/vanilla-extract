# 🍦 sprinkles

**Zero-runtime atomic CSS framework in TypeScript.**

Configure a custom set of responsive utility classes, then compose them via a functional TypeScript API — but without the usual runtime overhead of CSS-in-JS, thanks to [vanilla-extract.](https://github.com/seek-oss/vanilla-extract)

Basically, it’s like building your own type-safe, zero-runtime version of [Tailwind](https://tailwindcss.com), [Styled System](https://styled-system.com), etc.

> 💡 All of these properties, values and breakpoints are configurable!

```tsx
export const className = atoms({
  display: 'flex',
  gap: 'small',
  flexDirection: {
    mobile: 'column',
    desktop: 'row',
  },
});
```

---

**🚧 &nbsp; Please note, this is an alpha release.**

---

🔥 &nbsp; Zero-runtime CSS-in-TypeScript with all styles generated at build time via [vanilla-extract.](https://github.com/seek-oss/vanilla-extract)

🛠 &nbsp; Create your own custom set of atomic classes with a single declarative config.

🎨 &nbsp; Generate theme-based scales with CSS Variables using [vanilla-extract themes.](https://github.com/seek-oss/vanilla-extract#createtheme)

🖥 &nbsp; Conditional atoms to target media/feature queries and selectors.

💪 &nbsp; Type-safe functional API for accessing atoms.

🏃‍♂️ &nbsp; Compose atoms in `.css.ts` files — or compose them dynamically at runtime!

---

## Setup

```bash
$ yarn add @vanilla-extract/sprinkles
```

**Configure atomic styles in a `.css.ts` file.**

```ts
// atomicStyles.css.ts

import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const space = {
  none: 0,
  small: 4,
  medium: 8,
  large: 16,
};

export const atomicStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'block', 'flex'],
    flexDirection: ['row', 'column'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    justifyContent: ['stretch', 'flex-start', 'center', 'flex-end'],
    gap: space,
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    // etc.
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
  }
});
```

**Then create your `atoms` function in a regular `.ts` file.**

```ts
// atoms.ts

import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn'
import { atomicStyles } from './atomicStyles.css.ts';

export const atoms = createAtomsFn(atomicStyles);
```

**You can now use your `atoms` function in `.css.ts` files for zero-runtime usage.**

```ts
// container.css.ts

import { atoms } from './atoms.ts';

export const container = atoms({
  display: 'flex',
  gap: 'small',
  flexDirection: {
    mobile: 'column',
    desktop: 'row',
  },
});
```

**You can even use your `atoms` function at runtime! 🏃‍♂️**

```tsx
// Container.tsx

import React, { ReactNode } from 'react';
import { atoms } from './atoms.ts';

export default ({ children }: { children: ReactNode }) => (
  <div className={atoms({
    display: 'flex',
    gap: 'small',
    flexDirection: {
      mobile: 'column',
      desktop: 'row',
    },
  })}>
    {children}
  </div>
);
```

---

- [API](#api)
  - [createAtomicStyles](#createatomicstyles)
    - [`properties`](#properties)
    - [`shorthands`](#shorthands)
    - [`conditions`](#conditions)
    - [`defaultCondition`](#defaultcondition)
    - [`responsiveArray`](#responsivearray)
  - [createAtomsFn](#createatomsfn)
- [Thanks](#thanks)
- [License](#license)

---

## API

### createAtomicStyles

Configures your utility classes.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const atomicStyles = createAtomicStyles({
  // etc...
});
```

If you need to scope different [conditions](#conditions) to different properties, you can spread multiple sets of atomic styles into a single object.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const atomicStyles = {
  ...createAtomicStyles({ /* ... */ }),
  ...createAtomicStyles({ /* ... */ }),
  ...createAtomicStyles({ /* ... */ }),
};
```

#### `properties`

Configures which properties and values should be available. Properties must be valid CSS properties.

For simple mappings (i.e. valid CSS values), values can be provided as an array.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const atomicStyles = createAtomicStyles({
  properties: {
    display: ['none', 'block', 'flex'],
    flexDirection: ['row', 'column'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    justifyContent: ['stretch', 'flex-start', 'center', 'flex-end'],
    // etc.
  }
});
```

For semantic mappings (e.g. space scales, color palettes), values can be provided as an object.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const atomicStyles = createAtomicStyles({
  properties: {
    gap: {
      none: 0,
      small: 4,
      medium: 8,
      large: 16,
    },
    // etc.
  }
});
```

For themed atoms, [vanilla-extract themes](https://github.com/seek-oss/vanilla-extract#createtheme) can be used as values.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';
import { themeVars } from './themeVars.css.ts';

export const atomicStyles = createAtomicStyles({
  properties: {
    gap: themeVars.space,
    // etc.
  }
});
```

#### `shorthands`

Maps custom shorthand properties to multiple underlying CSS properties. This is useful for mapping values like `padding`/`paddingX`/`paddingY` to their underlying longhand values.

**Note that shorthands are evaluated in the order that they were defined in your config.** Shorthands with lower specificity should be higher in the list, e.g. `padding` should come before `paddingX`/`paddingY`.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';
import { themeVars } from './themeVars.css.ts';

export const atomicStyles = createAtomicStyles({
  properties: {
    paddingTop: themeVars.space,
    paddingBottom: themeVars.space,
    paddingLeft: themeVars.space,
    paddingRight: themeVars.space,
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
  }
});
```

#### `conditions`

Allows you to create atomic classes for a set of media/feature queries.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const atomicStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  // etc.
});
```

Classes can also be scoped to selectors.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const atomicStyles = createAtomicStyles({
  conditions: {
    default: {},
    hover: { selector: '&:hover' },
    focus: { selector: '&:focus' },
  },
  defaultCondition: 'default',
  // etc.
});
```

#### `defaultCondition`

Defines which condition should be used when a non-conditional value is requested, e.g. the condition that `atoms({ display: 'flex' })` resolve to

> 💡 When using mobile-first responsive conditions, this should your lowest breakpoint.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const atomicStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  // etc.
});
```

You can set `defaultCondition` to `false` to enforce that values should explicitly provide values for every condition.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const atomicStyles = createAtomicStyles({
  conditions: {
    light: { '@media': '(prefers-color-scheme: light)' },
    dark: { '@media': '(prefers-color-scheme: dark)' },
  },
  defaultCondition: false,
  // etc.
});
```

#### `responsiveArray`

Optionally enables responsive array notation (e.g. `['column', 'row']`) by defining the order of conditions.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const atomicStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  // etc.
});
```

### createAtomsFn

Turns your atomic styles object into a type-safe function for accessing atoms.

> 💡 This should be exported from a regular `.ts` file since `.css.ts` files can only export static data.

```ts
// atoms.ts

import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn'
import { atomicStyles } from './atomicStyles.css.ts';

export const atoms = createAtomsFn(atomicStyles);
```

---

## Thanks

- [Styled System](https://styled-system.com) for inspiring our approach to responsive props.
- [Tailwind](https://tailwindcss.com) for teaching us to think utility-first.
- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.

## License

MIT.
