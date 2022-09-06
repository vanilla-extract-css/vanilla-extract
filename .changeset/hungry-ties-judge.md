---
'@vanilla-extract/css': minor
---

Support excluding file names from `generateIdentifier` output. This is available by passing a newly-added options object rather than a string.

**Example usage**

```ts
import { generateIdentifier } from '@vanilla-extract/css';

const identifier = generateIdentifier({
  debugId,
  debugFileName: false,
});
```
