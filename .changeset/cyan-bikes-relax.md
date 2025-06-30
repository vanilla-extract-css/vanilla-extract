---
'@vanilla-extract/compiler': minor
---

Add new `getAllCss` API

The `Compiler` class now provides a `getAllCss` method that returns all the CSS currently stored by the compiler.

**EXAMPLE USAGE**:

```ts
import { createCompiler } from '@vanilla-extract/compiler';

const compiler = createCompiler({
  root: process.cwd(),
});

await compiler.processVanillaFile('foo.css.ts');
await compiler.processVanillaFile('bar.css.ts');

// Contains all CSS created by `foo.css.ts` and `bar.css.ts`
const allCss = compiler.getAllCss();
```
