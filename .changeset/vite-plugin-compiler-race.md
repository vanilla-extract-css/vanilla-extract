---
'@vanilla-extract/vite-plugin': patch
---

Fixed an issue where `.css.ts` files could be left untransformed

This was most commonly hit when using module federation plugins that expose modules as their own chunks, resulting in untransformed runtime `style()` calls throwing `Styles were unable to be assigned to a file`.
