---
'@vanilla-extract/css': minor
---

Add `createContainer` API

`createContainer` creates a single scoped container for use with CSS Container Queries. This avoids potential naming collisions with other containers.

```ts
import {
  style,
  createContainer
} from '@vanilla-extract/css';

export const sidebarContainer = createContainer();

export const sidebar = style({
  containerName: sidebarContainer
});

export const navigation = style({
  '@container': {
    [`${sidebarContainer} (min-width: 400px)`]: {
      display: 'flex'
    }
  }
});
```