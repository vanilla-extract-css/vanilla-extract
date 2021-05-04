---
'@vanilla-extract/sprinkles': patch
---

Improve runtime errors

Sprinkles will now validate your `atoms` calls at runtime for a better developer experience. The validation code should be stripped from production bundles via a `process.env.NODE_ENV` check. In production, Sprinkles will now swallow most runtime errors.

Example Error

```bash
SprinklesError: "paddingTop" has no value "xlarge". Possible values are "small", "medium", "large"
```
