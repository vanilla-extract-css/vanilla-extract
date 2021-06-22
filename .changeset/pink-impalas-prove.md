---
'@vanilla-extract/css': minor
---

Add `disableRuntimeStyles` entrypoint

In testing environments (like `jsdom`) vanilla-extract will create and insert styles. While this is often desirable, it can be a major slowdown in your tests. If your tests don't require styles to be available, the `disableRuntimeStyles` import will disable all style creation.

```ts
// setupTests.ts
import '@vanilla-extract/css/disableRuntimeStyles';
```

