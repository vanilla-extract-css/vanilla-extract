---
'@vanilla-extract/compiler': minor
---

`createCompiler`: Add `enableFileWatcher` option

By default, the compiler sets up its own file watcher.
This option allows you to disable it if necessary, such as during a production build.

**EXAMPLE USAGE**:

```ts
const compiler = createCompiler({
  root: process.cwd(),
  enableFileWatcher: false
});
```
