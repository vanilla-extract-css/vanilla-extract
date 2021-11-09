---
'@vanilla-extract/webpack-plugin': patch
---

Remove "Styles detected outside of '.css.(ts/js)' files" error

This error could occasionaly cause false positives and was inconsistant with the rest of the integrations.
