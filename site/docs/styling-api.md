---
title: Styling API
---

# Styling API

## style

Creates styles attached to a locally scoped class name.

```tsx
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const className = style({
  display: 'flex'
});
```

CSS Variables, simple pseudos, selectors and media/feature queries are all supported.

```tsx
// styles.css.ts

import { style } from '@vanilla-extract/css';
import { vars } from './vars.css.ts';

export const className = style({
  display: 'flex',
  vars: {
    [vars.localVar]: 'green',
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

```tsx
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const parentClass = style({});

export const childClass = style({
  selectors: {
    [`${parentClass}:focus &`]: {
      background: '#fafafa'
    }
  }
});
```

To improve maintainability, each style block can only target a single element. To enforce this, all selectors must target the **“&”** character which is a reference to the current element.

For example, **'&:hover:not(:active)'** is considered valid, while **'& > a'** and **[\`& ${childClass}\`]** are not.

If you want to target another scoped class then it should be defined within the style block of that class instead. For example, **[\`& ${childClass}\`]** is invalid since it targets **${childClass}**, so it should instead be defined in the style block for **childClass**.

If you want to globally target child nodes within the current element (e.g. **'& > a'**), you should use [globalStyle](#globalstyle) instead.

## styleVariants

Creates a collection of named style variants.

```tsx
// styles.css.ts

import { styleVariants } from '@vanilla-extract/css';

export const variant = styleVariants({
  primary: { background: 'blue' },
  secondary: { background: 'aqua' }
});
```

> 💡 This is useful for mapping component props to styles, e.g. `<button className={styles.variant[props.variant]}>`

You can also transform the values by providing a map function as the second argument.

```tsx
// styles.css.ts

import { styleVariants } from '@vanilla-extract/css';

const spaceScale = {
  small: 4,
  medium: 8,
  large: 16
};

export const padding = styleVariants(
  spaceScale,
  (space) => ({
    padding: space
  })
);
```

## composeStyles

Combines multiple styles into a single class string, while also deduplicating and removing unnecessary spaces.

```tsx
// styles.css.ts

import { style, composeStyles } from '@vanilla-extract/css';

const button = style({
  padding: 12,
  borderRadius: 8
});

export const primaryButton = composeStyles(
  button,
  style({ background: 'coral' })
);

export const secondaryButton = composeStyles(
  button,
  style({ background: 'peachpuff' })
);
```

> 💡 Styles can also be provided in shallow and deeply nested arrays, similar to [classnames.](https://github.com/JedWatson/classnames)

When style compositions are used in selectors, they are assigned an additional class so they can be uniquely identified. When selectors are processed internally, the composed classes are removed, only leaving behind the unique identifier classes. This allows you to treat them as if they were a single class within vanilla-extract selectors.

```ts
// styles.css.ts

import {
  style,
  globalStyle,
  composeStyles
} from '@vanilla-extract/css';

const background = style({ background: 'mintcream' });
const padding = style({ padding: 12 });

export const container = composeStyles(background, padding);

globalStyle(`${container} *`, {
  boxSizing: 'border-box'
});
```

## globalStyle

Creates styles attached to a global selector.

```tsx
// app.css.ts

import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  margin: 0
});
```

Global selectors can also contain references to other scoped class names.

```tsx
// app.css.ts

import { globalStyle } from '@vanilla-extract/css';

export const parentClass = style({});

globalStyle(`${parentClass} > a`, {
  color: 'pink'
});
```

## createTheme

Creates a locally scoped theme class and a theme contract which can be consumed within your styles.

**Ensure this function is called within a `.css.ts` context, otherwise variable names will be mismatched between files.**

```tsx
// theme.css.ts

import { createTheme } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

You can create theme variants by passing a theme contract as the first argument to `createTheme`.

```tsx
// themes.css.ts
import { createTheme } from '@vanilla-extract/css';

export const [themeA, vars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const themeB = createTheme(vars, {
  color: {
    brand: 'pink'
  },
  font: {
    body: 'comic sans ms'
  }
});
```

> 💡 All theme variants must provide a value for every variable or it’s a type error.

## createGlobalTheme

Creates a theme attached to a global selector, but with locally scoped variable names.

**Ensure this function is called within a `.css.ts` context, otherwise variable names will be mismatched between files.**

```tsx
// theme.css.ts
import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

> 💡 All theme variants must provide a value for every variable or it’s a type error.

If you want to implement an existing theme contract, you can pass it as the second argument.

```ts
// theme.css.ts
import {
  createThemeContract,
  createGlobalTheme
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

createGlobalTheme(':root', vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

## createThemeContract

Creates a contract of locally scoped variable names for themes to implement.

**Ensure this function is called within a `.css.ts` context, otherwise variable names will be mismatched between files.**

> 💡 This is useful if you want to split your themes into different bundles. In this case, your themes would be defined in separate files, but we'll keep this example simple.

```tsx
// themes.css.ts
import {
  createThemeContract,
  createTheme
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

export const themeA = createTheme(vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const themeB = createTheme(vars, {
  color: {
    brand: 'pink'
  },
  font: {
    body: 'comic sans ms'
  }
});
```

## createGlobalThemeContract

Creates a contract of globally scoped variable names for themes to implement.

> 💡 This is useful if you want to make your theme contract available to non-JavaScript environments.

```ts
// themes.css.ts
import {
  createGlobalThemeContract,
  createGlobalTheme
} from '@vanilla-extract/css';

export const vars = createGlobalThemeContract({
  color: {
    brand: 'color-brand'
  },
  font: {
    body: 'font-body'
  }
});

createGlobalTheme(':root', vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

You can also provide a map function as the second argument which has access to the value and the object path.

For example, you can automatically prefix all variable names.

```ts
// themes.css.ts
import { createGlobalThemeContract } from '@vanilla-extract/css';

export const vars = createGlobalThemeContract(
  {
    color: {
      brand: 'color-brand'
    },
    font: {
      body: 'font-body'
    }
  },
  (value) => `prefix-${value}`
);
```

You can also use the map function to automatically generate names from the object path, joining keys with a hyphen.

```ts
// themes.css.ts
import { createGlobalThemeContract } from '@vanilla-extract/css';

export const vars = createGlobalThemeContract(
  {
    color: {
      brand: null
    },
    font: {
      body: null
    }
  },
  (_value, path) => `prefix-${path.join('-')}`
);
```

## assignVars

Assigns a collection of CSS Variables anywhere within a style block.

> 💡 This is useful for creating responsive themes since it can be used within `@media` blocks.

```tsx
// theme.css.ts

import {
  createThemeContract,
  style,
  assignVars
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  space: {
    small: null,
    medium: null,
    large: null
  }
});

export const responsiveSpaceTheme = style({
  vars: assignVars(vars.space, {
    small: '4px',
    medium: '8px',
    large: '16px'
  }),
  '@media': {
    'screen and (min-width: 1024px)': {
      vars: assignVars(vars.space, {
        small: '8px',
        medium: '16px',
        large: '32px'
      })
    }
  }
});
```

> 💡 All variables passed into this function must be assigned or it’s a type error.

## createVar

Creates a single CSS Variable.

```tsx
// style.css.ts

import { createVar, style } from '@vanilla-extract/css';

export const colorVar = createVar();

export const exampleStyle = style({
  color: colorVar
});
```

Scoped variables can be set via the `vars` property on style objects.

```tsx
// style.css.ts

import { createVar, style } from '@vanilla-extract/css';
import { colorVar } from './vars.css.ts';

export const parentStyle = style({
  vars: {
    [colorVar]: 'blue'
  }
});
```

## fallbackVar

Provides fallback values when consuming variables.

```tsx
// style.css.ts

import { createVar, fallbackVar, style } from '@vanilla-extract/css';

export const colorVar = createVar();

export const exampleStyle = style({
  color: fallbackVar(colorVar, 'blue');
});
```

Multiple fallbacks are also supported.

```tsx
// style.css.ts

import { createVar, fallbackVar, style } from '@vanilla-extract/css';

export const primaryColorVar = createVar();
export const secondaryColorVar = createVar();

export const exampleStyle = style({
  color: fallbackVar(primaryColorVar, secondaryColorVar, 'blue');
});
```

## fontFace

Creates a custom font attached to a locally scoped font name.

```tsx
// style.css.ts

import { fontFace, style } from '@vanilla-extract/css';

const myFont = fontFace({
  src: 'local("Comic Sans MS")'
});

export const text = style({
  fontFamily: myFont
});
```

## globalFontFace

Creates a globally scoped custom font.

```tsx
// app.css.ts

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

## keyframes

Creates a locally scoped set of keyframes.

```tsx
// styles.css.ts

import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' }
});

export const animated = style({
  animation: `3s infinite ${rotate}`
});
```

## globalKeyframes

Creates a globally scoped set of keyframes.

```tsx
// app.css.ts

import {
  globalKeyframes,
  style
} from '@vanilla-extract/css';

globalKeyframes('rotate', {
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' }
});

export const animated = style({
  animation: `3s infinite rotate`
});
```
