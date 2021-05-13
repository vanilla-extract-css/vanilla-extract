# 🍨 Sprinkles

**Zero-runtime atomic CSS framework for [vanilla-extract.](https://github.com/seek-oss/vanilla-extract)**

Configure a custom set of utility classes, then compose them — either statically at build time, or dynamically at runtime — via a functional TypeScript API. All this without the usual style generation overhead of CSS-in-JS.

Basically, it’s like building your own zero-runtime, type-safe version of [Tailwind](https://tailwindcss.com), [Styled System](https://styled-system.com), etc.

---

**Compose atoms statically at build time.**

```ts
// styles.css.ts

export const className = atoms({
  display: 'flex',
  paddingX: 'small',
  flexDirection: {
    mobile: 'column',
    desktop: 'row'
  },
  background: {
    lightMode: 'blue50',
    darkMode: 'gray700'
  }
});
```

**Or compose them dynamically at runtime! 🏃‍♂️**

```ts
// app.ts

import { atoms } from './atoms.css.ts';

const flexDirection = Math.random() > 0.5 ? 'column' : 'row';

document.write(`
  <section class="${atoms({ display: 'flex', flexDirection })}">
    ...
  </section>
`);
```

---

**🚧 &nbsp; Please note, this is an alpha release.**

---

🔥 &nbsp; Zero-runtime CSS-in-TypeScript with all styles generated at build time via [vanilla-extract.](https://github.com/seek-oss/vanilla-extract)

🛠 &nbsp; Create your own custom set of atomic classes with declarative config.

💪 &nbsp; Type-safe functional API for accessing atoms.

🏃‍♂️ &nbsp; Compose atoms statically in `.css.ts` files, or dynamically at runtime (<0.5KB Gzip)

🎨 &nbsp; Generate theme-based scales with CSS Variables using [vanilla-extract themes.](https://github.com/seek-oss/vanilla-extract#createtheme)

✍️ &nbsp; Configure shorthands for common property combinations, e.g. `paddingX` / `paddingY`.

🚦 &nbsp; Conditional atoms to target media/feature queries and selectors.

✨ &nbsp; Scope conditions to individual properties.

---

🖥 &nbsp; [Try it out for yourself in CodeSandbox.](https://codesandbox.io/s/github/seek-oss/vanilla-extract/tree/master/examples/webpack-react?file=/src/atoms.css.ts)

---

## Setup

> 💡 Before starting, ensure you've set up [vanilla-extract.](https://github.com/seek-oss/vanilla-extract)

Install Sprinkles.

```bash
$ npm install @vanilla-extract/sprinkles
```

Create an `atoms.css.ts` file, then configure and export your `atoms` function.

> 💡 This is just an example! Feel free to customise properties, values and conditions to match your requirements.

```ts
// atoms.css.ts
import { createAtomicStyles, createAtomsFn } from '@vanilla-extract/sprinkles';

const space = {
  'none': 0,
  'small': '4px',
  'medium': '8px',
  'large': '16px',
  // etc.
};

const responsiveStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'flex', 'block', 'inline'],
    flexDirection: ['row', 'column'],
    justifyContent: ['stretch', 'flex-start', 'center', 'flex-end', 'space-around', 'space-between'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
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
    placeItems: ['justifyContent', 'alignItems'],
  }
});

const colors = {
  'blue-50': '#eff6ff',
  'blue-100': '#dbeafe',
  'blue-200': '#bfdbfe',
  // etc.
};

const colorStyles = createAtomicStyles({
  conditions: {
    lightMode: {},
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: 'lightMode',
  properties: {
    color: colors,
    background: colors,
    // etc.
  }
});

export const atoms = createAtomsFn(responsiveStyles, colorStyles);

// It's a good idea to export the Atoms type too
export type Atoms = Parameters<typeof atoms>[0];
```

**🎉 That's it — you’re ready to go!**

## Usage

You can now use your `atoms` function in `.css.ts` files for zero-runtime usage.

```ts
// styles.css.ts
import { atoms } from './atoms.css.ts';

export const container = atoms({
  display: 'flex',
  paddingX: 'small',

  // Conditional atoms:
  flexDirection: {
    mobile: 'column',
    desktop: 'row',
  },
  background: {
    lightMode: 'blue50',
    darkMode: 'gray700',
  }
});
```

Combine with any custom styles using vanilla-extract’s [`composeStyles`](https://github.com/seek-oss/vanilla-extract#composestyles) function.

```ts
// styles.css.ts
import { style, composeStyles } from '@vanilla-extract/css';
import { atoms } from './atoms.css.ts';

export const container = composeStyles(
  atoms({
    display: 'flex',
    paddingX: 'small'
  }),
  style({
    ':hover': {
      outline: '2px solid currentColor'
    }
  })
);
```

If you want, you can even use your `atoms` function at runtime! 🏃‍♂️

```tsx
// app.ts
import { atoms } from './atoms.css.ts';

const flexDirection = Math.random() > 0.5 ? 'column' : 'row';

document.write(`
  <section class="${atoms({ display: 'flex', flexDirection })}">
    ...
  </section>
`);
```

> 💡 Although you don’t need to use this library at runtime, it’s designed to be as small and performant as possible. The runtime is only used to look up pre-existing class names. All styles are still generated at build time!

---

⚛️ &nbsp; Using React? Turn your atoms into a `<Box>` component with 🍰 [Dessert Box.](https://github.com/TheMightyPenguin/dessert-box)

---

- [API](#api)
  - [createAtomicStyles](#createatomicstyles)
    - [`properties`](#properties)
    - [`shorthands`](#shorthands)
    - [`conditions`](#conditions)
    - [`defaultCondition`](#defaultcondition)
    - [`responsiveArray`](#responsivearray)
  - [createAtomsFn](#createatomsfn)
- [Utilities](#utilities)
  - [createMapValueFn](#createmapvaluefn)
  - [createNormalizeValueFn](#createnormalizevaluefn)
- [Thanks](#thanks)
- [License](#license)

---

## API

### createAtomicStyles

Configures a collection of utility classes with [properties](#properties), [conditions](#conditions) and [shorthands.](#shorthands)

If you need to scope different conditions to different properties (e.g. some properties support breakpoints, some support light mode and dark mode, some are unconditional), you can provide as many collections of atomic styles to [`createAtomsFn`](#createatomsfn) as you like.

```ts
import { createAtomicStyles, createAtomsFn } from '@vanilla-extract/sprinkles';

const space = {
  none: 0,
  small: '4px',
  medium: '8px',
  large: '16px'
};

const colors = {
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  // etc.
};

const responsiveStyles = createAtomicStyles({
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
    lightMode: { '@media': '(prefers-color-scheme: light)' },
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: false,
  properties: {
    color: colors,
    background: colors
  },
  // etc.
});

export const atoms = createAtomsFn(
  responsiveStyles,
  colorStyles
);
```

> 💡 If you want a good color palette to work with, you might want to consider importing [`tailwindcss/colors.`](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)

#### `properties`

Configures which properties and values should be available. Properties must be valid CSS properties.

For simple mappings (i.e. valid CSS values), values can be provided as an array.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const responsiveStyles = createAtomicStyles({
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

const responsiveStyles = createAtomicStyles({
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

You can also use [vanilla-extract themes](https://github.com/seek-oss/vanilla-extract#createtheme) to configure themed atoms.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';
import { vars } from './vars.css.ts';

const responsiveStyles = createAtomicStyles({
  properties: {
    gap: vars.space,
    // etc.
  }
});
```

#### `shorthands`

Maps custom shorthand properties to multiple underlying CSS properties. This is useful for mapping values like `padding`/`paddingX`/`paddingY` to their underlying longhand values.

**Note that shorthands are evaluated in the order that they were defined in your config.** Shorthands that are less specific should be higher in the list, e.g. `padding` should come before `paddingX`/`paddingY`.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';
import { vars } from './vars.css.ts';

const responsiveStyles = createAtomicStyles({
  properties: {
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space
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

const responsiveStyles = createAtomicStyles({
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

const styles = createAtomicStyles({
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

Defines which condition should be used when a non-conditional value is requested, e.g. `atoms({ display: 'flex' })`.

> 💡 When using mobile-first responsive conditions, this should be your lowest breakpoint.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const responsiveStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  // etc.
});
```

You can also set `defaultCondition` to `false`. This forces you to be explicit about which conditions you’re targeting.

> 💡 This is useful when your conditions are mutually exclusive.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const responsiveStyles = createAtomicStyles({
  conditions: {
    lightMode: { '@media': '(prefers-color-scheme: light)' },
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: false,
  // etc.
});
```

#### `responsiveArray`

Optionally enables responsive array notation (e.g. `['column', 'row']`) by defining the order of conditions.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const responsiveStyles = createAtomicStyles({
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

Turns your [atomic styles](#createatomicstyles) into a type-safe function for accessing atoms. You can provide as many atomic style collections as you like.

```ts
import { createAtomicStyles, createAtomsFn } from '@vanilla-extract/sprinkles';

const responsiveStyles = createAtomicStyles({
  // etc.
});

const colorStyles = createAtomicStyles({
  // etc.
});

export const atoms = createAtomsFn(
  responsiveStyles,
  colorStyles,
);
```

The atoms function also exposes a static `properties` key that lets you check whether a given property can be handled by the function.

```ts
atoms.properties.has('paddingX'); // returns true or false
```

> 💡 This is useful when building a Box component with atoms available at the top level (e.g. `<Box padding="small">`) since you’ll need some way to filter atom props from non-atom props.


## Utilities

### createMapValueFn

Creates a function for mapping over conditional values.

This function is created and exported from your `atoms.css.ts` file, using your conditions as defined in your atomic styles config.

> 💡 You can name the generated function whatever you like, typically based on the name of the conditions.

```ts
import {
  createAtomicStyles,
  createAtomsFn,
  createMapValueFn
} from '@vanilla-extract/sprinkles';

const responsiveStyles = createAtomicStyles({ /* ... */ });

export const atoms = createAtomsFn(responsiveStyles);
export const mapResponsiveValue = createMapValueFn(responsiveStyles);
```

You can then import the generated function in your runtime code.

> 💡 This is useful for converting high-level prop values to low-level atom values, e.g. converting left/right to flex-start/flex-end.

```ts
import { mapResponsiveValue } from './atoms.css.ts';

const alignToFlexAlign = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  stretch: 'stretch'
} as const;

mapResponsiveValue({
  mobile: 'center',
  desktop: 'left'
} as const, (value) => alignToFlexAlign[value]);
// -> { mobile: 'center', desktop: 'flex-start' }
```

### createNormalizeValueFn

Creates a function for normalizing conditional values into a consistent object stucture. Any primitive values or responsive arrays will be converted to conditional objects.

This function is created and exported from your `atoms.css.ts` file, using your conditions as defined in your atomic styles config.

> 💡 You can name the generated function whatever you like, typically based on the name of the conditions.

```ts
import {
  createAtomicStyles,
  createAtomsFn,
  createNormalizeValueFn
} from '@vanilla-extract/sprinkles';

const responsiveStyles = createAtomicStyles({ /* ... */ });

export const atoms = createAtomsFn(responsiveStyles);
export const normalizeResponsiveValue = createNormalizeValueFn(responsiveStyles);
```

You can then import the generated function in your runtime code.

```ts
import { normalizeResponsiveValue } from './atoms.css.ts';

normalizeResponsiveValue('block');
// -> { mobile: 'block' }

normalizeResponsiveValue(['none', null, 'block' ]);
// -> { mobile: 'block', desktop: 'block' }

normalizeResponsiveValue({ mobile: 'none', desktop: 'block' });
// -> { mobile: 'block', desktop: 'block' }
```

---

## Thanks

- [Styled System](https://styled-system.com) for inspiring our approach to responsive props.
- [Tailwind](https://tailwindcss.com) for teaching us to think utility-first.
- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.

## License

MIT.
