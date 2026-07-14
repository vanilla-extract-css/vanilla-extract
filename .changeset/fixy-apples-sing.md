---
'@vanilla-extract/compiler': patch
---

`processVanillaFile`: Don't serialize CSS imports for modules whose CSS objects transform to an empty string (e.g. files that only compose existing atomic classes from a recipe)
