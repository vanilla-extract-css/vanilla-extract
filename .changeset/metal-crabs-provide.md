---
'@vanilla-extract/webpack-plugin': patch
---

Fix requiring of webpack loader

Previously, the webpack plugin would reference itself as a loader by requiring `@vanilla-extract/webpack-plugin/loader`, but this was technically incorrect, and only worked because of the flat node_modules structure that yarn provides.

When using a package manager like pnpm, which does not have a flat structure, this breaks.

This change uses relative references internally to ensure that the loader can always be required.