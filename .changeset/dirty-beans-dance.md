---
'@vanilla-extract/sprinkles': patch
---

**Support resolving falsey values for conditional atoms**

Fixes bug where falsey values such as `opacity: 0` would not resolve classes via the conditional object or responsive array syntax.

```ts
export const atoms = createAtomicStyles({
  defaultCondition: 'mobile',
  conditions: {
    mobile: {},
    desktop: {
      '@media': 'screen and (min-width: 786px)',
    },
  },
  responsiveArray: ['mobile', 'desktop'],
  properties: {
    opacity: [0, 1],
  },
});
```