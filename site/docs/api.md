---
title: API
---

# API

> 🍬 If you're a [treat](https://seek-oss.github.io/treat) user, check out our [migration guide.](./docs/treat-migration-guide.md)

## style

Creates styles attached to a locally scoped class name.

```tsx
import { style } from '@vanilla-extract/css';

export const className = style({
  display: 'flex'
});
```

CSS Variables (custom properties), simple pseudos, selectors and media/feature queries are all supported.

```tsx
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

```tsx
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


> 💡 To improve maintainability, each `style` block can only target a single element. To enforce this, all selectors must target the `&` character which is a reference to the current element. For example, `'&:hover:not(:active)'` is considered valid, while `'& > a'` and ``[`& ${childClass}`]`` are not.
> 
>If you want to target another scoped class then it should be defined within the `style` block of that class instead. For example, ``[`& ${childClass}`]`` is invalid since it targets `${childClass}`, so it should instead be defined in the `style` block for `childClass`.
>
>If you want to globally target child nodes within the current element (e.g. `'& > a'`), you should use [`globalStyle`](#globalstyle) instead.

## globalStyle

Creates styles attached to a global selector.

```tsx
import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  margin: 0
});
```

Global selectors can also contain references to other scoped class names.

```ts
import { globalStyle } from '@vanilla-extract/css';

export const parentClass = style({});

globalStyle(`${parentClass} > a`, {
  color: 'pink'
});
```

## mapToStyles

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

## createTheme

Creates a locally scoped theme class and a collection of scoped CSS Variables.

```tsx
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

```tsx
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

## createGlobalTheme

Creates a theme attached to a global selector, but with locally scoped variable names.

```tsx
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

## createThemeVars

Creates a collection of CSS Variables without coupling them to a specific theme variant.

> 💡 This is useful if you want to split your themes into different bundles. In this case, your themes would be defined in separate files, but we'll keep this example simple.

```tsx
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

## assignVars

Assigns a collection of CSS Variables anywhere within a style block.

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

## createVar

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

## fallbackVar

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

## fontFace

Creates a custom font attached to a locally scoped font name.

```tsx
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
import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' },
});

export const animated = style({
  animation: `3s infinite ${rotate}`;
});
```

## globalKeyframes

Creates a globally scoped set of keyframes.

```tsx
import { globalKeyframes, style } from '@vanilla-extract/css';

globalKeyframes('rotate', {
  '0%': { rotate: '0deg' },
  '100%': { rotate: '360deg' },
});

export const animated = style({
  animation: `3s infinite rotate`;
});
```
