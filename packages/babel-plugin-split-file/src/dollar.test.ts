import { transformSync } from '@babel/core';
// @ts-expect-error
import typescriptSyntax from '@babel/plugin-syntax-typescript';
// @ts-expect-error
import jsxSyntax from '@babel/plugin-syntax-jsx';
import { types as t } from '@babel/core';
import dollarPlugin, { Store } from './dollar';
import generate from '@babel/generator';

const transform = (source: string, filename = './dir/mockFilename.css.ts') => {
  const store: Store = {
    statementSourceMap: new Map(),
    buildTimeStatements: [],
  };
  const result = transformSync(source, {
    filename,
    cwd: __dirname,
    plugins: [
      [dollarPlugin, { store }],
      [typescriptSyntax, { isTSX: true }],
      jsxSyntax,
    ],
    configFile: false,
  });

  if (!result) {
    throw new Error('No result');
  }

  const program = t.program(store.buildTimeStatements);
  const buildTimeCode = generate(
    program,
    { comments: false, sourceMaps: true, sourceFileName: filename },
    source,
  );

  return { code: result.code, buildTimeCode: buildTimeCode.code };
};

describe('dollar', () => {
  it('should handle basic style calls', () => {
    const source = `
      import React from 'react';
      import { style, css$ } from '@vanilla-extract/css';

      const two = 2;

      const one = css$(style({
        zIndex: two,
      }));

      const something = [1, 2].map(value => css$(style({ zIndex: value })));

      const id = '123';

      export default () => \`<div id="\${id}" class="\${one}" />\``;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      "import React from 'react';
      const id = '123';
      export default (() => \`<div id="\${id}" class="\${one}" />\`);"
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      "import { style, css$ } from '@vanilla-extract/css';
      const two = 2;
      const one = css$(style({
        zIndex: two
      }));
      const something = [1, 2].map(value => css$(style({
        zIndex: value
      })));"
    `);
  });

  it('should handle style inside a new function', () => {
    const source = `
      import React from 'react';
      import { style, css$ } from '@vanilla-extract/css';

      const color = 'red';

      const myStyle = (display) => css$(style({ display, color }))

      const block = myStyle('block');
      const flex = myStyle('flex');

      const id = '123';

      export default () => \`<div id="\${id}" class="\${flex}" />\``;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      "import React from 'react';
      const id = '123';
      export default (() => \`<div id="\${id}" class="\${flex}" />\`);"
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      "import { style, css$ } from '@vanilla-extract/css';
      const color = 'red';
      const myStyle = display => css$(style({
        display,
        color
      }));
      const block = myStyle('block');
      const flex = myStyle('flex');"
    `);
  });

  it('should retain required imports', () => {
    const source = `
    import React from 'react';
    import polished from 'polished';
    import { style, css$ } from '@vanilla-extract/css';

    const makeItPretty = (color) => polished.makeItPretty(color);

    const color = makeItPretty('red');

    const myStyle = (display) => css$(style({ display, color }));

    const block = myStyle('block');
    const flex = myStyle('flex');

    const id = '123';

    export default () => \`<div id="\${id}" class="\${flex}" />\``;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
    "import React from 'react';
    const id = '123';
    export default (() => \`<div id="\${id}" class="\${flex}" />\`);"
  `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
    "import polished from 'polished';
    import { style, css$ } from '@vanilla-extract/css';
    const makeItPretty = color => polished.makeItPretty(color);
    const color = makeItPretty('red');
    const myStyle = display => css$(style({
      display,
      color
    }));
    const block = myStyle('block');
    const flex = myStyle('flex');"
  `);
  });

  it('should work inline as a classname', () => {
    const source = `
  import { style, css$ } from '@vanilla-extract/css';

  const blah = () => '123';

  const SomeComponent = () => <div className={css$(style({ display: 'flex' }))}>foo</div>;`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
    "const blah = () => '123';
    const SomeComponent = () => <div className={_vanilla_anonymousIdentifier_2_0}>foo</div>;"
  `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
    "import { style, css$ } from '@vanilla-extract/css';
    const _vanilla_anonymousIdentifier_2_0 = css$(style({
      display: 'flex'
    }));"
  `);
  });

  it('should work inline as an export', () => {
    const source = `
      import { style, css$ } from '@vanilla-extract/css';

      export const myStyle = css$(style({ color: 'red' }));

      export default css$(style({ color: 'blue' }));`;

    const result = transform(source);

    // TODO: This is wrong
    expect(result.code).toMatchInlineSnapshot(`
      "export const myStyle = css$(style({
        color: 'red'
      }));
      export default css$(style({
        color: 'blue'
      }));"
    `);
    expect(result.buildTimeCode).toMatchInlineSnapshot(
      `"import { style, css$ } from '@vanilla-extract/css';"`,
    );
  });
});
