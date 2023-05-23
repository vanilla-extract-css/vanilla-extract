---
title: Styling
---

# Styling

All the styling APIs in Vanilla Extract take a style object as input.
Describing styles as a JavaScript object enables much better use of TypeScript through your styling code, as the styles are typed data-structures like the rest of your application code.
It also brings type-safety and autocomplete to CSS authoring (via [csstype]).

## CSS Properties

At the top-level of the style object, CSS properties can be set just like when writing a regular CSS class.
The only difference is all properties use `camelCase` rather than `kebab-case`.

```ts compiled
// app.css.ts
import { style, globalStyle } from '@vanilla-extract/css';

export const myStyle = style({
  display: 'flex',
  paddingTop: '3px'
});

globalStyle('body', {
  margin: 0
});
```

### Unitless Properties

Some properties accept numbers as values. Excluding [unitless properties], these values are assumed to be a pixel and `px` is automatically appended to the value.

```ts compiled
// styles.css.ts
import { style } from '@vanilla-extract/css';

export const myStyle = style({
  // cast to pixels
  padding: 10,
  marginTop: 25,

  // unitless properties
  flexGrow: 1,
  opacity: 0.5
});
```

### Vendor Prefixes

If you want to target a vendor specific property (e.g. `-webkit-tap-highlight-color`), you can do so using `PascalCase` and removing the beginning `-`.

```ts compiled
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const myStyle = style({
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
});
```

## CSS Variables

In regular CSS, variables (or CSS custom properties) are able to be set alongside the other properties within the rule.
In Vanilla Extract, CSS variables must be nested within the `vars` key — providing more accurate static typing for the other CSS properties.

```ts compiled
// styles.css.ts
import { style } from '@vanilla-extract/css';

const myStyle = style({
  vars: {
    '--my-global-variable': 'purple'
  }
});
```

The `vars` key also accepts scoped CSS variables, created via the [createVar] API.

```ts compiled
// styles.css.ts
import { style, createVar } from '@vanilla-extract/css';

const myVar = createVar();

const myStyle = style({
  vars: {
    [myVar]: 'purple'
  }
});
```

## Media Queries

Unlike in regular CSS, Vanilla Extract lets you embed media queries **within** your style definitions using the `@media` key.
This allows you to easily co-locate the responsive rules of a style into a single data-structure.

```ts compiled
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

When processing your code into CSS, Vanilla Extract will always render your media queries **at the end of the file**. This means styles inside the `@media` key will always have higher precedence than other styles due to CSS rule order precedence.

> 🧠&nbsp;&nbsp;When it's safe to do so, Vanilla Extract will merge your `@media`, `@supports`, and `@container` condition blocks together to create the smallest possible CSS output.

## Selectors

There are two methods of specifying selectors for a given style, simple pseudo selectors that can be used alongside all other CSS properties, and the `selectors` option which allows construction of more complex rules.

> 🧠&nbsp;&nbsp;All selectors are not available for `globalStyle`. This API accepts a selector as its first parameter (e.g. `ul li:first-of-type, a > span`), merging selectors may produce unexpected results.

### Simple Pseudo Selectors

Simple pseudo selectors are those that don’t take any parameters and therefore can be easily detected and statically typed. These can be used at the top level alongside the other [CSS properties] and can only contain [CSS Properties] and [CSS Variables].

```ts compiled
// styles.css.ts
import { style } from '@vanilla-extract/css';

const myStyle = style({
  ':hover': {
    color: 'pink'
  },
  ':first-of-type': {
    color: 'blue'
  },
  '::before': {
    content: ''
  }
});
```

### Complex Selectors

More complex rules can be written using the `selectors` key.

To improve maintainability, each style block can only target a single element. To enforce this, all selectors must target the `&` character which is a reference to the current element.

```ts compiled
// styles.css.ts
import { style } from '@vanilla-extract/css';

const link = style({
  selectors: {
    '&:hover:not(:active)': {
      border: '2px solid aquamarine'
    },
    'nav li > &': {
      textDecoration: 'underline'
    }
  }
});
```

Selectors can also reference other scoped class names.

```ts compiled
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const parent = style({});

export const child = style({
  selectors: {
    [`${parent}:focus &`]: {
      background: '#fafafa'
    }
  }
});
```

Invalid selectors are those attempting to target an element other than the current class.

```ts
// styles.css.ts
import { style } from '@vanilla-extract/css';

const invalid = style({
  selectors: {
    // ❌ ERROR: Targetting `a[href]`
    '& a[href]': {...},

    // ❌ ERROR: Targetting `.otherClass`
    '& ~ div > .otherClass': {...}
  }
});
```

If you want to target another scoped class then it should be defined within the style block of that class instead.

```ts
// styles.css.ts
import { style } from '@vanilla-extract/css';

// Invalid example:
export const child = style({});
export const parent = style({
  selectors: {
    // ❌ ERROR: Targetting `child` from `parent`
    [`& ${child}`]: {...}
  }
});

// Valid example:
export const parent = style({});
export const child = style({
  selectors: {
    [`${parent} &`]: {...}
  }
});
```

If you need to globally target child nodes within the current element (e.g. `'& a[href]'`), you should use [globalStyle] instead.

```ts compiled
// styles.css.ts
import { style, globalStyle } from '@vanilla-extract/css';

export const parent = style({});

globalStyle(`${parent} a[href]`, {
  color: 'pink'
});
```

### Circular Selectors

If your selectors are dependent on each other you can use [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) to define them:

```ts compiled
// styles.css.ts
import { style } from '@vanilla-extract/css';

export const child = style({
  background: 'blue',
  get selectors() {
    return {
      [`${parent} &`]: {
        color: 'red'
      }
    };
  }
});

export const parent = style({
  background: 'yellow',
  selectors: {
    [`&:has(${child})`]: {
      padding: 10
    }
  }
});
```

## Container Queries

Container queries work the same as [media queries] and are nested inside the `@container` key.

> 🚧&nbsp;&nbsp;Ensure your target browsers [support container queries]. Vanilla Extract supports the [container query syntax] but does not polyfill the feature in unsupported browsers.

```ts compiled
// styles.css.ts
import { style } from '@vanilla-extract/css';

const myStyle = style({
  '@container': {
    '(min-width: 768px)': {
      padding: 10
    }
  }
});
```

You can also create scoped containers using [createContainer].

```ts compiled
// styles.css.ts
import {
  style,
  createContainer
} from '@vanilla-extract/css';

const sidebar = createContainer();

const myStyle = style({
  containerName: sidebar,
  '@container': {
    [`${sidebar} (min-width: 768px)`]: {
      padding: 10
    }
  }
});
```

## Layers

As with media queries above, Vanilla Extract lets you assign styles to [layers][layer] by using the `@layer` key **within** your style definition.

> 🚧&nbsp;&nbsp;Ensure your target browsers [support layers].
> Vanilla Extract supports the [layers syntax][layer] but does not polyfill the feature in unsupported browsers.

[layer]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
[support layers]: https://caniuse.com/css-cascade-layers

```ts compiled
// styles.css.ts
import { style } from '@vanilla-extract/css';

const text = style({
  '@layer': {
    typography: {
      fontSize: '1rem'
    }
  }
});
```

The `@layer` key also accepts a scoped layer reference, created via the [layer][layer api] API.

```ts compiled
// styles.css.ts
import { style, layer } from '@vanilla-extract/css';

const typography = layer();

const text = style({
  '@layer': {
    [typography]: {
      fontSize: '1rem'
    }
  }
});
```

To learn more about managing layers, check out the API documentation for [layer][layer api] and [globalLayer][global layer api].

## Supports Queries

Supports queries work the same as [Media queries] and are nested inside the `@supports` key.

```ts compiled
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

## Fallback Styles

When using CSS property values that don't exist in some browsers, you'll often declare the property twice and the older browser will ignore the value it doesn't understand.
This isn't possible using JS objects as you can't declare the same key twice.
So instead, we use an array to define fallback values.

```ts compiled
// styles.css.ts

import { style } from '@vanilla-extract/css';

export const myStyle = style({
  // In Firefox and IE the "overflow: overlay" will be
  // ignored and the "overflow: auto" will be applied
  overflow: ['auto', 'overlay']
});
```

[csstype]: https://github.com/frenic/csstype
[unitless properties]: https://github.com/vanilla-extract-css/vanilla-extract/blob/6068246343ceb58a04006f4ce9d9ff7ecc7a6c09/packages/css/src/transformCss.ts#L25
[createvar]: /documentation/api/create-var/
[layer api]: /documentation/api/layer/
[global layer api]: /documentation/global-api/global-layer/
[createcontainer]: /documentation/api/create-container/
[css properties]: #css-properties
[css variables]: #css-variables
[globalstyle]: /documentation/global-api/global-style
[media queries]: #media-queries
[support container queries]: https://caniuse.com/css-container-queries
[container query syntax]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries
