---
'@vanilla-extract/esbuild-plugin': minor
'@vanilla-extract/vite-plugin': minor
'@vanilla-extract/rollup-plugin': minor
---

Add automatic debug IDs

Automatic debug IDs allow your styles and other identifiers (e.g. CSS Vars, keyframes, etc) to have names that more closely reflect your source code when in development. This makes it easier to understand how the CSS output links to your source code. 

```ts
// styles.css.ts

// redBox ~= 'styles_redBox_asdfgj'
const redBox = style({
    background: 'red'
})
```
