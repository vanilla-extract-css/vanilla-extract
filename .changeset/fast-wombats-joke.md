---
'@vanilla-extract/dynamic': minor
---

`assignInlineVars` now accepts `null` and `undefined` values

Variables with a value of `null` or `undefined` will be omitted from the resulting inline style.

**NOTE:** This only applies to the case where a theme contract is not provided.

```tsx
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  container,
  brandColor,
  textColor
} from './styles.css.ts';

// If `tone` is `undefined`, the following inline style becomes:
// { '--brandColor__8uideo0': 'pink' }

const MyComponent = ({ tone }: { tone?: critical }) => (
  <section
    className={container}
    style={assignInlineVars({
      [brandColor]: 'pink',
      [textColor]: tone === 'critical' ? 'red' : null
    })}
  >
    ...
  </section>
);
```
