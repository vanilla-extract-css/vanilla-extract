---
title: Getting started
parent: sprinkles
---

# Introduction

Generate a static set of custom utility classes and compose them either statically at build time, or dynamically at runtime, without the usual style generation overhead of CSS-in-JS.

Basically, it’s like building your own zero-runtime, type-safe version of [Tailwind](https://tailwindcss.com), [Styled System](https://styled-system.com), etc.

**Compose sprinkles statically at build time.**

```ts
// styles.css.ts

export const className = sprinkles({
  display: 'flex',
  paddingX: 'small',
  flexDirection: {
    mobile: 'column',
    desktop: 'row'
  },
  background: {
    lightMode: 'blue-50',
    darkMode: 'gray-700'
  }
});
```

**Or compose them dynamically at runtime! 🏃‍♂️**

```ts
// app.ts

import { sprinkles } from './sprinkles.css.ts';

const flexDirection =
  Math.random() > 0.5 ? 'column' : 'row';

document.write(`
  <section class="${sprinkles({
    display: 'flex',
    flexDirection
  })}">
    ...
  </section>
`);
```

> 🖥 &nbsp; [Try it out for yourself in CodeSandbox.](https://codesandbox.io/s/github/seek-oss/vanilla-extract/tree/master/examples/webpack-react?file=/src/sprinkles.css.ts)

## Setup

> 💡 Before starting, ensure you've set up [vanilla-extract.](/documentation/setup)

Install Sprinkles.

```bash
$ npm install @vanilla-extract/sprinkles
```

Create a `sprinkles.css.ts` file, then configure and export your `sprinkles` function.

> 💡 This is just an example! Feel free to customise properties, values and conditions to match your requirements.

```ts
// sprinkles.css.ts
import {
  defineProperties,
  createSprinkles
} from '@vanilla-extract/sprinkles';

const space = {
  none: 0,
  small: '4px',
  medium: '8px',
  large: '16px'
  // etc.
};

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' }
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'flex', 'block', 'inline'],
    flexDirection: ['row', 'column'],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between'
    ],
    alignItems: [
      'stretch',
      'flex-start',
      'center',
      'flex-end'
    ],
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space
    // etc.
  },
  shorthands: {
    padding: [
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight'
    ],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    placeItems: ['justifyContent', 'alignItems']
  }
});

const colors = {
  'blue-50': '#eff6ff',
  'blue-100': '#dbeafe',
  'blue-200': '#bfdbfe',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827'
  // etc.
};

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { '@media': '(prefers-color-scheme: dark)' }
  },
  defaultCondition: 'lightMode',
  properties: {
    color: colors,
    background: colors
    // etc.
  }
});

export const sprinkles = createSprinkles(
  responsiveProperties,
  colorProperties
);

// It's a good idea to export the Sprinkles type too
export type Sprinkles = Parameters<typeof sprinkles>[0];
```

**🎉 That's it — you’re ready to go!**
