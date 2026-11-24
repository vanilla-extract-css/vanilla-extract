---
'@vanilla-extract/webpack-plugin': patch
---

Fix `$RefreshReg$ is not defined` and `Cannot read properties of undefined (reading 'register')` errors in development when React Refresh is enabled (e.g. Next.js or `@pmmmwh/react-refresh-webpack-plugin`) and a `.css.ts` file imports a module with PascalCase exports
