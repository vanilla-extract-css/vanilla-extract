# 🧁

**Zero-runtime Stylesheets-in-TypeScript.**

Write your styles in TypeScript (or JavaScript) with locally scoped class names and CSS Variables, then generate static CSS files at build time.

Basically, it’s [“CSS Modules](https://github.com/css-modules/css-modules)-in-TypeScript” but with scoped CSS Variables + heaps more.

---

**🚧 &nbsp; Please note, this is an alpha release.**

---

🔥 &nbsp; All styles generated at build time — just like [Sass](https://sass-lang.com), [Less](http://lesscss.org), etc.

✨ &nbsp; Minimal abstraction over standard CSS.

🌳 &nbsp; Locally scoped class names — just like [CSS Modules.](https://github.com/css-modules/css-modules)

🚀 &nbsp; Locally scoped [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), `@keyframes` and `@font-face` rules.

🎨 &nbsp; High-level theme system with support for simultaneous themes. No globals!

🛠 &nbsp; Utils for generating variable-based `calc` expressions.

💪 &nbsp; Type-safe styles via [CSSType.](https://github.com/frenic/csstype)

🏃‍♂️ &nbsp; Optional runtime version for development and testing.

---

**Write your styles in `.css.ts` files.**

```ts
// styles.css.ts

import { createTheme, style } from '@mattsjones/css-core';

export const [themeClass, themeVars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const exampleStyle = style({
  backgroundColor: themeVars.color.brand,
  fontFamily: themeVars.font.body,
  color: 'white',
  padding: 10
});
```

> 💡 These `.css.ts` files will be evaluated at build time. None of the code in these files will be included in your final bundle. Think of it as using TypeScript as your preprocessor instead of Sass, Less, etc.

**Then consume them in your markup.**

```ts
// app.ts

import { themeClass, exampleStyle } from './styles.css.ts';

document.write(`
  <section class="${themeClass}">
    <h1 class="${exampleStyle}">Hello world!</h1>
  </section>
`);
```

---

- [Setup](#setup)
- [API](#api)
  - [style](#style)
  - [globalStyle](#globalstyle)
  - [createTheme](#createtheme)
  - [createGlobalTheme](#createglobaltheme)
  - [createThemeVars](#createthemevars)
  - [fontFace](#fontface)
  - [globalFontFace](#globalfontface)
  - [keyframes](#keyframes)
  - [globalKeyframes](#globalkeyframes)
- [Advanced API](#advanced-api)
  - [mapToStyles](#maptostyles)
  - [createVar](#createvar)
  - [fallbackVar](#fallbackvar)
  - [assignVars](#assignvars)
  - [inlineTheme](#inlinetheme)
- [Utility functions](#utility-functions)
  - [calc](#calc)
- [Thanks](#thanks)
- [License](#license)

---

## Setup

1. Install the dependencies.

```bash
$ yarn add --dev @mattsjones/css-core @mattsjones/css-babel-plugin @mattsjones/css-webpack-plugin
```

2. Add the [Babel](https://babeljs.io) plugin.

```json
{
  "plugins": ["@mattsjones/css-babel-plugin"]
}
```

3. Add the [webpack](https://webpack.js.org) plugin.

```js
const { TreatPlugin } = require('@mattsjones/css-webpack-plugin');

module.exports = {
  plugins: [new TreatPlugin()],
};
```

<details>
  <summary>You'll need to ensure you're handling CSS files in your webpack config.</summary>

  <br/>
  For example:
  
  ```js
  const { TreatPlugin } = require('@mattsjones/css-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');

  module.exports = {
    plugins: [
      new TreatPlugin(),
      new MiniCssExtractPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
      ],
    },
  };
  ```
</details>

---

## API

### style

Creates styles attached to a locally scoped class name.

```ts
import { style } from '@mattsjones/css-core';

export const className = style({
  display: 'flex'
});
```

CSS Variables (custom properties), simple pseudos, selectors and media/feature queries are all supported.

```ts
import { style } from '@mattsjones/css-core';

export const className = style({
  display: 'flex',
  vars: {
    '--global-variable': 'purple'
  },
  ':hover': {
    color: 'red'
  },
  selectors: {
    '&:nth-child(2n)': {
      background: '#fafafa'
    }
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 10
    }
  },
  '@supports': {
    '(display: grid)': {
      display: 'grid'
    }
  }
});
```

Selectors can also contain references to other scoped class names.

```ts
import { style } from '@mattsjones/css-core';

export const parentClass = style({});

export const childClass = style({
  selectors: {
    [`${parentClass}:focus &`]: {
      background: '#fafafa'
    }
  },
});
```

### globalStyle

Creates styles attached to a global selector.

```ts
import { globalStyle } from '@mattsjones/css-core';

globalStyle('html, body', {
  margin: 0
});
```

### createTheme

Creates a locally scoped theme class and a collection of scoped CSS Variables.

```ts
import { createTheme, style } from '@mattsjones/css-core';

export const [themeClass, themeVars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

You can create theme variants by passing a collection of theme variables as the first argument to `createTheme`.

```ts
import { createTheme, style } from '@mattsjones/css-core';

export const [themeA, themeVars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const themeB = createTheme(themeVars, {
  color: {
    brand: 'pink'
  },
  font: {
    body: 'comic sans ms'
  }
});
```

> 💡 All theme variants must provide a value for every variable or it’s a type error.

### createGlobalTheme

Creates a theme attached to a global selector, but with locally scoped variable names.

```ts
import { createGlobalTheme } from '@mattsjones/css-core';

export const themeVars = createGlobalTheme(':root', {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

> 💡 All theme variants must provide a value for every variable or it’s a type error.

### createThemeVars

Creates a collection of CSS Variables without coupling them to a specific theme variant.

> 💡 This is useful if you want to split your themes into different bundles. In this case, your themes would be defined in separate files, but we'll keep this example simple.

```ts
import {
  createThemeVars,
  createTheme
} from '@mattsjones/css-core';

export const themeVars = createThemeVars({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

export const themeA = createTheme(themeVars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const themeB = createTheme(themeVars, {
  color: {
    brand: 'pink'
  },
  font: {
    body: 'comic sans ms'
  }
});
```

### fontFace

Creates a custom font attached to a locally scoped font name.

```ts
import { fontFace, style } from '@mattsjones/css-core';

const myFont = fontFace({
  src: 'local("Comic Sans MS")'
});

export const text = style({
  fontFamily: myFont
});
```

### globalFontFace

Creates a globally scoped custom font.

```ts
import {
  globalFontFace,
  style
} from '@mattsjones/css-core';

globalFontFace('MyGlobalFont', {
  src: 'local("Comic Sans MS")'
});

export const text = style({
  fontFamily: 'MyGlobalFont'
});
```

### keyframes

Creates a locally scoped set of keyframes.

```ts
import { keyframes, style } from '@mattsjones/css-core';

const rotate = keyframes({
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' },
});

export const animated = style({
  animation: `3s infinite ${rotate}`;
});
```

### globalKeyframes

Creates a globally scoped set of keyframes.

```ts
import { globalKeyframes, style } from '@mattsjones/css-core';

globalKeyframes('rotate', {
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' },
});

export const animated = style({
  animation: `3s infinite rotate`;
});
```

---

## Advanced API

### mapToStyles

Creates an object that maps style names to hashed class names.

> 💡 This is useful for mapping to component props, e.g. `<div className={styles.padding[props.padding]}>`

```ts
import { mapToStyles } from '@mattsjones/css-core';

export const padding = mapToStyles({
  small: { padding: 4 },
  medium: { padding: 8 },
  large: { padding: 16 }
});
```

You can also transform the values by providing a map function as the second argument.

```ts
import { mapToStyles } from '@mattsjones/css-core';

const spaceScale = {
  small: 4,
  medium: 8,
  large: 16
};

export const padding = mapToStyles(spaceScale, (space) => ({
  padding: space
}));
```

### createVar

Creates a single CSS Variable.

```ts
import { createVar, style } from '@mattsjones/css-core';

export const colorVar = createVar();

export const exampleStyle = style({
  color: colorVar
});
```

Scoped variables can be set via the `vars` property on style objects.

```ts
import { createVar, style } from '@mattsjones/css-core';
import { colorVar } from './vars.css.ts';

export const parentStyle = style({
  vars: {
    [colorVar]: 'blue'
  }
});
```

### fallbackVar

Provides fallback values when consuming variables.

```ts
import { createVar, fallbackVar, style } from '@mattsjones/css-core';

export const colorVar = createVar();

export const exampleStyle = style({
  color: fallbackVar(colorVar, 'blue');
});
```

Multiple fallbacks are also supported.

```ts
import { createVar, fallbackVar, style } from '@mattsjones/css-core';

export const primaryColorVar = createVar();
export const secondaryColorVar = createVar();

export const exampleStyle = style({
  color: fallbackVar(primaryColorVar, secondaryColorVar, 'blue');
});
```

### assignVars

Allows you to set an entire collection of CSS Variables anywhere within a style block.

> 💡 This is useful for creating responsive themes since it can be used within an `@media` block.

```ts
import { style, assignVars } from '@mattsjones/css-core';
import { themeVars } from './vars.css.ts';

export const exampleStyle = style({
  vars: assignVars(themeVars.space, {
    small: 4,
    medium: 8,
    large: 16
  }),
  '@media': {
    'screen and (min-width: 1024px)': {
      vars: assignVars(themeVars.space, {
        small: 8,
        medium: 16,
        large: 32
      })
    }
  }
});
```

> 💡 All variables passed into this function must be assigned or it’s a type error.

### inlineTheme

Generates a custom theme at runtime as an inline style object.

```ts
import { inlineTheme } from '@mattsjones/css-core';
import { themeVars, exampleStyle } from './styles.css.ts';

const customTheme = inlineTheme(themeVars, {
  small: 4,
  medium: 8,
  large: 16
});

document.write(`
  <section style="${customTheme}">
    <h1 class="${exampleStyle}">Hello world!</h1>
  </section>
`);
```

## Utility functions

We also provide a standalone package of optional utility functions to make it easier to work with CSS in TypeScript.

> 💡 This package can be used with any CSS-in-JS library.

```bash
$ yarn add --dev @mattsjones/css-utils
```

### calc

Streamlines the creation of CSS calc expressions.

```ts
import { calc } from '@mattsjones/css-utils';

const styles = {
  height: calc.multiply('var(--grid-unit)', 2)
};
```

The following functions are available.

- `calc.add`
- `calc.subtract`
- `calc.multiply`
- `calc.divide`
- `calc.negate`

The `calc` export is also a function, providing a chainable API for complex calc expressions.

```ts
import { calc } from '@mattsjones/css-utils';

const styles = {
  marginTop: calc('var(--space-large)')
    .divide(2)
    .negate()
    .toString()
};
```

---

## Thanks

- [Nathan Nam Tran](https://twitter.com/naistran) for creating [css-in-js-loader](https://github.com/naistran/css-in-js-loader), which served as the initial starting point for [treat](https://seek-oss.github.io/treat), the precursor to this library.
- [Stitches](https://stitches.dev/) for getting us excited about CSS-Variables-in-JS.
- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.

## License

MIT.
