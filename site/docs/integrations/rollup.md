---
title: Rollup
---

# Rollup

> Note: This option is useful for library development but not suitable for application bundles.
> Rollup has no built-in CSS bundling, so this plugin just outputs styles as individual CSS assets.
> For applications we instead recommend to use Vite
> (which itself uses Rollup under the hood but comes with its own CSS bundling).

1/ Install the dependencies.

```bash
npm install @vanilla-extract/css @vanilla-extract/rollup-plugin
```

2/ Add the [Rollup](https://rollupjs.org/) plugin to your Rollup config.

> 💡 This plugin accepts an optional [configuration object](#configuration).

```js
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';

// rollup.config.js
export default {
  plugins: [vanillaExtractPlugin(), ...]
}
```

This plugin works well with Rollup's `preserveModules`.

Rollup by default places assets in an "assets" directory.
You can configure [asset file names](https://rollupjs.org/guide/en/#outputassetfilenames)
if you care about CSS assets being placed right next to the corresponding JS files.

```js
  preserveModules: true,
  assetFileNames({ name }) {
    return name?.replace(/^src\//, '') ?? '';
  },
```

## Test environments

1/ Install the dependencies.

```bash
$ npm install @vanilla-extract/babel-plugin
```

2/ Add the [Babel](https://babeljs.io) plugin.

```json
{
  "plugins": ["@vanilla-extract/babel-plugin"]
}
```

3/ Remove any existing `.css` file mocks

It is very common in Jest setups to have a mock file returned for all `.css` files. This clashes with vanilla-extract as Jest can't differentiate between `.css` and `.css.ts` imports.

```json
{
  "jest": {
    "moduleNameMapper": {
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

4/ Disable runtime styles (Optional)

In testing environments (like `jsdom`) vanilla-extract will create and insert styles. While this is often desirable, it can be a major slowdown in your tests. If your tests don’t require styles to be available, the `disableRuntimeStyles` import will disable all style creation.

```ts
// setupTests.ts
import '@vanilla-extract/css/disableRuntimeStyles';
```

## Configuration

### identifiers

Different formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can be configured by selecting from the following options:

- `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
- `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `myfile_mystyle_hnw5tz3`

Each integration will set a default value based on the configuration options passed to the bundler.

### esbuildOptions

esbuild is used internally to compile `.css.ts` files before evaluating them to extract styles. You can pass additional options here to customize that process.
Accepts a subset of esbuild build options (`plugins`, `external`, `define` and `loader`), see https://esbuild.github.io/api/#build-api.
