---
title: Theming
---

# Theming

Theming in vanilla-extract is really just a set of helpers on top of the scoped CSS variable creation provided by [createVar](/documentation/create-var).

> 🧠 Themes are often thought of as global, application wide concepts.
> While vanilla-extract themes are great for that, they can also be used for more foccussed, lower level use-cases.
> e.g. A component that can be rendered with different tones, or color schemes.

Themes are comprised of two things:

- a typed data-structure of CSS variables. We refer to this as a **theme contract**.
- a CSS class setting all the variables in the theme contract to a specific value.

Let's take a look at an example.

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

Here we've called [createTheme] with our theme implementation.
From this, vanilla-extract infers you want to create a new theme contract matching this shape, and a CSS class implementing the theme with these values.
After processing this file, the resulting JS and CSS may look something like the following:

```js
// theme.css.js

import './theme.css';

export const vars = {
  color: {
    brand: 'var(--color-brand-12345)'
  },
  font: {
    body: 'var(--font-body-12346)'
  }
};

export const themeClass = 'theme_12347';
```

```css
/* theme.css */

.theme_12347 {
  --color-brand-12345: blue;
  --font-body-12346: arial;
}
```

Now if we want to create an alternative version of this theme, we can call [createTheme] again.
But this time we'll pass our existing theme contract in as well as our new values.

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

export const otherThemeClass = createTheme(vars, {
  color: {
    brand: 'red'
  },
  font: {
    body: 'helvetica'
  }
});
```

This time, instead of using the passed theme data-structure to create a new theme contract, it re-uses the existing one!
No new CSS variables are created as we're just creating a new CSS class setting the existing ones to different values.
On top of this, vanilla-extract knows the type of the existing theme contract and enforces you implement it completely and correctly.

After adding our second theme, our resulting compiled JS and CSS might look something like the following:

```js
// theme.css.js

import './theme.css';

export const vars = {
  color: {
    brand: 'var(--color-brand-12345)'
  },
  font: {
    body: 'var(--font-body-12346)'
  }
};

export const themeClass = 'theme_12347';

export const otherThemeClass = 'othertheme_12348';
```

```css
/* theme.css */

.theme_12347 {
  --color-brand-12345: blue;
  --font-body-12346: arial;
}

.othertheme_12348 {
  --color-brand-12345: red;
  --font-body-12346: helvetica;
}
```

## Theme contracts

While [createTheme] makes getting started with a theme really easy, it has some trade-offs.
It couples the defintion of our theme contract to a specific theme implementation.
It also means all your alternative themes must import the original theme to access the theme contract.
This causes you to unintentionally import the original theme's CSS as well, making it impossible to CSS code-split your themes.

This is where [createThemeContract] comes in. Remember before when we said themes comprise of a theme contract and a CSS class implementing the theme? Well [createThemeContract] lets us define the contract without generating any CSS!

Implementing the above scenario with [createThemeContract] would look something like the following:

> When creating a theme contract, the values of the input are ignored so you can pass an empty string, null, or real values. Whatever makes sense to you.

```tsx
// contract.css.ts

import { createThemeContract } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    brand: ''
  },
  font: {
    body: ''
  }
});
```

```tsx
// theme-one.css.ts

import { createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css';

export const themeClass = createTheme(vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

```tsx
// theme-one.css.ts

import { createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css';

export const otherThemeClass = createTheme(vars, {
  color: {
    brand: 'red'
  },
  font: {
    body: 'helvetica'
  }
});
```

Now we have two themes implementing the same contract, but importing either one will only import their respective CSS!

## Dynamic theming

Sometimes theme values aren't known until runtime.
[Theme contracts](#theme-contracts) are a perfect fit for this situation as they are just collections of CSS variables.
This means they can easily be set as inline styles while still retaining type safety.

We can use the [assignInlineVars] API from the [tiny](https://bundlephobia.com/package/@vanilla-extract/dynamic) _@vanilla-extract/dynamic_ package to apply our theme contract at runtime.

> This example uses React, but [assignInlineVars] will work with any framework or vanilla JS.

```tsx
// app.tsx

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from './contract.css.ts';

interface MyComponentProps {
  brandColor: string;
  bodyFont: string;
}
const MyComponent = ({
  brandColor,
  bodyFont
}: MyComponentProps) => (
  <section
    style={assignInlineVars(vars, {
      color: {
        brand: brandColor
      },
      font: {
        body: bodyFont
      }
    })}
  >
    ...
  </section>
);
```

This pattern opens up a lot of interesting possibilities. Type-safe runtime theming without the need for runtime creation and injection of CSS.

[createtheme]: /documentation/create-theme/
[createthemecontract]: /documentation/create-theme/
[assigninlinevars]: /documentation/dynamic/#assigninlinevars
[theme-contracts]: #theme-contracts
