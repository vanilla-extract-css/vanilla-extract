---
'@vanilla-extract/sprinkles': minor
---

Add support for container query conditions

**Example usage**

```ts
import {
  createContainer,
  style
} from '@vanilla-extract/css';
import { defineProperties } from '@vanilla-extract/sprinkles';

const containerName = createContainer();

export const container = style({
  containerName,
  containerType: 'size'
});

const containerProperties = defineProperties({
  conditions: {
    small: {},
    medium: {
      '@container': `${containerName} (min-width: 768px)`
    },
    large: {
      '@container': `${containerName} (min-width: 1024px)`
    }
  },
  defaultCondition: 'small'
  // etc.
});
```