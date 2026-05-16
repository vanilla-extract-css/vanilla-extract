---
'@vanilla-extract/css': patch
---

Fix incorrect class name substitution when composed class lists contain regex metacharacters

Class names containing characters such as `(`, `)`, `+`, or `.` were being interpreted as regex syntax when building the substitution pattern for composed class lists, causing malformed matches. The class list is now escaped before constructing the `RegExp`.
