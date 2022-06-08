---
title: Usage
parent: sprinkles
---

# Usage

You can now use your `sprinkles` function in `.css.ts` files for zero-runtime usage.

```ts
// styles.css.ts
import { sprinkles } from './sprinkles.css.ts';

export const container = sprinkles({
  display: 'flex',
  paddingX: 'small',

  // Conditional sprinkles:
  flexDirection: {
    mobile: 'column',
    desktop: 'row'
  },
  background: {
    lightMode: 'blue-50',
    darkMode: 'gray-700'
  }
});
```

If you want, you can even use your `sprinkles` function at runtime! 🏃‍♂️

```tsx
// app.ts
import { sprinkles } from './sprinkles.css.ts';

const flexDirection =
  Math.random() > 0.5 ? 'column' : 'row';

document.write(`
  <section class="${sprinkles({
    display: 'flex',
    flexDirection
  })}">
    ...
  </section>
`);
```

> 💡 Although you don’t need to use this library at runtime, it’s designed to be as small and performant as possible. The runtime is only used to look up pre-existing class names. All styles are still generated at build time!

Within `.css.ts` files, combine with any custom styles by providing an array to vanilla-extract’s [`style`](/documentation/styling-api/#style) function.

```ts
// styles.css.ts
import { style } from '@vanilla-extract/css';
import { sprinkles } from './sprinkles.css.ts';

export const container = style([
  sprinkles({
    display: 'flex',
    padding: 'small'
  }),
  {
    ':hover': {
      outline: '2px solid currentColor'
    }
  }
]);
```

Sprinkles uses this internally, which means that a class list returned by `sprinkles` can be treated as if it were a single class within vanilla-extract selectors.

```ts
// styles.css.ts
import { globalStyle } from '@vanilla-extract/css';
import { sprinkles } from './sprinkles.css.ts';

export const container = sprinkles({
  padding: 'small'
});

globalStyle(`${container} *`, {
  boxSizing: 'border-box'
});
```

## defineProperties

Defines a collection of utility classes with [properties](#properties), [conditions](#conditions) and [shorthands.](#shorthands)

If you need to scope different conditions to different properties (e.g. some properties support breakpoints, some support light mode and dark mode, some are unconditional), you can provide as many collections of properties to [`createSprinkles`](#createsprinkles) as you like.

```ts
// sprinkles.css.ts
import {
  defineProperties,
  createSprinkles
} from '@vanilla-extract/sprinkles';

const space = {
  none: 0,
  small: '4px',
  medium: '8px',
  large: '16px'
};

const colors = {
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe'
  // etc.
};

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'block', 'flex'],
    flexDirection: ['row', 'column'],
    padding: space
    // etc.
  }
});

const colorProperties = defineProperties({
  conditions: {
    lightMode: {
      '@media': '(prefers-color-scheme: light)'
    },
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: false,
  properties: {
    color: colors,
    background: colors
  }
  // etc.
});

export const sprinkles = createSprinkles(
  responsiveProperties,
  colorProperties
);
```

> 💡 If you want a good color palette to work with, you might want to consider importing [`tailwindcss/colors.`](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)

### properties

Define which CSS properties and values should be available.

For simple mappings (i.e. valid CSS values), values can be provided as an array.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  properties: {
    display: ['none', 'block', 'flex'],
    flexDirection: ['row', 'column'],
    alignItems: [
      'stretch',
      'flex-start',
      'center',
      'flex-end'
    ],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end'
    ]
    // etc.
  }
});
```

For semantic mappings (e.g. space scales, color palettes), values can be provided as an object.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  properties: {
    gap: {
      none: 0,
      small: 4,
      medium: 8,
      large: 16
    }
    // etc.
  }
});
```

You can also use [vanilla-extract themes](/documentation/styling-api/#createtheme) to configure themed values.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';
import { vars } from './vars.css.ts';

const responsiveProperties = defineProperties({
  properties: {
    gap: vars.space
    // etc.
  }
});
```

For more complicated scenarios, values can even be entire style objects. This works especially well when combined with CSS Variables.

> 💡 Styles are created in the order that they were defined in your config. Properties that are less specific should be higher in the list.

```ts
// sprinkles.css.ts
import { createVar } from '@vanilla-extract/css';
import { defineProperties } from '@vanilla-extract/sprinkles';

const alpha = createVar();

const responsiveProperties = defineProperties({
  properties: {
    background: {
      red: {
        vars: { [alpha]: '1' },
        background: `rgba(255, 0, 0, ${alpha})`
      }
    },
    backgroundOpacity: {
      1: { vars: { [alpha]: '1' } },
      0.1: { vars: { [alpha]: '0.1' } }
    }
    // etc.
  }
});
```

### shorthands

Maps custom shorthand properties to multiple underlying CSS properties. This is useful for mapping values like `padding`/`paddingX`/`paddingY` to their underlying longhand values.

> 💡 Shorthands are evaluated in the order that they were defined in your configuration. Shorthands that are less specific should be higher in the list, e.g. `padding` should come before `paddingX`/`paddingY`.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';
import { vars } from './vars.css.ts';

const responsiveProperties = defineProperties({
  properties: {
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space
  },
  shorthands: {
    padding: [
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight'
    ],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom']
  }
});
```

### conditions

Define a set of media/feature queries for the provided properties.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile'
  // etc.
});
```

Properties can also be scoped to selectors.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';

const properties = defineProperties({
  conditions: {
    default: {},
    hover: { selector: '&:hover' },
    focus: { selector: '&:focus' }
  },
  defaultCondition: 'default'
  // etc.
});
```

### defaultCondition

Defines which condition(s) should be used when a non-conditional value is requested, e.g. `sprinkles({ display: 'flex' })`.

If you're using mobile-first responsive conditions, this should be your lowest breakpoint.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile'
  // etc.
});
```

If your conditions are mutually exclusive (e.g. light mode and dark mode), you can provide an array of default conditions. For example, the following configuration would automatically expand `sprinkles({ background: 'white' })` to the equivalent of `sprinkles({ background: { lightMode: 'white', darkMode: 'white' }})`.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  conditions: {
    lightMode: {
      '@media': '(prefers-color-scheme: light)'
    },
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: ['lightMode', 'darkMode']
  // etc.
});
```

You can also set `defaultCondition` to `false`, which forces you to be explicit about which conditions you’re targeting.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  conditions: {
    lightMode: {
      '@media': '(prefers-color-scheme: light)'
    },
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: false
  // etc.
});
```

### responsiveArray

Providing an array of condition names enables the responsive array notation (e.g. `['column', 'row']`) by defining the order of conditions.

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  responsiveArray: ['mobile', 'tablet', 'desktop']
  // etc.
});
```

## createSprinkles

Creates a type-safe function for accessing your [defined properties](#defineProperties). You can provide as many collections of properties as you like.

```ts
// sprinkles.css.ts
import {
  defineProperties,
  createSprinkles
} from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  /* ... */
});
const unconditionalProperties = defineProperties({
  /* ... */
});
const colorProperties = defineProperties({
  /* ... */
});

export const sprinkles = createSprinkles(
  responsiveProperties,
  unconditionalProperties,
  colorProperties
);
```

The sprinkles function also exposes a static `properties` key that lets you check whether a given property can be handled by the function.

```ts
sprinkles.properties.has('paddingX');
// -> boolean
```

> 💡 This is useful when building a Box component with sprinkles available at the top level (e.g. `<Box padding="small">`) since you’ll need some way to filter sprinkle props from non-sprinkle props.
