---
'@vanilla-extract/sprinkles': minor
---

Support assigning properties to layers via `@layer` option on `defineProperties`

**Example usage:**

```ts
// sprinkles.css.ts
import { defineProperties } from '@vanilla-extract/sprinkles';
import { layer } from '@vanilla-extract/css';

export const sprinklesLayer = layer();

const properties = defineProperties({
  '@layer': sprinklesLayer,
  // etc.
});
```
