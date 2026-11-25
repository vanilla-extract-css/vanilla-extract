---
'@vanilla-extract/css': patch
---

Only transform local class names in selectors when they form a whole class token

Local class names were previously matched as plain substrings of a selector, so a class name such as `aria` would also be transformed inside `[aria-selected]` (producing the invalid selector `[.aria-selected]`), and a class name such as `ocus` would be transformed inside `:focus`. Matches inside attribute selectors, or that are only part of a larger identifier or pseudo-class name, are now left untouched. Class names glued to other local class names (`&&`) or to element names (`body&`) are still transformed.
