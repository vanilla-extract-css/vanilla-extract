# @vanilla-extract/dynamic

## 2.1.0

### Minor Changes

- [#1175](https://github.com/vanilla-extract-css/vanilla-extract/pull/1175) [`ca854f5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ca854f51d5068fb1105a44b3d9af2852d4b61839) Thanks [@youngkyo0504](https://github.com/youngkyo0504)! - `assignInlineVars` now accepts `null` and `undefined` values

  Variables with a value of `null` or `undefined` will be omitted from the resulting inline style.

  **NOTE:** This only applies to the case where a theme contract is not provided.

  ```tsx
  import { assignInlineVars } from '@vanilla-extract/dynamic';
  import { container, brandColor, textColor } from './styles.css.ts';

  // If `tone` is `undefined`, the following inline style becomes:
  // { '--brandColor__8uideo0': 'pink' }

  const MyComponent = ({ tone }: { tone?: critical }) => (
    <section
      className={container}
      style={assignInlineVars({
        [brandColor]: 'pink',
        [textColor]: tone === 'critical' ? 'red' : null,
      })}
    >
      ...
    </section>
  );
  ```

- [#1175](https://github.com/vanilla-extract-css/vanilla-extract/pull/1175) [`ca854f5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ca854f51d5068fb1105a44b3d9af2852d4b61839) Thanks [@youngkyo0504](https://github.com/youngkyo0504)! - `setElementVars` now accepts `null` and `undefined` values

  Variables with a value of `null` or `undefined` will not be assigned a value.

  **NOTE:** This only applies to the case where a theme contract is not provided.

  ```ts
  import { setElementVars } from '@vanilla-extract/dynamic';
  import { brandColor, textColor } from './styles.css.ts';

  const el = document.getElementById('myElement');

  setElementVars(el, {
    [brandColor]: 'pink',
    [textColor]: null,
  });
  ```

## 2.0.3

### Patch Changes

- [#854](https://github.com/vanilla-extract-css/vanilla-extract/pull/854) [`98f8b03`](https://github.com/vanilla-extract-css/vanilla-extract/commit/98f8b0387d661b77705d2cd83ab3095434e1223e) Thanks [@mrm007](https://github.com/mrm007)! - Bundle TypeScript declaration files (`.d.ts`) when building packages

## 2.0.2

### Patch Changes

- [#520](https://github.com/vanilla-extract-css/vanilla-extract/pull/520) [`b294764`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Transpile code to meet [esmodules target](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

  This should allow code that runs in the browser to conform to most browser policies. If you need to support browsers prior to the esmodules target (e.g. IE 11) then you'll need to configure custom transpilation in your projects.

- Updated dependencies [[`b294764`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d)]:
  - @vanilla-extract/private@1.0.3

## 2.0.1

### Patch Changes

- [#508](https://github.com/vanilla-extract-css/vanilla-extract/pull/508) [`d15e783`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d15e783c960144e3b3ca74128cb2d04fbbc16df1) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `exports` field to `package.json` so nested package paths can be imported in a Node.js ESM context

## 2.0.0

### Major Changes

- [#276](https://github.com/vanilla-extract-css/vanilla-extract/pull/276) [`4bcbd6f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/4bcbd6f4ac0170a09553ce8d44ca84361782cce5) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `assignInlineVars` and `setElementVars` functions

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

- [#171](https://github.com/vanilla-extract-css/vanilla-extract/pull/171) [`84a8611`](https://github.com/vanilla-extract-css/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/vanilla-extract-css/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/private@1.0.0
