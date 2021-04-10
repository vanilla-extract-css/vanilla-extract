---
'@vanilla-extract/css': minor
---

To support dynamic theming at runtime, the following functions are now available via the `@vanilla-extract/css/dynamic` entrypoint:

- `createInlineTheme` for generating a custom theme as an inline style object.
- `setElementVar` for setting a single var on an element.
- `assignElementVars` for setting an entire collection of CSS Variables on an element.

Note, the `assignElementVars` import has now moved from `/createInlineTheme` to `/dynamic`.

```diff
-import { createInlineTheme } from '@vanilla-extract/css/createInlineTheme';
+import { createInlineTheme } from '@vanilla-extract/css/dynamic';
```
