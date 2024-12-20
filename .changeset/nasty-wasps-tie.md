---
'@vanilla-extract/css': minor
---

`createTheme`, `createGlobalTheme`: Add support for assigning themes to a layer

Themes can now be assigned to a layer by name using the `@layer` key at the top-level of the theme definition.

**EXAMPLE USAGE**:

```ts
// themes.css.ts
import { createTheme, createGlobalTheme, layer } from '@vanilla-extract/css';

export const themeLayer = layer();

export const [themeA, vars] = createTheme({
  '@layer': themeLayer,
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const vars2 = createGlobalTheme(':root', {
  '@layer': themeLayer,
  space: {
    small: '10px',
    large: '20px',
  }
});
```

This will generate the following CSS:

```css
@layer themes_themeLayer__1k6oxph0;
@layer themes_themeLayer__1k6oxph0 {
  .themes_themeA__1k6oxph1 {
    --color-brand__1k6oxph2: blue;
    --font-body__1k6oxph3: arial;
  }

  :root {
    --space-small__z05zdf1: 10px;
    --space-large__z05zdf2: 20px;
  }
}
```
