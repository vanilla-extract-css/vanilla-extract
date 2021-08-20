---
'@vanilla-extract/sprinkles': minor
---

Support passing style objects as property values.

For more complicated styles, values can now be entire style objects. This works especially well when combined with CSS Variables.

```ts
import { createVar } from '@vanilla-extract/css';
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const alpha = createVar();

const responsiveStyles = createAtomicStyles({
  properties: {
    background: {
      red: {
        vars: { [alpha]: '1' },
        background: `rgba(255, 0, 0, ${fallbackVar(alpha, '1')})`
      },
    },
    backgroundOpacity: {
      1: { vars: { [alpha]: '1' } },
      0.1: { vars: { [alpha]: '0.1' } },
    },
    // etc.
  }
});
```