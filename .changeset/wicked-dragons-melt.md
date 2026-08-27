---
'@vanilla-extract/integration': patch
---

Support Deno projects without a `package.json` file.

When Deno is detected, we'll first check for `deno.json` or `deno.jsonc` before falling back to `package.json`.