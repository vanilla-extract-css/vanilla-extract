---
title: Style object
---

# Style object

The style object is the core API for describing styles in vanilla-extract.
All the styling APIs take this object as input, some just have a slightly stripped down version with less features. Those limitations are documented alongside their respective APIs.

Describing styles in tÁhis way enables much better use of TypeScipt through your styling code, as the styles are just typed data-structures like the rest of your application code.
It also brings type-safety and autocomplete to CSS authoring (via [csstype](https://github.com/frenic/csstype)).

## Basic properties

At the top-level of the object, all basic CSS properties can be set just like when writing a regular CSS class.
The only difference is all properties use `camelCase` rather than `kebab-case`.

```ts
// dawg.css.ts
import { style, globalStyle } from '@vanilla-extract/css';

const myStyleDefinition = {
  display: 'flex',
  paddingTop: '3px'
} as const;

// Use with the `style` API
const myStyle = style(myStyleDefinition);

// Or with the `globalStyle` API
globalStyle('body', myStyleDefinition);
```

## CSS Variables

In regular CSS, variables (or CSS custom properties) are able to be set alongside the other properties within the rule. In vanilla-extract CSS variables must be nested within the `vars` key — providing more accurate static typing for the rest of the style object.

```ts
// styles.css.ts
import { style } from '@vanilla-extract/css';

const myStyle = style({
  vars: {
    '--my-global-variable': 'purple'
  }
});
```

The `vars` key also accepts scoped CSS variables, created via the [createVar](/documentation/create-var/) API.

```ts
// styles.css.ts
import { style, createVar } from '@vanilla-extract/css';

const myVar = createVar();

const myStyle = style({
  vars: {
    [myVar]: 'purple'
  }
});
```

## Simple pseudo selectors

Simple pseudo selectors are those that don’t take any parameters and therefore can be easily detected and statically typed.

> Not available for global style APIs

<foo />

```ts
// styles.css.ts
import { style } from '@vanilla-extract/css';

const myStyle = style({
  ':hover': {
    color: 'red'
  },
  ':first-of-type': {
    vars: {
      '--my-variable': 'black'
    }
  }
});
```

The style object for simple pseudo selectors can only contain [Basic Properties](#basic-properties) and [CSS Variables](#css-variables).

## Media queries

Unlike in regular CSS, vanilla-extract let’s you embed media queries **within** your style defintions using the `@media` key.
This allows you to easily co-locate the responsive rules of a style into a single data-structure.

```ts
// styles.css.ts
import { style } from '@vanilla-extract/css';

const myStyle = style({
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 10
    },
    '(prefers-reduced-motion)': {
      transitionProperty: 'color'
    }
  }
});
```

When processing your code into CSS, vanilla-extract will always render your media queries **at the end of the file**. This means styles inside the `@media` key will always have higher precedence than other styles due to CSS rule order precedence.

> When it's safe to do so, vanilla-extract will merge your @media (and @supports) condition blocks together to create the smallest possible CSS output.

## Supports queries

Supports queries work the same as [Media queries](#media-queries) and are nested inside the `@supports` key.

```ts
// styles.css.ts
import { style } from '@vanilla-extract/css';

const myStyle = style({
  '@supports': {
    '(display: grid)': {
      display: 'grid'
    }
  }
});
```

## Selectors

More complex rules can be written within the `selectors` key.

> Not available for global style APIs

The class name for the current style block can be included within the selector using the `&` character.

```ts
// styles.css.ts
import { style } from '@vanilla-extract/css';

const myStyle = style({
  selectors: {
    '&:not(:first-child)': {
      display: 'block'
    }
  }
});
```

Selectors can also contain references to other scoped class names.

```ts
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

### Targetting single elements

To improve maintainability, each style block can only target a single element. To enforce this, all selectors must target the “&” character which is a reference to the current element.

For example, `'&:hover:not(:active)'` and `` [`${parentClass} &`] `` are considered valid, while `'& a[href]'` and `` [`& ${childClass}`] `` are not.

If you want to target another scoped class then it should be defined within the style block of that class instead.

For example, `` [`& ${childClass}`] `` is invalid since it doesn’t target “&”, so it should instead be defined in the style block for `childClass`.

If you want to globally target child nodes within the current element (e.g. `'& a[href]'`), you should use [`globalStyle`](#globalstyle) instead.

## Fallback styles

When using CSS property values that don't exist in some browsers, you'll often declare the property twice and the older browser will ignore the value it doesn't understand.
This isn't possible using JS objects as you can't declare the same key twice.
So instead, we use an array to define fallback values.

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const myStyle = style({
  // in Firefox and IE the "overflow: overlay" will be ignored and the "overflow: auto" will be applied
  overflow: ['auto', 'overlay']
});
```

## Vendor prefixes

If you want to target a vendor specific property (e.g. `-webkit-tap-highlight-color`), you can do so using `PascalCase` and removing the beginning `-`.

```ts
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const myStyle = style({
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
});
```
