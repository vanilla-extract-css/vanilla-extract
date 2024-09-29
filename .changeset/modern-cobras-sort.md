---
"@vanilla-extract/css": minor
---

Add support for a `vars` property to steps within `keyframes` declarations

Example usage:

```ts
const angle = createVar({
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg'
});

const angleKeyframes = keyframes({
  '0%': {
    vars: {
      [angle]: '0deg'
    }
  },
  '100%': {
    vars: {
      [angle]: '360deg'
    }
  }
});
```
