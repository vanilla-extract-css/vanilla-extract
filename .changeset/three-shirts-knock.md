---
'@vanilla-extract/vite-plugin': major
---

BREAKING CHANGE: User-configured vite plugins are no longer forwarded through to the Vanilla Extract compiler by default. This should not affect most consumers.

Previously, all vite plugins except for a select few incompatible plugins were forwarded through. This resulted in a constant game of whack-a-mole as new plugins were added to the list of incompatible plugins as issues were discovered.

Framework-specific plugins, as well as plugins that handle assets and build output, tend not to be relevant to Vanilla Extract code, and in some cases cause more harm than good.

For that reason, in this release only the `vite-tsconfig-paths` plugin is fowarded through by default. This is a relatively common plugin that is know to be compatible with the Vanilla Extract compiler. 

In most cases users should not need to forward any additional plugins through to the Vanilla Extract compiler. However, if such a case arises, a plugin filter function can be provided via the `unstable_pluginFilter` option:

```ts
// vite.config.ts

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { vitePluginFoo } from 'vite-plugin-foo';

export default defineConfig({
  plugins: [
    vitePluginFoo(),
    vanillaExtractPlugin({
      // Only forward the `vite-plugin-foo` plugin through to the Vanilla Extract compiler
      unstable_pluginFilter: ({ name, mode }) => plugin.name === 'vite-plugin-foo',
    }),
  ],
});
```

> [!NOTE]
> When providing a plugin filter function, the `vite-tsconfig-paths` plugin will no longer be forwarded through by default.
> If you wish to forward this plugin through, you must include it in your filter function.

> [!IMPORTANT]
> The `unstable_pluginFilter` API is considered unstable and may be changed or removed without notice in a future non-major version.
