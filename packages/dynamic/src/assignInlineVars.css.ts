import { createThemeContract } from '@vanilla-extract/css';

export const vars = createThemeContract({
  foo: { bar: null },
  baz: { qux: null },
});
