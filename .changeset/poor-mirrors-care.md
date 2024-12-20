---
"@vanilla-extract/css": minor
---

`createVar`: Add support for defining [`@property`] rules

Example usage:

```ts
import { createVar } from '@vanilla-extract/css';

export const myVar = createVar({
  syntax: '<number>',
  inherits: false,
  initialValue: '0.5',
});
```

This will generate the following CSS:

```css
@property --myVar__jteyb14 {
  syntax: "<number>";
  inherits: false;
  initial-value: 0.5;
}
```

[`@property`]: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
