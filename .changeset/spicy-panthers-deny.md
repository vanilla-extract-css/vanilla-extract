---
'@vanilla-extract/babel-plugin': minor
'@vanilla-extract/css': minor
---

Rename `mapToStyles` to `styleVariants`

**BREAKING CHANGE**

```diff
-import { mapToStyles } from '@vanilla-extract/css';
+import { styleVariants } from '@vanilla-extract/css';

-export const variant = mapToStyles({
+export const variant = styleVariants({
  primary: { background: 'blue' },
  secondary: { background: 'aqua' },
});
```
