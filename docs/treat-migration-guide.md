# 🍬 treat migration guide

## `*.treat.ts`

The file extension has changed from `*.treat.ts` to `*.css.ts`.

## `.css.ts` files can import other `.css.ts` files

If you've worked around this limitation in the past, you don't have to worry about this anymore! 😎

## Autoprefixer

Autoprefixer isn't included in vanilla-extract. If you want this, you'll need to [manually add it to your webpack config.](https://github.com/webpack-contrib/postcss-loader#autoprefixer)

On the bright side, this means you have a lot more control over the handling of generated CSS. 😎

## `createTheme` / `TreatProvider`

**If you only have a single theme,** you can keep things simple by using `createGlobalTheme` and targeting `:root`. If you do this, your variables will just work without having to wire anything up to the document.

```ts
import { createGlobalTheme } from '@vanilla-extract/css';

export const themeVars = createGlobalTheme(':root', { ... });
```

**If you have multiple themes, or if you want to avoid the global scope,** use the [`createTheme`](https://github.com/seek-oss/vanilla-extract#createtheme) function instead.

```ts
// themeVars.css.ts

import { createTheme } from '@vanilla-extract/css';

export const [themeClass, themeVars] = createTheme({ ... });
```

> 💡 If you're bundle splitting your themes, you'll also want the [`createThemeVars`](https://github.com/seek-oss/vanilla-extract#createthemevars) function.

You no longer need React bindings for theming since we're just using standard CSS variables. Instead of using a provider at the root of your app, you need to attach your theme class to an element instead.

```tsx
// App.ts

import { themeClass } from './vars.css';

export const App = () => (
  <div className={themeClass}>...</div>
);
```

## Handling portals

CSS Variables don't follow the rules of React context, which means that theming won't automatically work when [rendering to a portal.](https://reactjs.org/docs/portals.html) To handle this, you'll need to ensure your theme class is available on context so you can access it when needed.

As a basic example, let's set up a `VanillaThemeContext`.

```tsx
// VanillaThemeContext.tsx

import { createContext, useContext } from 'react';

const VanillaThemeContext = createContext<string | null>(
  null
);

export const VanillaThemeProvider =
  VanillaThemeContext.Provider;

export const useVanillaTheme = () => {
  const themeClass = useContext(VanillaThemeContext);

  if (themeClass === null) {
    throw new Error('Must be inside VanillaThemeProvider');
  }

  return themeClass;
};
```

We can then use this `VanillaThemeProvider` at the root of our app.

```tsx
// App.tsx

import { createContext, useContext } from 'react';
import { themeClass } from './vars.css';
import { VanillaThemeProvider } from './VanillaThemeContext';

export const App = () => (
  <VanillaThemeContext value={themeClass}>
    <div className={themeClass}>...</div>
  </VanillaThemeContext>
);
```

We can now access the theme via our custom `useVanillaTheme` Hook and apply it to the root element of our portal.

```tsx
// MyPortalComponent.tsx

import { createPortal } from 'react-dom';
import { useVanillaTheme } from './VanillaThemeContext';

export const MyPortalComponent = () => {
  const themeClass = useVanillaTheme();

  return createPortal(
    <div className={themeClass}>...</div>,
    document.body
  );
};
```

## `useStyles` / `resolveStyles`

The whole concept of `styleRefs` and `useStyles`/`resolveStyles` goes away. No more plumbing required 😎

```diff
-import { useStyles } from 'react-treat';
-import * as styleRefs from './styles.treat';
+import * as styles from './styles.css';

export const Foo = () => {
-  const styles = useStyles(styleRefs);

  return (
    <div className={styles.root}>
      ...
    </div>
  );
}
```

## `style`

Since theme variables are now managed by the browser, the `style` function no longer accepts a theme callback.

To get access to variables, we now import theme variables from the `.css.ts` file that defines them.

```diff
-import { style } from 'treat';
-
-const className = style(theme => ({
-  paddingTop: theme.space.small
-}))

+import { style } from '@vanilla-extract/css';
+import { themeVars } from '../themeVars.css';
+
+export const className = style({
+  marginTop: themeVars.space.small
+});
```

Note that this means the theme is no longer global! You don't need to worry about setting up [global theme types,](https://seek-oss.github.io/treat/data-types#theme) and you can run multiple sets of theme variables in parallel.

## `styleMap`

You can use [`mapToStyles`](https://github.com/seek-oss/vanilla-extract#maptostyles) as a drop-in replacement. Note that it now accepts a map function as the second argument, so you may be able to simplify some of your code.

## `styleTree`

Since you now have direct access to theme objects outside of a style block, this function is no longer necessary.

## Style calculations

> **⚠️ When it comes to inline style calculations, CSS Variables are inherently more limited than treat's theming system. This is because you can only use standard CSS functions rather than being able to execute arbitrary JavaScript code.**
>
> If your app only has a single theme and you think this change is too limiting for you, you might want to consider avoiding CSS Variables entirely and using a shared object of constants and calculating all theme-based styles at build time instead.

Theme tokens are now opaque CSS Variables (i.e. `"var(--g7vce91)"`) rather than actual token values that differs per theme, which means you can't perform JavaScript calculations on them.

For simple calculations that are covered by CSS's `calc` function (addition, subtraction, multiplication, division), we provide a [`calc`](https://github.com/seek-oss/vanilla-extract#calc) function in the `@vanilla-extract/css-utils` package to make this a bit easier.

```diff
-import { style } from 'treat';
-
-const className = style(theme => ({
-  marginTop: theme.space.small * -1
-}))

+import { style } from '@vanilla-extract/css';
+import { calc } from '@vanilla-extract/css-utils';
+import { themeVars } from '../themeVars.css';
+
+const className = style({
+  marginTop: calc.negate(themeVars.space.small)
+});
```

**If you're doing anything more advanced with theme variables that the browser doesn't natively support (e.g. rounding numbers, modifying colours), you'll need to hoist this logic into your theme as CSS variables.**

For example, let's assume you've calculated a lighter colour variant inline using using [Polished.](https://polished.js.org/)

```ts
import { style } from 'treat';
import { lighten } from 'polished';

export const className = style((theme) => ({
  background: lighten(0.2, theme.color.brand)
}));
```

Since this calculation is not yet supported natively in CSS, this lighter background would need to become part of your theme definition. In this case, we'll introduce a new `color` variable called `brandLight`. Notice that in this context we're able to execute arbitrary JavaScript code.

```ts
// themeVars.css.ts

import { createGlobalTheme } from '@vanilla-extract/css';
import { lighten } from 'polished';

const brandColor = 'blue';

export const themeVars = createGlobalTheme(':root', {
  color: {
    brand: brandColor,
    brandLight: lighten(0.2, brandColor)
  }
});
```

You would then update your styles to use this new CSS Variable instead.

```diff
-import { style } from 'treat';
-import { lighten } from 'polished';
+import { style } from '@vanilla-extract/css';
+import { themeVars } from '../themeVars.css';

-export const className = style(theme => ({
-  background: lighten(0.2, theme.color.brand)
-}));
+export const className = style({
+  background: themeVars.color.brandLight
+});
```

## `@keyframes`

The `@keyframes` property is no longer supported on style objects. Instead, you should create keyframes separately with the `keyframes` function.

```diff
-import { style } from 'treat';
-
-const className = style({
-  '@keyframes': { ... },
-  animationName: '@keyframes'
-});

+import { keyframes, style } from '@vanilla-extract/css';
+const myAnimationName = keyframes({ ... });
+
+const className = style({
+  animationName: myAnimationName
+});
```

## Did we forget anything?

[Please let us know.](https://github.com/seek-oss/vanilla-extract/issues/new)
