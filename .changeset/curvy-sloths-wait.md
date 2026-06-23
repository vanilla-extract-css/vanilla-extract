---
'@vanilla-extract/sprinkles': minor
---

Add support for `@scope` to `conditions`

**EXAMPLE USAGE**:

```ts
import { style } from '@vanilla-extract/css';
import { defineProperties } from '@vanilla-extract/sprinkles';

const scopeRoot = style(); 

const scopedProperties = defineProperties({
  defaultCondition: 'unscoped',
  conditions: {
    unscoped: {},
    document: {
      '@scope': `(${scopeRoot})`
    },
  },
  responsiveArray: ['unscoped', 'scoped'],
  properties: {
    flexDirection: ['row', 'column'],
    order: {
      first: '1',
      second: '2',
    },
  },
});
```
