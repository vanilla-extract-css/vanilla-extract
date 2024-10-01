---
"@vanilla-extract/css": minor
---

Add `createViewTransition` API

`createViewTransition` creates a single scoped view transition name for use with CSS View Transitions. This avoids potential naming collisions with other view transitions.

```ts
import {
  style,
  createViewTransition
} from '@vanilla-extract/css';

export const titleViewTransition = createViewTransition();

export const pageTitle = style({
  viewTransitionName: titleViewTransition
});
``
