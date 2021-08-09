# @vanilla-extract/dynamic

## 2.0.0

### Major Changes

- [#276](https://github.com/seek-oss/vanilla-extract/pull/276) [`4bcbd6f`](https://github.com/seek-oss/vanilla-extract/commit/4bcbd6f4ac0170a09553ce8d44ca84361782cce5) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `assignInlineVars` and `setElementVars` functions

  **assignInlineVars**

  Assigns CSS Variables as inline styles.

  ```tsx
  // app.tsx

  import { assignInlineVars } from '@vanilla-extract/dynamic';
  import { vars } from './vars.css.ts';

  const MyComponent = () => (
    <section
      style={assignInlineVars({
        [vars.colors.brand]: 'pink',
        [vars.colors.accent]: 'green',
      })}
    >
      ...
    </section>
  );
  ```

  You can also assign collections of variables by passing a theme contract as the first argument. All variables must be assigned or it’s a type error.

  ```tsx
  // app.tsx

  import { assignInlineVars } from '@vanilla-extract/dynamic';
  import { vars } from './vars.css.ts';

  const MyComponent = () => (
    <section
      style={assignInlineVars(vars.colors, {
        brand: 'pink',
        accent: 'green',
      })}
    >
      ...
    </section>
  );
  ```

  Even though this function returns an object of inline styles, its `toString` method returns a valid `style` attribute value so that it can be used in string templates.

  ```tsx
  // app.ts

  import { assignInlineVars } from '@vanilla-extract/dynamic';
  import { vars } from './vars.css.ts';

  document.write(`
    <section style="${assignInlineVars({
      [vars.colors.brand]: 'pink',
      [vars.colors.accent]: 'green',
    })}">
      ...
    </section>
  `);
  ```

  **setElementVars**

  Sets CSS Variables on a DOM element.

  ```tsx
  // app.ts

  import { setElementVars } from '@vanilla-extract/dynamic';
  import { vars } from './styles.css.ts';

  const el = document.getElementById('myElement');

  setElementVars(el, {
    [vars.colors.brand]: 'pink',
    [vars.colors.accent]: 'green',
  });
  ```

  You can also set collections of variables by passing a theme contract as the second argument. All variables must be set or it’s a type error.

  ```tsx
  // app.ts

  import { setElementVars } from '@vanilla-extract/dynamic';
  import { vars } from './styles.css.ts';

  const el = document.getElementById('myElement');

  setElementVars(el, vars.colors, {
    brand: 'pink',
    accent: 'green',
  });
  ```

  **BREAKING CHANGE**

  These functions replace `createInlineTheme`, `setElementTheme` and `setElementVar`.

  `assignInlineVars` works as a drop-in replacement for `createInlineTheme`.

  ```diff
  -createInlineTheme(vars, { brandColor: 'red' });
  +assignInlineVars(vars, { brandColor: 'red' });
  ```

  `setElementVars` works as a drop-in replacement for `setElementTheme`.

  ```diff
  -setElementTheme(el, vars, { brandColor: 'red' });
  +setElementVars(el, vars, { brandColor: 'red' });
  ```

  You can replicate the functionality of `setElementVar` by passing an object with dynamic keys to `setElementVars`. This now makes it easy to support setting multiple vars at once.

  ```diff
  -setElementVar(el, vars.brandColor, 'red');
  +setElementVars(el, {
  +  [vars.brandColor]: 'red'
  +});
  ```

## 1.0.0

### Major Changes

- [#171](https://github.com/seek-oss/vanilla-extract/pull/171) [`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/private@1.0.0
