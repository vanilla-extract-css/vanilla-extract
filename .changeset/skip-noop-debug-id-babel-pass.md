---
'@vanilla-extract/babel-plugin-debug-ids': minor
'@vanilla-extract/integration': patch
---

Skip the debug-ids Babel pass on files that provably contain no debuggable calls

In `debug` mode, `@vanilla-extract/integration`'s `transform`/`transformSync` ran
every `*.css.ts` file through Babel to let `@vanilla-extract/babel-plugin-debug-ids`
attach debug IDs. Files that only use non-debuggable APIs (e.g. `globalStyle`,
`globalKeyframes`, `createThemeContract`) were parsed and regenerated for nothing —
and large generated stylesheets additionally triggered Babel's ">500KB" code-generator
deopt (`[BABEL] Note: The code generator has deoptimised the styling of … as it exceeds
the max of 500KB`), making that no-op pass especially slow.

`@vanilla-extract/babel-plugin-debug-ids` now exports `mightHaveDebuggableCalls(source)`,
a cheap word-bounded pre-check, and `@vanilla-extract/integration` uses it to skip the
Babel transform when it can have no effect. Output (class/var debug identifiers and
emitted CSS) is unchanged.
