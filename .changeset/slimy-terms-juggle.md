---
'@vanilla-extract/css-utils': patch
---

Add support for calc nesting

Previously passing a calc to any of the operator methods was not supported without first being stringified. This is now handled internally.

E.g.

```diff
-  calc('10px').add(calc('20px').subtract('4px').toString())
+  calc('10px').add(calc('20px').subtract('4px'))
```
