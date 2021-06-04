---
'@vanilla-extract/esbuild-plugin': minor
---

Add `processCss` plugin option to allow further processing of css while bundling.

**Example for postcss with autoprefixer:**

```js
const { vanillaExtractPlugin } = require('@vanilla-extract/esbuild-plugin');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

require('esbuild').build({
  entryPoints: ['app.ts'],
  bundle: true,
  plugins: [vanillaExtractPlugin({

    processCss: async (css) => {
      return (await postcss([autoprefixer])
        .process(css, { from: undefined /* suppress source map warning */ })
      ).css
    }

  })],
  outfile: 'out.js',
}).catch(() => process.exit(1))
```
