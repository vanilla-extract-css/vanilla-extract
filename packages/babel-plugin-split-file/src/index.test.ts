import { transformSync } from '@babel/core';
// @ts-expect-error
import typescriptSyntax from '@babel/plugin-syntax-typescript';
import plugin from './';

const transform = (source: string, filename = './dir/mockFilename.css.ts') => {
  const result = transformSync(source, {
    filename,
    cwd: __dirname,
    plugins: [plugin, typescriptSyntax],
    configFile: false,
  });

  if (!result) {
    throw new Error('No result');
  }

  return result.code;
};

describe('split-file', () => {
  it('should handle basic style calls', () => {
    const source = `
      import React from 'react';
      import { style } from '@vanilla-extract/css';

      const two = 2;

      const one = style({
        zIndex: two,
      });

      const something = [1, 2].map(value => style({ zIndex: value }));

      const id = '123';

      export default () => \`<div id="\${id}" class="\${one}" />\``;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      const two = 2;
      const one = style({
        zIndex: two
      });
      const something = [1, 2].map(value => style({
        zIndex: value
      }));"
    `);
  });

  it('should handle style inside a new function', () => {
    const source = `
      import React from 'react';
      import { style } from '@vanilla-extract/css';

      const color = 'red';

      const myStyle = (display) => style({ display, color })

      const block = myStyle('block');
      const flex = myStyle('flex');

      const id = '123';

      export default () => \`<div id="\${id}" class="\${flex}" />\``;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      const color = 'red';
      const myStyle = display => style({
        display,
        color
      });
      const block = myStyle('block');
      const flex = myStyle('flex');"
    `);
  });

  it('should retain required imports', () => {
    const source = `
      import React from 'react';
      import polished from 'polished';
      import { style } from '@vanilla-extract/css';

      const makeItPretty = (color) => polished.makeItPretty(color);

      const color = makeItPretty('red');

      const myStyle = (display) => style({ display, color })

      const block = myStyle('block');
      const flex = myStyle('flex');

      const id = '123';

      export default () => \`<div id="\${id}" class="\${flex}" />\``;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import polished from 'polished';
      import { style } from '@vanilla-extract/css';
      const makeItPretty = color => polished.makeItPretty(color);
      const color = makeItPretty('red');
      const myStyle = display => style({
        display,
        color
      });
      const block = myStyle('block');
      const flex = myStyle('flex');"
    `);
  });
});
