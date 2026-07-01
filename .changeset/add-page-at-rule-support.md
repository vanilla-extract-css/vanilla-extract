---
"@vanilla-extract/css": minor
---

Add `page()` and `globalPage()` functions for `@page` at-rule support

```ts
import { page, globalPage, style } from '@vanilla-extract/css';

// Scoped page — returns a unique page name
const printPage = page({
  size: 'A4',
  margin: '2cm',
});

export const printable = style({
  page: printPage,
});

// Global @page rule
globalPage({
  margin: '1in',
});

// Global @page with selector
globalPage(':first', {
  marginTop: '3cm',
});
```
