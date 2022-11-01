---
title: Styling
---

# Styling

All the styling APIs in vanilla-extract take a style object as input.
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
In vanilla-extract CSS variables must be nested within the `vars` key — providing more accurate static typing for the other CSS properties.

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

Unlike in regular CSS, vanilla-extract lets you embed media queries **within** your style definitions using the `@media` key.
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

When processing your code into CSS, vanilla-extract will always render your media queries **at the end of the file**. This means styles inside the `@media` key will always have higher precedence than other styles due to CSS rule order precedence.

> 🧠&nbsp;&nbsp;When it's safe to do so, vanilla-extract will merge your `@media`, `@supports`, and `@container` condition blocks together to create the smallest possible CSS output.

## Layers

```ts compiled
// styles.css.ts
import {
  style,
  globalStyle,
  layer,
  globalLayer
} from '@vanilla-extract/css';

const unhashed = globalLayer('unhashed');
const resetLayer = layer('reset');
const baseLayer = layer('base');
const themeLayer = layer('theme');
const utilitiesLayer = layer('utilities');

const heading = style({
  '@layer': {
    [themeLayer]: {
      color: 'rebeccapurple'
    }
  }
});
globalStyle('*', {
  '@layer': {
    [resetLayer]: {
      margin: 0,
      padding: 0
    }
  }
});

// these will be hoisted
const some = layer();
const more = layer();
const layers = layer();
```

### Nesting

```ts compiled
// nesting.css.ts
import { style, layer } from '@vanilla-extract/css';

const baseLayer = layer();
const themeLayer = layer();

const list = style({
  '@layer': {
    [baseLayer]: {
      listStyle: 'none'
    }
  }
});
const text = style({
  '@layer': {
    [baseLayer]: {
      color: 'yellow',
      '@layer': {
        more_nesting: {
          color: 'magenta',
          textDecoration: 'underline'
        }
      },
      '@media': {
        'screen and (min-width: 200px)': {
          color: 'green'
        }
      }
    }
  }
});
const headingTheme = style({
  '@layer': {
    [themeLayer]: {
      color: 'rebeccapurple',
      '@layer': {
        apac: {
          color: '#0066ff'
        }
      }
    }
  }
});
const headingBase = style({
  '@layer': {
    [baseLayer]: {
      color: 'papayawhip'
    }
  }
});
```

### Merging

```ts compiled
// merging.css.ts
import { style, layer } from '@vanilla-extract/css';

const baseLayer = layer();
const themeLayer = layer();

const list = style({
  '@layer': {
    [baseLayer]: {
      listStyle: 'none'
    }
  }
});
const text = style({
  '@layer': {
    [baseLayer]: {
      color: 'yellow'
    }
  }
});
const headingTheme = style({
  '@layer': {
    [themeLayer]: {
      color: 'rebeccapurple'
    }
  }
});
const headingBase = style({
  '@layer': {
    [baseLayer]: {
      color: 'papayawhip'
    }
  }
});
```

### Advanced

```ts compiled
// advanced.css.ts
import {
  style,
  layer,
  globalLayer,
  commitLayers
} from '@vanilla-extract/css';

export const libLayer = globalLayer(
  { commit: false },
  'lib'
); // uses the provided name
export const utilitiesLayer = layer({
  parent: libLayer,
  commit: false
}); // creates a hashed name

const text = style({
  '@layer': {
    [libLayer]: {
      color: 'yellow'
    }
  }
});

// later, in my app...

const myStuff = layer(
  { parent: libLayer, commit: false },
  'myStuff'
);

const myText = style({
  '@layer': {
    [myStuff]: {
      color: 'purple'
    }
  }
});

// insert my new layer in between library layers
commitLayers([libLayer, myStuff, utilitiesLayer]);
```

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

## Container Queries

Container queries work the same as [media queries] and are nested inside the `@container` key.

> 🚧&nbsp;&nbsp;Ensure your target browsers [support container queries]. Vanilla-extract supports the [container query syntax] but does not polyfill the feature in unsupported browsers.

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
[createcontainer]: /documentation/api/create-container/
[css properties]: #css-properties
[css variables]: #css-variables
[globalstyle]: /documentation/global-api/global-style
[media queries]: #media-queries
[support container queries]: https://caniuse.com/css-container-queries
[container query syntax]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries
