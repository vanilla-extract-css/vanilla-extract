import { dynamicStyle } from './dynamicStyle';

type Test = 'a' | 'b';

const foo = dynamicStyle(
  ['bg', 'foo'],
  ({
    bg,
    foo,
    // @ts-expect-error
    extra,
  }) => ({
    background: bg,
    color: foo,
  }),
);

foo({ bg: 'something' });
foo({ foo: 'bar' });
// @ts-expect-error
foo({ bar: 'error' });
foo({
  bg: 'something',
  // @ts-expect-error
  bar: 'error',
});

const providedType = dynamicStyle<Test>(
  ['bg', 'foo'],
  ({
    bg,
    foo,
    // @ts-expect-error
    extra,
  }) => ({
    background: bg,
    color: foo,
  }),
);

providedType({ bg: 'a' });
providedType({ foo: 'b' });
// @ts-expect-error
providedType({ bar: 'error' });
providedType({
  // @ts-expect-error
  bg: 'something',
  // @ts-expect-error
  bar: 'error',
});
