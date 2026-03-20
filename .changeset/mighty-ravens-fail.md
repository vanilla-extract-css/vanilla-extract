---
'@vanilla-extract/css': minor
---

Allow `:where` and `:is` in `selectors` if all selectors target `&`

EXAMPLE USAGE:

```ts
const example = style({
  color: 'red',
  selectors: {
    // Valid: all selectors in the list target `example`
    ':is(h1 > &, h2 > &)': { color: 'blue' }
    // Invalid: the second selector in the list does not target `example`
    ':is(h1 > &, h2)': { color: 'blue' }
  }
});
```
