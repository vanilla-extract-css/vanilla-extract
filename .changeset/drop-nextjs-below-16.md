---
'@vanilla-extract/next-plugin': major
'@vanilla-extract/turbopack-plugin': major
---

Drop support for Next.js versions below 16

**BREAKING CHANGE**: The minimum supported version of `next` is now `^16.0.0`. The `semver` dependency has been removed, and `unstable_turbopack.mode` `'auto'` now always enables Turbopack config since Next.js version detection is no longer required. Please note that turbopack support is still experimental.

**MIGRATION GUIDE**: Upgrade to Next.js 16 or later.
