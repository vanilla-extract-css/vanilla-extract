# Vanilla Extract Macros

This document outlines Vanilla Extract Macros, a proposed feature the Vanilla Extract team has been developing to attempt to make the VE developer experience more streamlined and better at rapid prototyping.

The main goal of Macros is to allow authoring of styles within regular TypeScript files. Unlocking the possibility of co-locating your styles with your components and removing the need for the `.css.ts` extension.

**Note:** While we're really excited to share this new feature idea with users and receive feedback, it is still very experimental. It's possible we will choose not to ship it at all if we feel it's not performing as we imagined it would.

## What are macros?

Macros are special functions, always ending in a `$` (e.g. `style$`), that flag to the VE compiler that a file contains styling logic that should be extracted.
You can think of the `.css.ts` extension as a way of declaring to Vanilla Extract which of your **files** should be executed at build-time.
Macros are instead a way to declare which **functions** should be executed at build-time.

> **Why suffix with a `$`?**
>
> Macros are executed in a different context (build-time vs run-time) to the rest of your code.
> Because of this, we wanted Macros to use an easy to spot convention that helps developers quickly identify them.
> Also, as this idea is very similar to that of server functions (i.e. [Solid Start](https://start.solidjs.com/api/server), [Bling](https://github.com/TanStack/bling#macros)) we decided to adopt a similar convention. Only a pre-configured set of functions are treated as macros, just because a function name ends with `$` does not automatically make it a VE macro.

Here's an example file making use of Macros:

```jsx
// Button.tsx
import { style$ } from '@vanilla-extract/css';

const red = style$({
  color: 'red'
});

export const Button = () => <button className={red} />;
```

When VE see's the use of one of it macros, it knows to pass the files through it's transform and split it into a build-time and run-time version.
After being processed, the run-time version of this file would look something like the following:

```jsx
// Button.tsx (compiled output)
import './button.vanilla.css';

const red = 'red_button_[hash]';

export const Button = () => <button className={red} />;
```

Almost all of the current VE API have macro variations, allowing their use outside of `.css.ts` files.

### extract$

There is also a new API called `extract$` for executing arbitrary styling logic at build time.
The `extract$` macro acts as signal to VE to execute the code that's passed to it's parameter.
This allows you to extract more complex styling logic out of your runtime code.

```jsx
// Colors.tsx
import { extract$, style } from '@vanilla-extract/css';

const colors = extract$(
  ['red', 'blue', 'green'].map((color) =>
    style({
      background: color
    })
  )
);

export const Colors = () => (
  <>
    {colors.map((color) => (
      <div className={color} />
    ))}
  </>
);
```

You can also pass a function to `extract$` and VE will execute it for you.
This is useful when you want to create variables in your build-time styleing logic.

```jsx
// Colors.tsx
import {
  extract$,
  styleVariants
} from '@vanilla-extract/css';
import { darken } from 'polished';

const darkColors = extract$(() => {
  const colors = {
    red: '#FF0000',
    blue: '#00FFFF',
    green: '#00FF00'
  };

  return styleVariants(colors, (color) => ({
    color: darken(0.3, color)
  }));
});
```

### Why have macro and non-macro APIs?

It may seem confusing to have both macro and non-macro variations of each API (this is definitely a concern held by the team), why not just target the VE compiler at the regular API?
The reason is they mean different things from a semantic perspective.
Unlike regular function calls, macros are hoisted to the top-level of the file. Therefore they can only utilize variables from the top-level scope of the file.
I like to think of this as executing the functions inline.

Take a look at the following example:

```jsx
// Colors.tsx
import { style$, style } from '@vanilla-extract/css';

const colors = ['red', 'blue', 'green'];

// No macro (style) inside the `extract$` macro
const one = extract$(
  colors.map((color) =>
    style({
      background: color
    })
  )
);

// With macro (style$)
const two = colors.map((color) =>
  style$({
    background: color
  })
);
```

Before understanding macros you would think that `one` and `two` would work the same way.
However as macros are hoisted, the macro variation won't work as it can't access the values from it's original scope.
The below example shows the code that VE would execute at build-time.

```jsx
// Colors.tsx
import { style$, style } from '@vanilla-extract/css';

const colors = ['red', 'blue', 'green'];

// No macro (style) inside the `extract$` macro
const __hoistedCall1 = extract$(
  colors.map((color) =>
    style({
      background: color
    })
  )
);

const one = __hoistedCall1;

const __hoistedCall2 = style$({
  // color isn't available here
  background: color
});

// With macro (style$)
const two = colors.map((color) => __hoistedCall);
```

This may seem confusing at first but it enables some interesting patterns like inline style creation.

```jsx
// Colors.tsx
import { style$ } from '@vanilla-extract/css';

export const Button = () => (
  <div className={style$({ color: 'red' })} />
);
```

### Can I use macros to pass props to styles?

No. Macros are hoisted and styles are generated statically so they won’t have access to runtime props.

```jsx
// Colors.tsx
import { style$ } from '@vanilla-extract/css';

export const Button = ({ color }) => (
  // ERROR: Can not access `color` at build-time
  <div className={style$({ color })} />
);
```

If you want to create dynamic styling behaviour you'll still want to use normal VE approaches. e.g. [styleVariants](https://vanilla-extract.style/documentation/api/style-variants/) or the [dynamic API](https://vanilla-extract.style/documentation/packages/dynamic/).

### Global side effects

While macros can be used in almost all files, they can't be used alongside global side effects called at the top-level scope of the file. e.g. `document.createElement`.

```jsx
// html.tsx
import { style$ } from '@vanilla-extract/css';

// This will fail to compile...
const red = style$({ color: 'red' });

document.innerHTML = `<div class="${red}">`;
```

If you need to use side effects in the top-level scope of a file you'll need to separate out any VE code into a separate file.

We're eager to hear feedback from the community about whether this model is too confusing or complicated.
Our hope is once the inital concept is understood, it unlocks a faster way to developer apps while still being able to write real type-safe code for your styling.

## What does this means for `.css.ts` files

In short, nothing.

We have no plans on removing support for `.css.ts` files at this stage.
It often makes sense to split your styling logic out into a separate file and we feel `.css.ts` files are still a great way of doing this.
Their behaviour hasn't changed, however macros should _not_ be used inside `.css.ts` files.

## Recipes

Where macros get really exciting is the ability to use them as higher level APIs.
A great example here is the macro variation of the Recipes API.
Being able to keep components and your style definitions in the same file unlocks rapid prototyping that VE hasn't achieved before.

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

And while the existing recipes API is framework agnostic, there's nothing stopping you from creating framework specific APIs.
I'm looking at you styled-component fans out there 😉

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

This leads to one of our favourite features.
As macros are expressed via a convention (e.g. ending the function name with `$`) we're providing a way for you to create your own VE macros.
To create a custom macro, first create a function somewhere in your project.

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

The `macros` key tells the VE compiler to treat all calls to `box$` within this project as a VE macro and be extracted at build-time.
The config is driven by the closest `package.json` to the file, this enables package authors to create and share VE macros on NPM!
Macros are also completely compatible with VE's existing [function serialization](https://vanilla-extract.style/documentation/api/add-function-serializer/) system.
If you ever wanted to implement your own CSS-in-JS interface like [styled-components](https://styled-components.com/) or [stitches](https://stitches.dev/) you can do this using VE macros.

## Try it out

If you're keen to give macros a spin we encourage you to try out the experimental implementation yourself.
To get started in an existing project, update the `@vanilla-extract/css` package and your integration of choice to the `experimental-macros` tag on NPM.
Macros are currenly working for the `Vite`, `Webpack` and `esbuild` plugins.

```json
{
  "dependencies": {
    "@vanilla-extract/css": "0.0.0-experimental-macros-2023326232811",
    // You only need the relevant integration to your project
    "@vanilla-extract/webpack-plugin": "0.0.0-experimental-macros-2023326232811",
    "@vanilla-extract/vite-plugin": "0.0.0-experimental-macros-2023326232811",
    "@vanilla-extract/esbuild-plugin": "0.0.0-experimental-macros-2023326232811"
  }
}
```

Or if you want to try-out Macros in a fresh project, you can fork our [macros starter repo](https://github.com/vanilla-extract-css/macros-playground) that already has Vite and Macros setup.

### Feedback

It's very likely you'll run into issues as it's still early.
If you do, we'd really appreciate you posting details of the issues (bonus points for a reproduction repo) in our discord.
We have a channel dedicated to the macros discussion and feedback.

Outside of any issues you run into, we'd also really appreciate community feedback on the following:

- Are Macros confusing?
- If released, would you use Macros?
- Do you understand which code is run at build-time vs in the browser?
- Are you seeing any drop in build time performance?
- Should the core VE Macros be in a separate package? (e.g. `@vanilla-extract/macros`)
