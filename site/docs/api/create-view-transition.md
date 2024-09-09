---
title: createViewTransition
parent: api
---

# createViewTransition

Creates a single scoped view transition name for use with [CSS View Transitions].
This avoids potential naming collisions with other view transitions.

> 🚧&nbsp;&nbsp;Ensure your target browsers [support view transitions].
> Vanilla-extract supports the [view transition syntax][css view transition] but does not polyfill the feature in unsupported browsers.

```ts compiled
// itemPage.css.ts
import {
  style,
  createViewTransition
} from '@vanilla-extract/css';

export const titleViewTransition = createViewTransition();

export const pageTitle = style({
  viewTransitionName: titleViewTransition
});

// navigation.css.ts
import { style } from '@vanilla-extract/css';
import { titleViewTransition } from './itemPage.css.ts';

export const navigationLinkTitle = style({
  viewTransitionName: titleViewTransition
});
```

[css view transitions]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#css_additions
[support view transitions]: https://caniuse.com/view-transitions
