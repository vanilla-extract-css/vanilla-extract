---
'@vanilla-extract/css': minor
---

Allow `createGlobalVar` to accept a name with a leading `--`

Similar to `createGlobalThemeContract`, `createGlobalVar` now trims a leading `--` from the variable name. This can be useful if you want to keep the full variable name searchable in your codebase.

**EXAMPLE USAGE**:

```ts
import { createGlobalVar } from '@vanilla-extract/css';

// Both produce `var(--my-global-var)`
const a = createGlobalVar('my-global-var');
const b = createGlobalVar('--my-global-var');
```
