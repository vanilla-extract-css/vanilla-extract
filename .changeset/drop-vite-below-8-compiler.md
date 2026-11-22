---
'@vanilla-extract/compiler': major
---

Update `vite` dependency to `^8.0.0` and `vite-node` dependency to `^6.0.0`

**BREAKING CHANGE**: The compiler now uses Vite 8 internally. Any Vite plugins or config passed via the `viteConfig`, `vitePlugins` or `viteResolve` options must be compatible with Vite 8.

**MIGRATION GUIDE**: Ensure any Vite plugins and config passed to `createCompiler` are compatible with Vite 8.
