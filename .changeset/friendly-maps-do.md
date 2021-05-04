---
'@vanilla-extract/sprinkles': minor
---

Add static `properties` set to atoms function

This allows runtime code to detect whether a given property can be handled by the atoms function or not.

This is useful when building a Box component with atoms available at the top level (e.g. `<Box padding="small">`) since you'll need some way to filter atom props from non-atom props.
