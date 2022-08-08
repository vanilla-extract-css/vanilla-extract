---
title: style
---

# style

Creates a style rule with a locally scoped class name.

> 🖌&nbsp;&nbsp;New to styling with vanilla-extract? Make sure you’ve read the [styling overview](/documentation/style-object) first.

This class can then be imported directly into your consuming application code, creating a first-class contract between your CSS and JavaScript.

```ts compiled
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const flexContainer = style({
  display: 'flex'
});

// app.ts
import { flexContainer } from './styles.css.ts';

document.write(`
  <main class="${flexContainer}">
    ...
  </main>
`);
```

CSS Variables, simple pseudos, selectors and media/feature queries are all supported.

```ts compiled
// styles.css.ts

import { style, createVar } from '@vanilla-extract/css';

const scopedVar = createVar();

export const className = style({
  display: 'flex',
  vars: {
    [scopedVar]: 'green',
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

## Style composition

The `style` function allows you to pass an array of class names and/or style objects but continue to treat them as if they are a single class name.

> ✨&nbsp;&nbsp;Curious about style composition? Make sure you’ve read the [style composition overview](/documentation/style-composition) first.

```ts compiled
// styles.css.ts
import { style } from '@vanilla-extract/css';

const base = style({ padding: 12 });

const primary = style([base, { background: 'blue' }]);
```

## Style merging

When passing an array of style objects they will be deep merged into a single class. This is useful when creating utilities to help construct consistent styles.

```ts compiled
// styles.css.ts
import { style } from '@vanilla-extract/css';

const responsiveStyle = ({ tablet, desktop }) => ({
  '@media': {
    'screen and (min-width: 768px)': tablet,
    'screen and (min-width: 1024px)': desktop
  }
});

const container = style([
  {
    display: 'flex',
    flexDirection: 'column'
  },
  responsiveStyle({
    tablet: { flex: 1, content: 'I will be overridden' },
    desktop: { flexDirection: 'row' }
  }),
  {
    '@media': {
      'screen and (min-width: 768px)': {
        content: 'I win!'
      }
    }
  }
]);
```
