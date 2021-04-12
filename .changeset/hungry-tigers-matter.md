---
'@vanilla-extract/css': minor
---

The `createInlineTheme` function has now moved to the `@vanilla-extract/dynamic` package.

```diff
-import { createInlineTheme } from '@vanilla-extract/css/createInlineTheme';
+import { createInlineTheme } from '@vanilla-extract/dynamic';
```
