---
'@vanilla-extract/vite-plugin': minor
---

Add `include` and `exclude` options to control which files the plugin processes

These options use the same filter syntax as `@rollup/pluginutils` and allow you to:

- Skip pre-compiled `.css.js` files from libraries that export non-serializable values (like recipe functions)
- Restrict processing to specific directories

Example:

```ts
vanillaExtractPlugin({
  exclude: [/node_modules\/my-design-system/]
});
```

This is particularly useful when consuming design system libraries that publish pre-compiled vanilla-extract CSS, which would otherwise cause "Invalid exports" errors during build.
