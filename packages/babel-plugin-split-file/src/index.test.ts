import { transformSync } from '@babel/core';
// @ts-expect-error
import typescriptSyntax from '@babel/plugin-syntax-typescript';
// @ts-expect-error
import jsxSyntax from '@babel/plugin-syntax-jsx';
import { types as t } from '@babel/core';
import dollarPlugin, { Store } from '.';
import generate from '@babel/generator';

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) => (val as string).trim(),
});

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

      export default () => \`<div id="\${id}" class="\${one}" />\``;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      import React from 'react';
      const one = _vanilla_identifier_3_0;
      export default (() => \`<div id="\${id}" class="\${one}" />\`);
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style, css$ } from '@vanilla-extract/css';
      const two = 2;
      export const _vanilla_identifier_3_0 = css$(style({
        zIndex: two
      }));
    `);
  });

  it('should handle expressions that create styles', () => {
    const source = `
      import React from 'react';
      import { style, css$ } from '@vanilla-extract/css';

      const something = css$([1, 2].map(value => style({ zIndex: value })));

      export default () => \`<>
        <div class="\${something[0]}" />
        <div class="\${something[1]}" />
      </>\``;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      import React from 'react';
      const something = _vanilla_identifier_2_0;
      export default (() => \`<>
              <div class="\${something[0]}" />
              <div class="\${something[1]}" />
            </>\`);
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style, css$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_2_0 = css$([1, 2].map(value => style({
        zIndex: value
      })));
    `);
  });

  it('should handle shared vars between runtime and buildtime code', () => {
    const source = `
      import React from 'react';
      import { style, css$ } from '@vanilla-extract/css';

      let id = 'my-id';
      let z = 1;
      z = 2;

      for (let i = 0; i < 5; i++) {
        id = id + i;
        z++;
      }

      const className = css$(style({
        ':before': {
          content: id,
          zIndex: z,
        }        
      }));

      export default () => <div id={id} className={className} />`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      import React from 'react';
      let id = 'my-id';
      let z = 1;
      z = 2;
      for (let i = 0; i < 5; i++) {
        id = id + i;
        z++;
      }
      const className = _vanilla_identifier_6_0;
      export default (() => <div id={id} className={className} />);
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style, css$ } from '@vanilla-extract/css';
      let id = 'my-id';
      let z = 1;
      z = 2;
      for (let i = 0; i < 5; i++) {
        id = id + i;
        z++;
      }
      export const _vanilla_identifier_6_0 = css$(style({
        ':before': {
          content: id,
          zIndex: z
        }
      }));
    `);
  });

  it('should handle style inside a new function', () => {
    const source = `
      import React from 'react';
      import { style, css$ } from '@vanilla-extract/css';

      const color = 'red';

      const myStyle = (display) => style({ display, color })

      const flex = css$(myStyle('flex'));

      export default () => \`<div class="\${flex}" />\``;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      import React from 'react';
      const flex = _vanilla_identifier_4_0;
      export default (() => \`<div class="\${flex}" />\`);
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style, css$ } from '@vanilla-extract/css';
      const color = 'red';
      const myStyle = display => style({
        display,
        color
      });
      export const _vanilla_identifier_4_0 = css$(myStyle('flex'));
    `);
  });

  it('should retain required imports', () => {
    const source = `
    import React from 'react';
    import polished from 'polished';
    import { style, css$ } from '@vanilla-extract/css';

    const myColorStyle = (color) => style({ color: polished.lighten(color) });
    const lightRed = css$(myColorStyle('red'));

    export default () => <div className={lightRed} />`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      import React from 'react';
      const lightRed = _vanilla_identifier_4_0;
      export default (() => <div className={lightRed} />);
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import polished from 'polished';
      import { style, css$ } from '@vanilla-extract/css';
      const myColorStyle = color => style({
        color: polished.lighten(color)
      });
      export const _vanilla_identifier_4_0 = css$(myColorStyle('red'));
    `);
  });

  it('should work inline as a classname', () => {
    const source = `
    import { style, css$ } from '@vanilla-extract/css';

    export default () => <div className={css$(style({ display: 'flex' }))}>foo</div>;`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(
      `export default (() => <div className={_vanilla_anonymousIdentifier_1_0}>foo</div>);`,
    );

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style, css$ } from '@vanilla-extract/css';
      export const _vanilla_anonymousIdentifier_1_0 = css$(style({
        display: 'flex'
      }));
    `);
  });

  it('should work inline as a named export', () => {
    const source = `
      import { style, css$ } from '@vanilla-extract/css';

      export const myStyle = css$(style({ color: 'red' }));

      export const blue = css$(style({ color: 'blue' }));`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      export const myStyle = _vanilla_identifier_1_0;
      export const blue = _vanilla_identifier_2_0;
    `);
    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style, css$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_1_0 = css$(style({
        color: 'red'
      }));
      export const _vanilla_identifier_2_0 = css$(style({
        color: 'blue'
      }));
    `);
  });

  it('should work inline as a default export', () => {
    const source = `
      import { style, css$ } from '@vanilla-extract/css';

      export const myStyle = css$(style({ color: 'red' }));

      export default css$(style({ color: 'blue' }));`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      export const myStyle = _vanilla_identifier_1_0;
      export default _vanilla_defaultIdentifer;
    `);
    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style, css$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_1_0 = css$(style({
        color: 'red'
      }));
      export const _vanilla_defaultIdentifer = css$(style({
        color: 'blue'
      }));
    `);
  });
});
