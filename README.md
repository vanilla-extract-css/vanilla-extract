# 🧁 vanilla-extract

**Zero-runtime Stylesheets-in-TypeScript.**

Write your styles in TypeScript (or JavaScript) with locally scoped class names and CSS Variables, then generate static CSS files at build time.

Basically, it’s [“CSS Modules](https://github.com/css-modules/css-modules)-in-TypeScript” but with scoped CSS Variables + heaps more.

---

**🚧 &nbsp; Please note, this is an alpha release.**

---

🔥 &nbsp; All styles generated at build time — just like [Sass](https://sass-lang.com), [Less](http://lesscss.org), etc.

✨ &nbsp; Minimal abstraction over standard CSS.

🦄 &nbsp; Works with any front-end framework — or even without one.

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

import { createTheme, style } from '@vanilla-extract/css';

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
  - [mapToStyles](#maptostyles)
  - [createTheme](#createtheme)
  - [createGlobalTheme](#createglobaltheme)
  - [createInlineTheme](#createinlinetheme)
  - [createThemeVars](#createthemevars)
  - [assignVars](#assignvars)
  - [createVar](#createvar)
  - [fallbackVar](#fallbackvar)
  - [fontFace](#fontface)
  - [globalFontFace](#globalfontface)
  - [keyframes](#keyframes)
  - [globalKeyframes](#globalkeyframes)
- [Utility functions](#utility-functions)
  - [calc](#calc)
- [Thanks](#thanks)
- [License](#license)

---

## Setup

1. Install the dependencies.

```bash
$ yarn add --dev @vanilla-extract/css @vanilla-extract/babel-plugin @vanilla-extract/webpack-plugin
```

2. Add the [Babel](https://babeljs.io) plugin.

```json
{
  "plugins": ["@vanilla-extract/babel-plugin"]
}
```

3. Add the [webpack](https://webpack.js.org) plugin.

```js
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = {
  plugins: [new VanillaExtractPlugin()],
};
```

<details>
  <summary>You'll need to ensure you're handling CSS files in your webpack config.</summary>

  <br/>
  For example:
  
  ```js
  const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');

  module.exports = {
    plugins: [
      new VanillaExtractPlugin(),
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

### Gatsby
To add to your Gatsby site, use the [gatsby-plugin-vanilla-extract](https://github.com/KyleAMathews/gatsby-plugin-vanilla-extract) plugin.

---

## API

### style

Creates styles attached to a locally scoped class name.

```ts
import { style } from '@vanilla-extract/css';

export const className = style({
  display: 'flex'
});
```

CSS Variables, simple pseudos, selectors and media/feature queries are all supported.

```ts
import { style } from '@vanilla-extract/css';

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
import { style } from '@vanilla-extract/css';

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
import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  margin: 0
});
```

### mapToStyles

Creates an object that maps style names to hashed class names.

> 💡 This is useful for mapping to component props, e.g. `<div className={styles.padding[props.padding]}>`

```ts
import { mapToStyles } from '@vanilla-extract/css';

export const padding = mapToStyles({
  small: { padding: 4 },
  medium: { padding: 8 },
  large: { padding: 16 }
});
```

You can also transform the values by providing a map function as the second argument.

```ts
import { mapToStyles } from '@vanilla-extract/css';

const spaceScale = {
  small: 4,
  medium: 8,
  large: 16
};

export const padding = mapToStyles(spaceScale, (space) => ({
  padding: space
}));
```

### createTheme

Creates a locally scoped theme class and a collection of scoped CSS Variables.

```ts
import { createTheme, style } from '@vanilla-extract/css';

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
import { createTheme, style } from '@vanilla-extract/css';

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
import { createGlobalTheme } from '@vanilla-extract/css';

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

### createInlineTheme

Generates a custom theme at runtime as an inline style object.

```ts
import { createInlineTheme } from '@vanilla-extract/css/createInlineTheme';
import { themeVars, exampleStyle } from './styles.css.ts';

const customTheme = createInlineTheme(themeVars, {
  small: '4px',
  medium: '8px',
  large: '16px'
});

document.write(`
  <section style="${customTheme}">
    <h1 class="${exampleStyle}">Hello world!</h1>
  </section>
`);
```

### createThemeVars

Creates a collection of CSS Variables without coupling them to a specific theme variant.

> 💡 This is useful if you want to split your themes into different bundles. In this case, your themes would be defined in separate files, but we'll keep this example simple.

```ts
import {
  createThemeVars,
  createTheme
} from '@vanilla-extract/css';

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

### assignVars

Allows you to set an entire collection of CSS Variables anywhere within a style block.

> 💡 This is useful for creating responsive themes since it can be used within `@media` blocks.

```ts
import { style, createThemeVars, assignVars } from '@vanilla-extract/css';

export const themeVars = createThemeVars({
  space: {
    small: null,
    medium: null,
    large: null
  }
});

export const responsiveSpaceTheme = style({
  vars: assignVars(themeVars.space, {
    small: '4px',
    medium: '8px',
    large: '16px'
  }),
  '@media': {
    'screen and (min-width: 1024px)': {
      vars: assignVars(themeVars.space, {
        small: '8px',
        medium: '16px',
        large: '32px'
      })
    }
  }
});
```

> 💡 All variables passed into this function must be assigned or it’s a type error.

### createVar

Creates a single CSS Variable.

```ts
import { createVar, style } from '@vanilla-extract/css';

export const colorVar = createVar();

export const exampleStyle = style({
  color: colorVar
});
```

Scoped variables can be set via the `vars` property on style objects.

```ts
import { createVar, style } from '@vanilla-extract/css';
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
import { createVar, fallbackVar, style } from '@vanilla-extract/css';

export const colorVar = createVar();

export const exampleStyle = style({
  color: fallbackVar(colorVar, 'blue');
});
```

Multiple fallbacks are also supported.

```ts
import { createVar, fallbackVar, style } from '@vanilla-extract/css';

export const primaryColorVar = createVar();
export const secondaryColorVar = createVar();

export const exampleStyle = style({
  color: fallbackVar(primaryColorVar, secondaryColorVar, 'blue');
});
```

### fontFace

Creates a custom font attached to a locally scoped font name.

```ts
import { fontFace, style } from '@vanilla-extract/css';

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
} from '@vanilla-extract/css';

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
import { keyframes, style } from '@vanilla-extract/css';

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
import { globalKeyframes, style } from '@vanilla-extract/css';

globalKeyframes('rotate', {
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' },
});

export const animated = style({
  animation: `3s infinite rotate`;
});
```

## Utility functions

We also provide a standalone package of optional utility functions to make it easier to work with CSS in TypeScript.

> 💡 This package can be used with any CSS-in-JS library.

```bash
$ yarn add --dev @vanilla-extract/css-utils
```

### calc

Streamlines the creation of CSS calc expressions.

```ts
import { calc } from '@vanilla-extract/css-utils';

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
import { calc } from '@vanilla-extract/css-utils';

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
