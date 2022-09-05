---
title: createContainer
parent: api
---

# createContainer

Creates a single scoped container name for use with [CSS Container Queries]. This avoids potential naming collisions with other containers.

> 🚧 Ensure your target browsers [support container queries].
> Vanilla-extract supports the [container query syntax][css container queries] but does not polyfill the feature in unsupported browsers.

```ts compiled
// sidebar.css.ts
import {
  style,
  createContainer
} from '@vanilla-extract/css';

export const sidebarContainer = createContainer();

export const sidebar = style({
  containerName: sidebarContainer
});

// navigation.css.ts
import {
  style,
  createContainer
} from '@vanilla-extract/css';
import { sidebarContainer } from './sidebar.css.ts';

export const navigation = style({
  '@container': {
    [`${sidebarContainer} (min-width: 400px)`]: {
      display: 'flex'
    }
  }
});
```

[css container queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries
[support container queries]: https://caniuse.com/css-container-queries
