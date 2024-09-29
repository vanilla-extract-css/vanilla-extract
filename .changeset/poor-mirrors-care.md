---
"@vanilla-extract/babel-plugin-debug-ids": minor
---

Add support for property definitions to `createVar`

When a property definition is provided to `createVar`, a `@property` CSS rule will be generated.

Example usage:

```ts
import { createVar } from '@vanilla-extract/css';

export myVar = createVar({
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
