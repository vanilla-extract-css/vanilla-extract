---
'@vanilla-extract/sprinkles': patch
---

`defineProperties`: Fixed a type limitation that capped `conditions` at 8

The type definition previously enforced an arbitrary maximum, despite the lack of a runtime constraint. This limit is now gone.
