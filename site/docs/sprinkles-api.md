---
title: Sprinkles API
---

# Sprinkles API

Generate a static set of custom utility classes and compose them either statically at build time, or dynamically at runtime, without the usual style generation overhead of CSS-in-JS.

Basically, it’s like building your own zero-runtime, type-safe version of [Tailwind](https://tailwindcss.com), [Styled System](https://styled-system.com), etc.

```bash
$ npm install @vanilla-extract/sprinkles
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

You can combine your sprinkles with other styles [in the same way you combine styles on their own](/documentation/styling-api/#style).

```ts
// button.css.ts
import { style } from '@vanilla-extract/css';
import { sprinkles } from './sprinkles.css';

export const button = style([
  sprinkles({
    paddingX: 'medium',
    paddingY: 'small',
  }),
  {
    transition: "transform 0.2s ease-in-out",
    ":hover": {
      transform: "scale(1.1)",
    },
  },
])
```

The sprinkles function also exposes a static `properties` key that lets you check whether a given property can be handled by the function.

```ts
sprinkles.properties.has('paddingX');
// -> boolean
```

> 💡 This is useful when building a Box component with sprinkles available at the top level (e.g. `<Box padding="small">`) since you’ll need some way to filter sprinkle props from non-sprinkle props.

## createMapValueFn

Creates a function for mapping over conditional values.

> 💡 This is useful for converting high-level prop values to low-level sprinkles, e.g. converting left/right to flex-start/end.

This function should be created and exported from your `sprinkles.css.ts` file using the conditions from your defined properties.

You can name the generated function whatever you like, typically based on the name of your conditions.

```ts
// sprinkles.css.ts
import {
  defineProperties,
  createSprinkles,
  createMapValueFn
} from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  /* ... */
});

export const sprinkles = createSprinkles(
  responsiveProperties
);
export const mapResponsiveValue = createMapValueFn(
  responsiveProperties
);
```

You can then import the generated function in your app code.

```ts
// app.ts
import { mapResponsiveValue } from './sprinkles.css.ts';

const alignToFlexAlign = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  stretch: 'stretch'
} as const;

mapResponsiveValue(
  'left',
  (value) => alignToFlexAlign[value]
);
// -> 'flex-start'

mapResponsiveValue(
  {
    mobile: 'center',
    desktop: 'left'
  } as const,
  (value) => alignToFlexAlign[value]
);
// -> { mobile: 'center', desktop: 'flex-start' }

mapResponsiveValue(
  ['center', null, 'left'] as const,
  (value) => alignToFlexAlign[value]
);
// -> { mobile: 'center', desktop: 'flex-start' }
```

> 💡 You can generate a custom conditional value type with the [ConditionalValue](#conditionalvalue) type.

## createNormalizeValueFn

Creates a function for normalizing conditional values into a consistent object stucture. Any primitive values or responsive arrays will be converted to conditional objects.

This function should be created and exported from your `sprinkles.css.ts` file using the conditions from your defined properties.

> 💡 You can name the generated function whatever you like, typically based on the name of your conditions.

```ts
// app.ts
import {
  defineProperties,
  createSprinkles,
  createNormalizeValueFn
} from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  /* ... */
});

export const sprinkles = createSprinkles(
  responsiveProperties
);
export const normalizeResponsiveValue =
  createNormalizeValueFn(responsiveProperties);
```

You can then import the generated function in your app code.

```ts
// app.ts
import { normalizeResponsiveValue } from './sprinkles.css.ts';

normalizeResponsiveValue('block');
// -> { mobile: 'block' }

normalizeResponsiveValue(['none', null, 'block']);
// -> { mobile: 'block', desktop: 'block' }

normalizeResponsiveValue({
  mobile: 'none',
  desktop: 'block'
});
// -> { mobile: 'block', desktop: 'block' }
```

## ConditionalValue

Creates a custom conditional value type.

> 💡 This is useful for typing high-level prop values that are [mapped to low-level sprinkles,](#createmapvaluefn) e.g. supporting left/right prop values that map to flex-start/end.

This type should be created and exported from your `sprinkles.css.ts` file using the conditions from your defined properties.

> 💡 You can name the generated type whatever you like, typically based on the name of your conditions.

```ts
// sprinkles.css.ts
import {
  defineProperties,
  ConditionalValue
} from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  /* ... */
});

export type ResponsiveValue<Value extends string | number> =
  ConditionalValue<typeof responsiveProperties, Value>;
```

You can then import the generated type in your app code.

```ts
// app.ts
import { ResponsiveValue } from './sprinkles.css.ts';

type ResponsiveAlign = ResponsiveValue<
  'left' | 'center' | 'right'
>;

const a: ResponsiveAlign = 'left';
const b: ResponsiveAlign = {
  mobile: 'center',
  desktop: 'left'
};
const c: ResponsiveAlign = ['center', null, 'left'];
```

## RequiredConditionalValue

Same as [ConditionalValue](#conditionalvalue) except the default condition is required. For example, if your default condition was `'mobile'`, then a conditional value of `{ desktop: '...' }` would be a type error.

```ts
// sprinkles.css.ts
import {
  defineProperties,
  RequiredConditionalValue
} from '@vanilla-extract/sprinkles';

const responsiveProperties = defineProperties({
  defaultCondition: 'mobile'
  // etc.
});

export type RequiredResponsiveValue<
  Value extends string | number
> = RequiredConditionalValue<
  typeof responsiveProperties,
  Value
>;
```

You can then import the generated type in your app code.

```ts
// app.ts
import { RequiredResponsiveValue } from './sprinkles.css.ts';

type ResponsiveAlign = RequiredResponsiveValue<
  'left' | 'center' | 'right'
>;

const a: ResponsiveAlign = 'left';
const b: ResponsiveAlign = {
  mobile: 'center',
  desktop: 'left'
};
const c: ResponsiveAlign = ['center', null, 'left'];

// Type errors:
const d: ResponsiveAlign = [null, 'center'];
const e: ResponsiveAlign = { desktop: 'center' };
```
