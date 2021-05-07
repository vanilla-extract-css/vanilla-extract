---
title: Getting Started
---

# **Zero-runtime<br/>Stylesheets-in-TypeScript.**

Write your styles in TypeScript (or JavaScript) with locally scoped class names and CSS Variables, then generate static CSS files at build time.

Basically, it’s “[CSS Modules](https://github.com/css-modules/css-modules)-in-TypeScript” but with scoped CSS Variables + heaps more.

> **🚧 &nbsp; Please note, this is an alpha release.**

🔥 &nbsp; All styles generated at build time — just like [Sass](https://sass-lang.com), [Less](http://lesscss.org), etc.

✨ &nbsp; Minimal abstraction over standard CSS.

🦄 &nbsp; Works with any front-end framework — or even without one.

🌳 &nbsp; Locally scoped class names — just like [CSS Modules](https://github.com/css-modules/css-modules).

🚀 &nbsp; Locally scoped [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), `@keyframes` and `@font-face` rules.

🎨 &nbsp; High-level theme system with support for simultaneous themes. No globals!

🛠 &nbsp; Utils for generating variable-based `calc` expressions.

💪 &nbsp; Type-safe styles via [CSSType](https://github.com/frenic/csstype).

🏃‍♂️ &nbsp; Optional runtime version for development and testing.

🙈 &nbsp; Optional API for dynamic runtime theming.

> 🖥 &nbsp; [Try it out for yourself in CodeSandbox.](https://codesandbox.io/s/github/seek-oss/vanilla-extract/tree/master/examples/webpack-react?file=/src/App.css.ts)

**Write your styles in `.css.ts` files.**

```tsx
// styles.css.ts
import { createTheme, style } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const exampleStyle = style({
  backgroundColor: vars.color.brand,
  fontFamily: vars.font.body,
  color: 'white',
  padding: 10
});
```

> 💡 These `.css.ts` files will be evaluated at build time. None of the code in these files will be included in your final bundle. Think of it as using TypeScript as your preprocessor instead of Sass, Less, etc.

**Then consume them in your markup.**

```tsx
// app.ts
import { themeClass, exampleStyle } from './styles.css.ts';

document.write(`
  <section class="${themeClass}">
    <h1 class="${exampleStyle}">Hello world!</h1>
  </section>
`);
```

---

Want to work at a higher level while maximising style re-use? Check out 🍨 [Sprinkles](https://github.com/seek-oss/vanilla-extract/tree/master/packages/sprinkles), our official zero-runtime atomic CSS framework, built on top of vanilla-extract.

---
