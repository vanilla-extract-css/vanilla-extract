---
'@vanilla-extract/babel-plugin': minor
'@vanilla-extract/css': minor
---

Rename `createThemeVars` to `createThemeContract`

**BREAKING CHANGE**

```diff
import {
-  createThemeVars,
+  createThemeContract,
  createTheme
} from '@vanilla-extract/css';

-export const vars = createThemeVars({
+export const vars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});
```
