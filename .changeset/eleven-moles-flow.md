---
'@vanilla-extract/sprinkles': minor
---

Support multiple default conditions

If your conditions are mutually exclusive (e.g. light mode and dark mode), you can now provide an array of default conditions. For example, the following configuration would automatically expand `atoms({ background: 'white' })` to the equivalent of `atoms({ background: { lightMode: 'white', darkMode: 'white' }})`.

```ts
import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const responsiveStyles = createAtomicStyles({
  conditions: {
    lightMode: { '@media': '(prefers-color-scheme: light)' },
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: ['lightMode', 'darkMode'],
  // etc.
});
```