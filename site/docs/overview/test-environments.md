---
title: Test Environments
---

# Test Environments

Typically in test environments CSS files are mocked due to node being unable to import or understand non-JavaScript code.
This is not the case with vanilla-extract, where the stylesheets themselves are in fact valid code that can be executed in a node environment.

When executing a `.css.ts` file, class name identifiers will be returned as expected, and if running in a browser-like environment, such as [jsdom], then real styles will be injected into the document. However for vanilla-extract styles to work in a test environment, a transform needs to be applied to the code.

Currently, [Jest] and [Vitest] have official integrations. Please reach out in the [Discord] or [Discussions] for help with other setups.

## Jest

Install the [Jest] transformer

```bash
npm install --dev @vanilla-extract/jest-transform
```

Add the transform to your Jest configuration.

```json
// jest.config.js
{
  "transform": {
    "\\.css\\.ts$": "@vanilla-extract/jest-transform"
  }
}
```

### Remove Style Mocking

It is very common in Jest setups to have a mock file returned for all `.css` files. This clashes with vanilla-extract as Jest can't differentiate between `.css` and `.css.ts` imports.

For example:

```json
// package.json
{
  "jest": {
    "moduleNameMapper": {
      // ❌ Breaks .css.ts imports
      "\\.css$": "<rootDir>/styleMock.js"
    }
  }
}
```

Ideally, remove this mock from your setup. However, if you need to support both at the same time you'll need a way to target your regular CSS files. Using a folder for all your CSS files, or giving your CSS files a custom extension will work.

```json
// package.json
{
  "jest": {
    "moduleNameMapper": {
      "my-css-folder/.*\\.css$": "<rootDir>/styleMock.js",
      "\\.legacy\\.css$": "<rootDir>/styleMock.js"
    }
  }
}
```

## Vitest

If you are already using vanilla-extract with [Vite] then no setup should be required as [Vitest] references your existing vite config file.

If using [Vitest] in other environments, install the `@vanilla-extract/vite-plugin`:

```bash
npm install --dev @vanilla-extract/vite-plugin
```

Add the plugin to your Vitest configuration.

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [vanillaExtractPlugin()]
});
```

## Disabling Runtime Styles

While testing against actual styles is often desirable, it can be a major slowdown in your tests. If your tests don’t require styles to be available, importing `disableRuntimeStyles` will prevent all style creation.

```ts
// setupTests.ts
import '@vanilla-extract/css/disableRuntimeStyles';
```

[vite]: https://vitejs.dev/
[vitest]: https://vitest.dev/
[jsdom]: https://github.com/jsdom/jsdom
[jest]: https://jestjs.io/
[discord]: https://discord.gg/6nCfPwwz6w
[discussions]: https://github.com/seek-oss/vanilla-extract/discussions
