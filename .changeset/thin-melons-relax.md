---
'@vanilla-extract/vite-plugin': minor
'@vanilla-extract/compiler': minor
---

Add a `cssFileFilter` option to customize which files are treated as Vanilla Extract modules

By default, Vanilla Extract only processes files matching `*.css.ts` (and equivalent extensions). The new `cssFileFilter` option lets you provide a custom `RegExp` — for example, to adopt a different naming convention such as `css.ts`:

```ts
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

vanillaExtractPlugin({
  cssFileFilter: /(?:^|[/\\])css\.(js|cjs|mjs|jsx|ts|tsx)(\?used)?$/,
});
```

The same option is available on `createCompiler` from `@vanilla-extract/compiler`. When omitted, the default filter is used, so existing setups are unaffected.
