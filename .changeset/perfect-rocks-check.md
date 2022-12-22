---
'@vanilla-extract/integration': minor
---

creates an AdapterContext (which is just a reference to the result of the adapter after the evalCode of processVanillaFile so anyone can retrieve the generated class names / CSS rules by file scopes

adding a onEvaluated callback to processVanillaFile to retrieve the resulting mapping of classNames by property+value+condition using the AdapterContext
