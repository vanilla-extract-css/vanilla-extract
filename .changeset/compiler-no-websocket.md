---
'@vanilla-extract/compiler': patch
---

Fix the compiler opening an unused WebSocket server on Vite's default HMR port (`24678`) when the parent Vite server runs in middleware mode, which logged "Port 24678 is already in use" when running multiple such dev servers at once
