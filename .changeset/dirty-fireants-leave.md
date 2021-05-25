---
'@vanilla-extract/css': patch
---

Improved conditional CSS rendering

Previously all conditional CSS (@media and @supports) in a `.css.ts` file would merge together. This meant each unique query (e.g. `@media screen and (min-width: 700px)`) would only be rendered once. This output is ideal for file size but can lead to the conditions being rendered in the wrong order. The new strategy will still merge conditions together but only if it is considered safe to do so.