---
'@vanilla-extract/css': patch
---

Allow `createGlobalVar` to accept a name with a leading `--`

Similar to `createGlobalThemeContract`, `createGlobalVar` now trims a leading `--` from the variable name. This keeps the full variable name searchable in your codebase:

```ts
import { createGlobalVar } from '@vanilla-extract/css';

// Both produce `var(--my-global-var)`
const a = createGlobalVar('my-global-var');
const b = createGlobalVar('--my-global-var');
```
