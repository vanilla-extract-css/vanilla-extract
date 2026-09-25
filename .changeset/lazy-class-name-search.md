---
'@vanilla-extract/css': patch
---

perf: Only build the local class name search index when a stylesheet needs it, speeding up builds of stylesheets that use only plain class selectors
