---
'@vanilla-extract/esbuild-plugin': minor
---

Add `processCss` plugin option to allow further processing of CSS while bundling.

**Example for postcss with autoprefixer:**

```js
const { vanillaExtractPlugin } = require("@vanilla-extract/esbuild-plugin");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

async function processCss(css) {
  const result = await postcss([autoprefixer]).process(css, {
      from: undefined /* suppress source map warning */,
  });

  return result.css;
}

require("esbuild")
  .build({
    entryPoints: ["app.ts"],
    bundle: true,
    plugins: [
      vanillaExtractPlugin({
        processCss,
      }),
    ],
    outfile: "out.js",
  })
  .catch(() => process.exit(1));
```
