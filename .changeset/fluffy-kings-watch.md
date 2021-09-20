---
'@vanilla-extract/vite-plugin': minor
---

Add `devStyleRuntime` option to allow switching between dev style runtimes

The built-in Vite dev style runtime (what adds styles to the page when running `vite serve`) doesn't seem to clean up old styles as expected. Passing `devStyleRuntime: 'vanilla-extract'` will instead use vanilla-extract's browser runtime. This pushes all style creation in devlopment to the browser, but may give a better HMR experience. 
