---
'@vanilla-extract/jest-transform': minor
---

Allow configuring [custom identifiers] in the jest transformer

**EXAMPLE USAGE**:

```js
// jest.config.js

export default {
  transform: {
    '^.+\\.css.ts$': [
      '@vanilla-extract/jest-transform',
      { identifiers: ({ hash }) => `${hash}_myCustomIdentifier` },
    ],
  },
}
```

[custom identifiers]: https://vanilla-extract.style/documentation/integrations/webpack/#identifiers
