---
'@vanilla-extract/sprinkles': patch
---

Make the sprinkles runtime more resilient to mutated prototypes.

Previously the createSprinkles function used a `for ... in` loop on an array, which creates problems when used in an environment that has monkeypatched the Array prototype improperly.
By switching to more original style for loops, this should be fixed.