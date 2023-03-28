---
'@vanilla-extract/css': minor
---

Add support for [cascade layers, i.e. `@layer`][cascade layers].

Create a scoped [layer] to avoid naming collisions, or with an explicit name using [globalLayer]. Styles can then be assigned to layers using the `@layer` key within your style definition.

```tsx
// layers.css.ts
import { layer } from '@vanilla-extract/css';

export const reset = layer('reset');
export const framework = layer('framework');
export const typography = layer('typography');

// typography.css.ts
import { style } from '@vanilla-extract/css';
import { typography } from './layers.css';

export const standard = style({
  '@layer': {
    [typography]: {
      fontSize: '1rem'
    }
  }
});
```
[cascade layers]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
[layer]: https://vanilla-extract.style/documentation/api/layer
[globalLayer]: https://vanilla-extract.style/documentation/global-api/global-layer
