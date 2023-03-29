import { transformSync } from '@babel/core';
// @ts-expect-error
import typescriptSyntax from '@babel/plugin-syntax-typescript';
// @ts-expect-error
import jsxSyntax from '@babel/plugin-syntax-jsx';
import { types as t } from '@babel/core';
import dollarPlugin, { Store } from '.';
import generate from '@babel/generator';

const transform = (source: string, filename = './dir/mockFilename.css.ts') => {
  const store: Store = {
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

describe('babel-plugin-split-file', () => {
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
      export default (() => \`<div id="\${_vanilla_identifier_5_0}" class="\${_vanilla_identifier_3_0}" />\`);"
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      "import { style, css$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_2_0 = 2;
      export const _vanilla_identifier_3_0 = css$(style({
        zIndex: _vanilla_identifier_2_0
      }));
      const something = [1, 2].map(value => css$(style({
        zIndex: value
      })));
      export const _vanilla_identifier_5_0 = '123';"
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
      export default (() => \`<div id="\${_vanilla_identifier_6_0}" class="\${_vanilla_identifier_5_0}" />\`);"
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      "import { style, css$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_2_0 = 'red';
      export const _vanilla_identifier_3_0 = display => css$(style({
        display,
        _vanilla_identifier_2_0
      }));
      const block = _vanilla_identifier_3_0('block');
      export const _vanilla_identifier_5_0 = _vanilla_identifier_3_0('flex');
      export const _vanilla_identifier_6_0 = '123';"
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

    const SomeComponent = () => \`<div id="\${id}" class="\${flex}" />\`
    export const SomeOtherComponent = () => \`<div id="\${id}" class="\${block}">\${SomeComponent()}</div>\`
    export default () => \`<div id="\${id}" class="\${flex}" />\``;

    const result = transform(source);

    // TODO: This is wrong, some build time stuff shouldn't be there, flex should be renamed and
    // exported
    expect(result.code).toMatchInlineSnapshot(`
      "import React from 'react';
      export const SomeOtherComponent = () => \`<div id="\${_vanilla_identifier_8_0}" class="\${_vanilla_identifier_6_0}">\${_vanilla_identifier_9_0()}</div>\`;
      export default (() => \`<div id="\${_vanilla_identifier_8_0}" class="\${_vanilla_identifier_7_0}" />\`);"
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      "import polished from 'polished';
      import { style, css$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_3_0 = color => polished.makeItPretty(color);
      export const _vanilla_identifier_4_0 = _vanilla_identifier_3_0('red');
      export const _vanilla_identifier_5_0 = display => css$(style({
        display,
        _vanilla_identifier_4_0
      }));
      export const _vanilla_identifier_6_0 = _vanilla_identifier_5_0('block');
      export const _vanilla_identifier_7_0 = _vanilla_identifier_5_0('flex');
      export const _vanilla_identifier_8_0 = '123';
      export const _vanilla_identifier_9_0 = () => \`<div id="\${_vanilla_identifier_8_0}" class="\${_vanilla_identifier_7_0}" />\`;"
    `);
  });

  it('should work inline as a classname', () => {
    const source = `
  import { style, css$ } from '@vanilla-extract/css';

  const blah = () => '123';

  const SomeComponent = () => <div className={css$(style({ display: 'flex' }))}>foo</div>;
  export const SomeOtherComponent = () => <div className={css$(style({ display: 'flex' }))}>foo</div>;
  export default () => <div className={css$(style({ display: 'flex' }))}>foo</div>;`;
    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      "const blah = () => '123';
      export const SomeOtherComponent = () => <div className={_vanilla_anonymousIdentifier_3_0}>foo</div>;
      export default (() => <div className={_vanilla_anonymousIdentifier_4_0}>foo</div>);"
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      "import { style, css$ } from '@vanilla-extract/css';
      export const _vanilla_anonymousIdentifier_2_0 = css$(style({
        display: 'flex'
      }));
      const SomeComponent = () => <div className={_vanilla_anonymousIdentifier_2_0}>foo</div>;
      export const _vanilla_anonymousIdentifier_3_0 = css$(style({
        display: 'flex'
      }));
      export const _vanilla_anonymousIdentifier_4_0 = css$(style({
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
      "export const myStyle = _vanilla_anonymousIdentifier_1_0;
      export default css$(style({
        color: 'blue'
      }));"
    `);
    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      "import { style, css$ } from '@vanilla-extract/css';
      export const _vanilla_anonymousIdentifier_1_0 = css$(style({
        color: 'red'
      }));"
    `);
  });
});
