# 🍨 Sprinkles

**Zero-runtime atomic CSS framework in TypeScript.**

Configure a custom set of responsive utility classes, then compose them via a functional TypeScript API — but without the usual runtime overhead of CSS-in-JS, thanks to [vanilla-extract.](https://github.com/seek-oss/vanilla-extract)

Basically, it’s like building your own type-safe, zero-runtime version of [Tailwind](https://tailwindcss.com), [Styled System](https://styled-system.com), etc.

> 💡 All of these properties, values and breakpoints are configurable!

```tsx
export const className = atoms({
  display: 'flex',
  paddingX: 'small',
  flexDirection: {
    mobile: 'column',
    desktop: 'row'
  },
  background: {
    light: 'blue50',
    dark: 'gray700'
  }
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

🏃‍♂️ &nbsp; Compose atoms in `.css.ts` files, or dynamically at runtime!

---

## Setup

```bash
$ yarn add @vanilla-extract/sprinkles
```

**Create and export your atoms function in a `.css.ts` file.**

```ts
// atoms.css.ts

import { createAtomicStyles, createAtomsFn } from '@vanilla-extract/sprinkles';

const space = {
  none: 0,
  small: 4,
  medium: 8,
  large: 16
};

const palette = {
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  // etc.
};

const layoutStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'block', 'flex'],
    flexDirection: ['row', 'column'],
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    // etc...
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom']
  }
});

const colorStyles = createAtomicStyles({
  conditions: {
    light: {},
    dark: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: false,
  properties: {
    color: palette,
    background: palette
  },
  // etc.
});

export const atoms = createAtomsFn(layoutStyles, colorStyles);
```

**🎉 That's it! You’re ready to go.**

## Usage

You can now use your `atoms` function in `.css.ts` files for zero-runtime usage.

```ts
// styles.css.ts

import { atoms } from './atoms.css.ts';

export const container = atoms({
  display: 'flex',
  paddingX: 'small',
  flexDirection: {
    mobile: 'column',
    desktop: 'row',
  },
  background: {
    light: 'blue50',
    dark: 'gray700',
  }
});
```

Atomic styles can be combined with custom styles using vanilla-extract's `composeStyles` function.

```ts
// styles.css.ts

import { style, composeStyles } from '@vanilla-extract/css';
import { atoms } from './atoms.css.ts';

export const container = composeStyles(
  atoms({
    display: 'flex',
    paddingX: 'small',
    background: {
      light: 'blue50',
      dark: 'gray700',
    },
  })
  style({
    ':hover': {
      outline: '2px solid currentColor'
    }
  })
);
```

If you want, you can even use your `atoms` function at runtime! 🏃‍♂️

> 💡 Although you don’t need to use this library at runtime, it’s designed to be as small and performant as possible. All styles are still generated at build time.

```tsx
// app.ts

import { atoms } from './atoms.css.ts';

document.write(`
  <section class="${atoms({ display: 'flex', flexDirection: 'column' })}">
    ...
  </section>
`);
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

const layoutStyles = createAtomicStyles({
  // etc.
});
```

If you need to scope different [conditions](#conditions) to different properties, you can provide multiple sets of atomic styles to `createAtomsFn`.

For example, you might want color properties to support light mode and dark mode variants.

```ts
import { createAtomicStyles, createAtomsFn } from '@vanilla-extract/sprinkles';

const space = {
  none: 0,
  small: 4,
  medium: 8,
  large: 16
};

const palette = {
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  // etc.
};

const layoutStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'block', 'flex'],
    flexDirection: ['row', 'column'],
    padding: space,
    // etc.
  }
});

const colorStyles = createAtomicStyles({
  conditions: {
    light: {},
    dark: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: false,
  properties: {
    color: palette,
    background: palette
  },
  // etc.
});

export const atoms = createAtomsFn(
  layoutStyles,
  colorStyles
);
```

> 💡 If you want a good color palette to work with, you might want to consider importing [`tailwindcss/colors.`](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)

#### `properties`

Configures which properties and values should be available. Properties must be valid CSS properties.

For simple mappings (i.e. valid CSS values), values can be provided as an array.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const layoutStyles = createAtomicStyles({
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

const layoutStyles = createAtomicStyles({
  properties: {
    gap: {
      none: 0,
      small: 4,
      medium: 8,
      large: 16
    },
    // etc.
  }
});
```

For themed atoms, [vanilla-extract themes](https://github.com/seek-oss/vanilla-extract#createtheme) can be used as values.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';
import { themeVars } from './themeVars.css.ts';

const layoutStyles = createAtomicStyles({
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

const layoutStyles = createAtomicStyles({
  properties: {
    paddingTop: themeVars.space,
    paddingBottom: themeVars.space,
    paddingLeft: themeVars.space,
    paddingRight: themeVars.space
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom']
  }
});
```

#### `conditions`

Allows you to create atomic classes for a set of media/feature queries.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const layoutStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  // etc.
});
```

Classes can also be scoped to selectors.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const layoutStyles = createAtomicStyles({
  conditions: {
    default: {},
    hover: { selector: '&:hover' },
    focus: { selector: '&:focus' }
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

const layoutStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  // etc.
});
```

You can also set `defaultCondition` to `false` to enforce that all values should be explicitly bound to a condition.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const layoutStyles = createAtomicStyles({
  conditions: {
    light: { '@media': '(prefers-color-scheme: light)' },
    dark: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: false,
  // etc.
});
```

#### `responsiveArray`

Optionally enables responsive array notation (e.g. `['column', 'row']`) by defining the order of conditions.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const layoutStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  // etc.
});
```

### createAtomsFn

Turns your atomic styles into a type-safe function for accessing atoms.

```ts
import { createAtomicStyles, createAtomsFn } from '@vanilla-extract/sprinkles';

const layoutStyles = createAtomicStyles({
  // etc.
});

const colorStyles = createAtomicStyles({
  // etc.
});

export const atoms = createAtomsFn(
  layoutStyles,
  colorStyles
);
```

---

## Thanks

- [Styled System](https://styled-system.com) for inspiring our approach to responsive props.
- [Tailwind](https://tailwindcss.com) for teaching us to think utility-first.
- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.

## License

MIT.
