---
"@vanilla-extract/vite-plugin": minor
"@vanilla-extract/integration": minor
---

Add `fileExtension` option to vite-plugin and export `DEFAULT_FILE_EXTENSIONS` constant from integration.

`DEFAULT_FILE_EXTENSIONS` is now the single source of truth for which file extensions vanilla-extract processes. The `cssFileFilter` regex is derived from this array, preventing drift between them.

This allows specifying exact file extensions (e.g., `.ve.ts`) for vanilla-extract files instead of the default `.css.ts`, `.css.tsx`, etc. This is useful when consuming pre-compiled vanilla-extract libraries that publish `.css.js` files - you can use a different extension for your source files to avoid reprocessing library files.

Replace default extensions with custom ones:

```ts
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default {
  plugins: [
    vanillaExtractPlugin({
      // Process only .ve.ts and .ve.tsx files (NOT .css.ts, etc.)
      fileExtension: ['.ve.ts', '.ve.tsx'],
    }),
  ],
};
```

Or keep the defaults while adding custom extensions using `DEFAULT_FILE_EXTENSIONS`:

```ts
import { vanillaExtractPlugin, DEFAULT_FILE_EXTENSIONS } from '@vanilla-extract/vite-plugin';

export default {
  plugins: [
    vanillaExtractPlugin({
      // Process default extensions PLUS .ve.ts and .ve.tsx
      fileExtension: [...DEFAULT_FILE_EXTENSIONS, '.ve.ts', '.ve.tsx'],
    }),
  ],
};
```
