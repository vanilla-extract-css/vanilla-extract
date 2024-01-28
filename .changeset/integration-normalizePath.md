---
'@vanilla-extract/integration': minor
---

Export a `normalizePath` function that converts path separators to forward slashes

**Example usage**

```ts
import { normalizePath } from '@vanilla-extract/integration';

normalizePath('foo\\bar'); // 'foo/bar'
normalizePath('foo/bar'); // 'foo/bar'
```
