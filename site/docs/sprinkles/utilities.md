---
title: Utilities
parent: sprinkles
---

# Utilities

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
