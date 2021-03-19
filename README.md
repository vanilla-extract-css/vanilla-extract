# 🧁

**Zero-runtime CSS-in-JS for CSS developers.**

Author your styles in JavaScript/TypeScript with locally scoped class names and CSS Variables, then generate purely static CSS files.

Basically, it’s [“CSS Modules](https://github.com/css-modules/css-modules)-in-JS” but with more features.

---

**🚧 &nbsp; PLEASE NOTE: THIS IS AN ALPHA RELEASE &nbsp; 🚧**

---

🔥 &nbsp; All styles generated at build time — just like Sass, Less, etc.

✨ &nbsp; Minimal abstraction over standard CSS. All CSS features are available.

🌳 &nbsp; Locally scoped class names — just like CSS Modules.

🛠 &nbsp; Locally scoped custom property names, i.e. CSS Variables.

🎨 &nbsp; High-level theme system with support for simultaneous themes. No globals!

🏃‍♂️ &nbsp; Optional runtime version for development and testing.

💪 &nbsp; First-class TypeScript support.

---

**Author your styles in `.css.ts` files — or JS, if you prefer.**

```ts
// styles.css.ts

import { createTheme, style } from '@mattsjones/css-core';

export const [theme, vars] = createTheme({
  brandColor: 'blue',
  fontFamily: 'arial'
});

export const exampleStyle = style({
  backgroundColor: vars.brandColor,
  fontFamily: vars.fontFamily,
  color: 'white',
  padding: 10
});
```

> 💡 These `.css.ts`/`.css.js` files will be evaluated at build time. None of the code in these files will be included in your final bundle. Think of it as using JavaScript/TypeScript as your preprocessor.

**Then consume them in your markup.**

```tsx
// app.ts

import { theme, exampleStyle } from './styles.css.ts';

document.write(`
  <section class="${theme}">
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
  - [createThemeVars](#createthemevars)
  - [createGlobalTheme](#createglobaltheme)
- [Advanced API](#advanced-api)
  - [mapToStyles](#maptostyles)
  - [createVar](#createvar)
  - [assignVars](#assignvars)
- [Thanks](#thanks)

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
const {
  TreatPlugin
} = require('@mattsjones/css-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new TreatPlugin({
      outputLoaders: [MiniCssExtractPlugin.loader]
    })
  ]
};
```

---

## API

### style

Create individual style rules.

```ts
import { style } from '@mattsjones/css-core';

export const className = style({
  display: 'flex'
});
```

Simple psuedos, selectors, `@media`/`@supports` queries and CSS Variables (custom properties) are all supported.

```tsx
import { style } from '@mattsjones/css-core';

export const className = style({
  display: 'flex',
  ':hover': {
    color: 'red'
  },
  selectors: {
    '&:nth-child(2)': {
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
      display: grid;
    }
  },
  vars: {
    '--global-variable': 'purple'
  }
});
```

### globalStyle

Creates globally scoped CSS.

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

export const [theme, vars] = createTheme({
  brandColor: 'blue',
  fontFamily: 'arial'
});
```

You can create theme variants by passing a variables object as the first argument to `createTheme`.

```ts
import { createTheme, style } from '@mattsjones/css-core';

export const [themeA, vars] = createTheme({
  brandColor: 'blue',
  fontFamily: 'arial'
});

export const themeB = createTheme(vars, {
  brandColor: 'pink',
  fontFamily: 'comic sans ms'
});
```

### createThemeVars

Creates a collection of CSS Variables without coupling them to a specific theme implementation.

This is particularly useful if you want to split your themes into different bundles. In this case, your themes would be defined in separate files, but we'll keep this example simple.

```ts
import {
  createThemeVars,
  createTheme
} from '@mattsjones/css-core';

export const vars = createThemeVars({
  brandColor: null,
  fontFamily: null
});

export const themeA = createTheme(vars, {
  brandColor: 'blue',
  fontFamily: 'arial'
});

export const themeB = createTheme(vars, {
  brandColor: 'pink',
  fontFamily: 'comic sans ms'
});
```

### createGlobalTheme

Creates a globally scoped theme, but with locally scoped variable names.

```ts
import { createGlobalTheme } from '@mattsjones/css-core';

export const vars = createGlobalTheme(':root', {
  brandColor: 'blue',
  fontFamily: 'arial'
});
```

---

## Advanced API

### mapToStyles

Creates an object that maps style names to hashed class names. This is particularly useful for mapping to component props, e.g. `<div className={styles.padding[props.padding]}>`

```ts
import { mapToStyles } from '@mattsjones/css-core';

export const padding = mapToStyles({
  small: { padding: 4 },
  medium: { padding: 8 },
  large: { padding: 16 }
});
```

You can also provide a map function as the second argument.

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
import { colorVar } from './vars.css';

export const parentStyle = style({
  vars: {
    [colorVar]: 'blue'
  }
});
```

### assignVars

Allows you to set an entire collection of CSS Variables anywhere within a style block.

```tsx
import { style, assignVars } from '@mattsjones/css-core';
import { themeVars } from './vars.css';

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

---

## Thanks

- [Nathan Nam Tran](https://twitter.com/naistran) for creating [css-in-js-loader](https://github.com/naistran/css-in-js-loader), which served as the initial starting point for [treat](https://seek-oss.github.io/treat), the precursor to this library.
- [Stitches](https://stitches.dev/) for getting us excited about CSS-Variables-in-JS.
- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.
