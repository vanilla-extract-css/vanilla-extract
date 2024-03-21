---
'@vanilla-extract/private': patch
---

**walkObject**: Use an empty object instead of calling the input object's `constructor` when mapping over it

This allows `walkObject` to be used on module namespace objects:

```ts
import * as ns from './foo';

// Would sometimes cause a runtime error
walkObject(ns, myMappingFunction);
```

The previous implementation did not work with these objects because [they do not have a `constructor` function][es6 spec].
`esbuild` seems to have papered over this issue by providing a `constructor` function on these objects, but this seems to not be the case with `vite-node`, hence the need for this fix.

[es6 spec]: https://262.ecma-international.org/6.0/#sec-module-namespace-objects
