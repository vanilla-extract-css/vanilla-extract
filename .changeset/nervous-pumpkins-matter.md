---
'@vanilla-extract/sprinkles': minor
---

Clean up public API, deprecating old API names. Also adding sprinkles to the docs site and using `sprinkles` in favour of `atoms` for the canoncial examples.

API changes include:
- Rename `createAtomicStyles` to `defineProperties`, `createAtomicStyles` is now deprecated
- Rename `createAtomsFn` to `createSprinkles`, `createAtomsFn` is now deprecated
- Rename `AtomicStyles` type to `SprinklesStyles`, `AtomicStyles` is now deprecated

### Migration Guide

```diff
-import { createAtomicStyles, createAtomsFn } from '@vanilla-extract/sprinkles';
+import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';

-const responsiveProperties = createAtomicStyles({
+const responsiveProperties = defineProperties({
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

-export const sprinkles = createAtomsFn(responsiveProperties);
+export const sprinkles = createSprinkles(responsiveProperties);
```