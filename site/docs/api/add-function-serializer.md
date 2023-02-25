---
title: addFunctionSerializer
parent: api
---

# addFunctionSerializer

> ✋&nbsp;&nbsp;This is an advanced feature recommended for library authors only.

Typically, if you try to export a function from one of your stylesheets, you'll get an error that you can only export plain objects, arrays, strings, numbers and `null`/`undefined`.

If you're wanting to create higher level abstractions like [Sprinkles](../../packages/sprinkles) or [Recipes](../../packages/recipes), this is a big problem!

To address this limitation, the `addFunctionSerializer` utility allows you to annotate your functions with instructions on how to serialize them.

As a basic example, let's say we want to create a library called `my-awesome-styled-div` that lets you create a React component that renders a `<div>` with static CSS bound to it, and we want our consumers to use it in their `.css.ts` files like this:

```ts
// MyComponent.css.ts

import { styledDiv } from 'my-awesome-styled-div';

export const MyComponent = styledDiv({
  background: 'blue',
  padding: 12
});
```

Normally if you tried to do this, since `MyComponent` is a function, it would trigger an error during the build since it can't be serialized.

Luckily `addFunctionSerializer` can help us!

To understand how we could make this API work, we'll first look at what you might expect the implementation of `styledDiv` to look like.

```tsx
// index.css.tsx

import React from 'react';
import { style } from '@vanilla-extract/css';

export function styledDiv(styles) {
  const className = style(styles);

  return function Component(
    props: React.ComponentProps<'div'>
  ) {
    return (
      <div
        {...props}
        className={[props.className, className]
          .filter(Boolean)
          .join(' ')}
      />
    );
  };
}
```

This is a pretty simple implementation, but it has a couple of major problems that prevent it from working. Firstly, there's no way to convert this function to a string so it can be added to your runtime JavaScript bundle. Secondly, even if it could be serialized somehow, it relies on `@vanilla-extract/css` which can't generate static CSS files at runtime.

To fix this, we need to start by splitting the runtime code out into its own module and avoid using `@vanilla-extract/css`. In this case we'll create a `runtime.tsx` file. It must be available as a separate entry point from the library so that it can be imported within runtime code, for example:

```tsx
import { runtimeStyledDiv } from 'my-awesome-styled-div/runtime';
```

The runtime implementation would look like this:

```tsx
// runtime.tsx

import React from 'react';

export function runtimeStyledDiv(className) {
  return function Component(
    props: React.ComponentProps<'div'>
  ) {
    return (
      <div
        {...props}
        className={[props.className, className]
          .filter(Boolean)
          .join(' ')}
      />
    );
  };
}
```

To make this work at runtime, we've had to alter the API a bit. Instead of accepting an object of styles, we now accept the generated class name. That's because this code will run in the end-user's browser where we no longer have the ability to generate static CSS.

We then need to annotate the generated component within `styledDiv` using `addFunctionSerializer`, providing the path to the runtime module, the name of the imported function, and the arguments that should be passed to it.

> ✋&nbsp;&nbsp;All arguments passed to the runtime function must be serializable!

```ts
// index.css.ts

import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { style } from '@vanilla-extract/css';
import { runtimeStyledDiv } from './runtime';

export function styledDiv(styles) {
  const className = style(styles);
  const args = [className];

  // First we call our runtime function at build time
  const Component = runtimeStyledDiv(...args);

  // Then we tell vanilla-extract how to serialize the previous
  // function call by annotating its return value
  addFunctionSerializer(Component, {
    importPath: 'my-awesome-styled-div/runtime',
    importName: 'runtimeStyledDiv',
    args
  });

  // Return the result of calling the runtime function
  return Component;
}
```

It takes a little bit of wiring to get this working, but thankfully our consumers don't need to know about any of this! By making use of `addFunctionSerializer`, we can now break free of the usual constraints around exports and provide much more expressive APIs to our library consumers.
