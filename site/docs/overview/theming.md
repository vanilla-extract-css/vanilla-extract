---
title: Theming
---

# Theming

Themes are often thought of as global, application wide concepts. While vanilla-extract themes are great for that, they can also be used for more focussed, lower level use-cases.
For example, a component being rendered in different color schemes.

Theming in vanilla-extract is really just a set of helpers on top of the scoped CSS variable creation provided by [createVar].

To understand how it works, let's take a look at an example.

```ts compiled
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

Here we’ve called [createTheme] with our theme implementation.
Based on this, vanilla-extract will return two things:

- **A class name:** a container class for the provided theme variables.
- **A theme contract:** a typed data-structure of CSS variables, matching the shape of the provided theme implementation.

After processing this file, the resulting compiled JS will look something like this:

```js
// theme.js
// Example result of the compiled JS
import './theme.css';

export const vars = {
  color: {
    brand: 'var(--color-brand__l520oi1)'
  },
  font: {
    body: 'var(--font-body__l520oi2)'
  }
};

export const themeClass = 'theme_themeClass__l520oi0';
```

To create an alternative version of this theme, call [createTheme] again.
But this time pass the existing theme contract (i.e. `vars`), as well as the new values.

```ts compiled
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

By passing in an existing theme contract, instead of creating new CSS variables the existing ones are reused, but assigned to new values within a new CSS class.

On top of this, vanilla-extract knows the type of the existing theme contract and requires you implement it completely and correctly.

After processing the updated file, the resulting compiled JS will look something like this:

```js
// theme.js
// Example result of the compiled JS
import './theme.css';

export const vars = {
  color: {
    brand: 'var(--color-brand__l520oi1)'
  },
  font: {
    body: 'var(--font-body__l520oi2)'
  }
};

export const themeClass = 'theme_themeClass__l520oi0';

export const otherThemeClass =
  'theme_otherThemeClass__l520oi3';
```

As can be observed, the only addition here is the reference to the new theme class name.

## Code Splitting Themes

While [createTheme] makes getting started with a theme really easy, it has some trade-offs.
It couples the definition of our theme contract to a specific theme implementation.
It also means all your alternative themes must import the original theme to access the theme contract.
This causes you to unintentionally import the original theme's CSS as well, making it impossible to CSS code-split your themes.

This is where [createThemeContract] comes in. Remember before when we said themes comprise of a theme contract and a CSS class implementing the theme? Well [createThemeContract] lets us define the contract without generating any CSS!

Implementing the above scenario with [createThemeContract] would look something like the following:

```ts compiled
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

Based on this contract individual themes can now be created. Each theme will need to populate the contract in its entirety.

```ts compiled
// blueTheme.css.ts
import { createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css.ts';

export const blueThemeClass = createTheme(vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

// redTheme.css.ts
import { createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css.ts';

export const redThemeClass = createTheme(vars, {
  color: {
    brand: 'red'
  },
  font: {
    body: 'helvetica'
  }
});

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

> 🧠&nbsp;&nbsp;When creating a theme contract, the values of the input are ignored so you can pass an empty string, null, or real values. Whatever makes sense to you.

Now we have two themes implementing the same contract, but importing either one will only import their respective CSS!

## Dynamic Theming

Sometimes theme values aren't known until runtime.
Theme contracts are a perfect fit for this situation as they are just collections of CSS variables.
This means they can easily be set as inline styles while still retaining type safety.

We can use the [assignInlineVars] API from the [tiny] `@vanilla-extract/dynamic` package to apply our theme contract at runtime.

> This example uses React, but [assignInlineVars] will work with any framework or vanilla JS.

```ts compiled
// app.tsx
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { container, themeVars } from './theme.css.ts';

interface ContainerProps {
  brandColor: string;
  fontFamily: string;
}
const Container = ({
  brandColor,
  fontFamily
}: ContainerProps) => (
  <section
    className={container}
    style={assignInlineVars(themeVars, {
      color: { brand: brandColor },
      font: { body: fontFamily }
    })}
  >
    ...
  </section>
);

const App = () => (
  <Container brand="pink" body="Arial">
    ...
  </Container>
);

// theme.css.ts
import {
  createThemeContract,
  style
} from '@vanilla-extract/css';

export const themeVars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

export const container = style({
  background: themeVars.color.brand,
  fontFamily: themeVars.font.body
});
```

This pattern opens up a lot of interesting possibilities. Type-safe runtime theming without the need for runtime creation and injection of CSS.

[createtheme]: /documentation/api/create-theme/
[createthemecontract]: /documentation/api/create-theme/
[assigninlinevars]: /documentation/packages/dynamic/#assigninlinevars
[createvar]: /documentation/api/create-var
[tiny]: https://bundlephobia.com/package/@vanilla-extract/dynamic
