---
'@vanilla-extract/css': patch
---

Change the way vanilla runtime works.

The vanilla browser runtime now creates style tags containing the CSS itself, rather than injecting it directly into the CSSOM.

This helps with debugability, as the generated CSS can actually be seen in the devtools.
There are also some new attributes set on the style tags, making it easier to identify the source of each style.
