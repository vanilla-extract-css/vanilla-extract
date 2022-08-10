---
title: Test Environments
---

# Test Environments

Add automatic debuggable identifiers to generated class names and variables using a [Babel](https://babeljs.io) plugin.

## Installation

```bash
npm install @vanilla-extract/babel-plugin
```

## Setup

Add the plugin to your Babel configuration.

```json
{
  "plugins": ["@vanilla-extract/babel-plugin"]
}
```

## Environment Configuration

In testing environments (like `jsdom`) vanilla-extract will create and insert styles. As this behaviour can differ from other styling solutions there are some points to consider.

### Remove style mocking

It is very common in Jest setups to have a mock file returned for all `.css` files. This clashes with vanilla-extract as Jest can't differentiate between `.css` and `.css.ts` imports.

For example:

```json
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
{
  "jest": {
    "moduleNameMapper": {
      "my-css-folder/.*\\.css$": "<rootDir>/styleMock.js",
      "\\.legacy\\.css$": "<rootDir>/styleMock.js"
    }
  }
}
```

### Disable runtime styles

While testing against actual styles is often desirable, it can be a major slowdown in your tests. If your tests don’t require styles to be available, importing `disableRuntimeStyles` will prevent all style creation.

```ts
// setupTests.ts
import '@vanilla-extract/css/disableRuntimeStyles';
```
