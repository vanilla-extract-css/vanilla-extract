---
'@vanilla-extract/css': minor
---

Supports passing multiple font face rules to `fontFace`

**Example usage**

```ts
import { fontFace, style } from '@vanilla-extract/css';

const gentium = fontFace([
  {
    src: 'local("Gentium")',
    fontWeight: 'normal',
  },
  {
    src: 'local("Gentium Bold")',
    fontWeight: 'bold',
  },
]);

export const font = style({
  fontFamily: gentium,
});
```