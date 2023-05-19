# Vanilla Extract Macros

This document outlines Vanilla Extract Macros, a proposed feature the Vanilla Extract team has been developing to attempt to make the VE developer experience more streamlined and better at rapid prototyping.

The main goal of Macros is to allow authoring of styles within regular TypeScript files. Unlocking the possibility of co-locating your styles with your components and removing the need for the `.css.ts` extension.

**Note:** While we're really excited to share this new feature idea with users and receive feedback, it is still very experimental. It's possible we will choose not to ship it at all if we feel it's not performing as we imagined it would.

## What are macros?

Macros are special functions, always ending in a `$` (e.g. `style$`), that flag to the VE compiler that a file contains styling logic that should be extracted. You can think of the `.css.ts` extension as a way of declaring to Vanilla Extract which of your **files** should be executed at build-time. Macros are instead a way to declare which **functions** should be executed at build-time.

Here's an example file making use of Macros:

```tsx
// Button.tsx
import { style$ } from '@vanilla-extract/css';

const red = style$({
  color: 'red'
});

export const Button = () => <button className={red} />;
```

When VE see's the use of one of it macros, it knows to pass the files through it's transform and split it into a build-time and run-time version. After being processed, the run-time version of this file would look something like the following:

```tsx
// Button.tsx (compiled output)
import './button.vanilla.css';

const red = 'red_button_[hash]';

export const Button = () => <button className={red} />;
```

Almost all of the current VE API have macro variations, allowing their use outside of `.css.ts` files. There is also a new API called `extract$` for executing arbitrary styling logic at build time.

```jsx
// Colors.tsx
import { extract$, style } from '@vanilla-extract/css';

const colors = extract$(['red', 'blue', 'green'].map(color => style({
  background: color
}))

export const Colors = () => <>
  {colors.map(color => <div className={color} />)}
</>
```

### Why have macro and non-macro APIs?

It may seem confusing to have both macro and non-macro variations of each API (this is definitely a concern held by the team), why not just target the VE compiler at the regular API? The reason is they mean different things from a semantic perspective. Unlike regular function calls, macros are hoisted to the top-level of the file. Therefore they can only utilize variables from the top-level scope of the file. I like to think of this as executing the functions inline.

Take a look at the following example:

```jsx
// Colors.tsx
import { style$, style } from '@vanilla-extract/css';

const colors = ['red', 'blue', 'green'];

// No macro (style)
const one = extract$(colors.map(color => style({
  background: color
}))

// With macro (style$)
const two = extract$(colors.map(color => style$({
  background: color
}))
```

Before understanding macros you would think that `one` and `two` would work the same way. However as macros are hoisted, the macro variation won't work as it can't access the values from it's original scope. The below example shows the code that VE would execute at build-time.

```jsx
// Colors.tsx
import { style$, style } from '@vanilla-extract/css';

const colors = ['red', 'blue', 'green'];

// No macro (style)
const one = extract$(colors.map(color => style({
  background: color
}))

const __hoistedCall = style$({
  // color isn't available here
  background: color
})

// With macro (style$)
const two = extract$(colors.map(color => __hoistedCall)
```

This may seem confusing at first but it enables some interesting patterns like inline style creation.

```jsx
// Colors.tsx
import { style$ } from '@vanilla-extract/css';

export const Button = () => (
  <div className={style$({ color: 'red' })} />
);
```

We're eager to hear feedback from the community about whether this model is too confusing or complicated. Our hope is once the inital concept is understood, it unlocks a faster way to developer apps while still being able to write real type-safe code for your styling.

## Recipes

Where macros get really exciting is the ability to use them as higher level APIs. A great example here is the macro variation of the Recipes API. Being able to keep components and your style definitions in the same file unlocks rapid prototyping that VE hasn't achieved before.

```jsx
import { recipe$ } from '@vanilla-extract/recipes';

const buttonStyles = recipe$({
  base: {
    background: 'black',
    color: 'white'
  },
  variants: {
    size: {
      small: { fontSize: 12 },
      medium: { fontSize: 16 },
      large: { fontSize: 32 }
    }
  }
});

export const Button = ({ size }) => (
  <button className={buttonStyles({ size })} />
);
```

And while the existing recipes API is framework agnostic, there's nothing stopping you from creating framework specific APIs. I'm looking at you styled-component fans out there 😉

```jsx
// Just an example, this API doesn't actually exist
import { recipe$ } from '@vanilla-extract/recipes-react';

const Button = recipe$({
  base: {
    background: 'black',
    color: 'white'
  },
  variants: {
    size: {
      small: { fontSize: 12 },
      medium: { fontSize: 16 },
      large: { fontSize: 32 }
    }
  }
});

export const App = () => <Button size="medium" />;
```

## Custom Macros

This leads to one of our favourite features. As macros are expressed via a convention (e.g. ending the function name with `$`) we're providing a way for you to create your own VE macros. To create a custom macro, first create a function somewhere in your project.

```jsx
import { style } from '@vanilla-extract/css';

// Function name must end with a $
export function box$({ size, color }) {
  return style({
    background: color,
    height: size,
    width: size
  });
}
```

Then inside your projects `package.json` add the following config:

```json
{
  "vanilla-extract": {
    "macros": ["box$"]
  }
}
```

The `macros` key tells the VE compiler to treat all calls to `box$` within this project as a VE macro and be extracted at build-time. The config is driven by the closest `package.json` to the file, this enables package authors to create and share VE macros on NPM! Macros are also completely compatible with VE's existing [function serialization](https://vanilla-extract.style/documentation/api/add-function-serializer/) system. If you ever wanted to implement your own CSS-in-JS interface like [styled-components](https://styled-components.com/) or [stitches](https://stitches.dev/) you can do this using VE macros.

## Try it out

If you're keen to give macros a spin we encourage you to try out the experimental implementation yourself. To get started you just need to point your VE deps to the `inline-prototype` tag on NPM.

```json
{
  "dependencies": {
    "@vanilla-extract/css": "0.0.0-inline-prototype-2023326232811",
    "@vanilla-extract/webpack-plugin": "0.0.0-inline-prototype-2023326232811"
  }
}
```

It's very likely you'll run into issues as it's still early. If you do, we'd really appreciate you posting details of the issues (bonus points for a reproduction repo) in our discord. We have a channel dedicated to the macros discussion and feedback.

## Risks

TODO: Thought it'd be good to have a section around what our current concerns are. Not sure.

- Confusing to use
- Build time cost
