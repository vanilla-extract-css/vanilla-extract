---
'@vanilla-extract/css': minor
---

Add support for passing multiple font face rules to `globalFontFace`

**EXAMPLE USAGE:**

```ts
const gentium = 'GlobalGentium';

globalFontFace(gentium, [
  {
    src: 'local("Gentium")',
    fontWeight: 'normal'
  },
  {
    src: 'local("Gentium Bold")',
    fontWeight: 'bold'
  }
]);
