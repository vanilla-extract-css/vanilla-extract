---
'@vanilla-extract/webpack-plugin': patch
---

Remove "Styles detected outside of '.css.(ts/js)' files" error

This error could occasionally cause false positives, and was inconsistent with the rest of the integrations.
