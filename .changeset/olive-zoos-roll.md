---
'@vanilla-extract/vite-plugin': major
---

Formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can now be configured via the `identifiers` option which accepts either `short` or `debug`.

- `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
- `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `somefile_mystyle_hnw5tz3`

```js
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

vanillaExtractPlugin({ identifiers: 'short' });
```

BREAKING CHANGE

Previously identifiers were formatted as `short` when `process.env.NODE_ENV` was set to "production". By default, they will now be formatted according to Vite's [mode config](https://vitejs.dev/config/#mode).