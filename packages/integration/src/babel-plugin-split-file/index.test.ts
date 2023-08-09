import { transformSync } from '@babel/core';
// @ts-expect-error
import typescriptSyntax from '@babel/plugin-syntax-typescript';
// @ts-expect-error
import jsxSyntax from '@babel/plugin-syntax-jsx';
import { types as t } from '@babel/core';
import dollarPlugin, { Store } from './index';
import generate from '@babel/generator';

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) => (val as string).trim(),
});

const transform = (
  source: string,
  macros: string[] = ['extract$', 'style$'],
  filename = './dir/mockFilename.ts',
) => {
  const store: Store = {
    buildTimeStatements: [],
  };
  const result = transformSync(source, {
    filename,
    cwd: __dirname,
    plugins: [
      [dollarPlugin, { store, macros }],
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
    const source = /* tsx */ `
      import React from 'react';
      import { style$ } from '@vanilla-extract/css';

      const one = style$({
        zIndex: 1,
      });

      export default () => <div className={one} />`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      import React from 'react';
      const one = _vanilla_identifier_0;
      export default (() => <div className={one} />);
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import React from 'react';
      import { style$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_0 = style$({
        zIndex: 1
      });
      const one = _vanilla_identifier_0;
      export default (() => <div className={one} />);
    `);
  });

  it('should handle expressions that create styles', () => {
    const source = /* tsx */ `
      import React from 'react';
      import { style, extract$ } from '@vanilla-extract/css';

      const something = extract$([1, 2].map(value => style({ zIndex: value })));

      export default () => <>
        <div className={something[0]} />
        <div className={something[1]} />
      </>`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      import React from 'react';
      const something = _vanilla_identifier_0;
      export default (() => <>
              <div className={something[0]} />
              <div className={something[1]} />
            </>);
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import React from 'react';
      import { style, extract$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_0 = extract$([1, 2].map(value => style({
        zIndex: value
      })));
      const something = _vanilla_identifier_0;
      export default (() => <>
              <div className={something[0]} />
              <div className={something[1]} />
            </>);
    `);
  });

  it('should handle shared vars between runtime and buildtime code', () => {
    const source = /* tsx */ `
      import React from 'react';
      import { style, extract$ } from '@vanilla-extract/css';

      let id = 'my-id';
      let z = 1;
      z = 2;

      for (let i = 0; i < 5; i++) {
        id = id + i;
        z++;
      }

      const className = extract$(style({
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
      const className = _vanilla_identifier_0;
      export default (() => <div id={id} className={className} />);
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import React from 'react';
      import { style, extract$ } from '@vanilla-extract/css';
      let id = 'my-id';
      let z = 1;
      z = 2;
      for (let i = 0; i < 5; i++) {
        id = id + i;
        z++;
      }
      export const _vanilla_identifier_0 = extract$(style({
        ':before': {
          content: id,
          zIndex: z
        }
      }));
      const className = _vanilla_identifier_0;
      export default (() => <div id={id} className={className} />);
    `);
  });

  it('should handle an import with the same name as an object property', () => {
    const source = /* tsx */ `
      import { recipe$ } from '@vanilla-extract/recipes';
      import { large, legacyStyle } from './styles.css';

      const thing = recipe$({
        base: {
          background: 'black',
          color: 'white',
        },
        variants: {
          size: {
            small: { fontSize: 12 },
            medium: { fontSize: 16 },
            large: { fontSize: 32 },
          },
        },
      });

      document.body.innerHTML = \`
        <div class="$\{legacyStyle\}"></div>
        <div class="$\{thing({ size: 'large' })\}">I am a recipe$</div>
      \``;

    const result = transform(source, ['recipe$']);

    expect(result.code).toMatchInlineSnapshot(`
      import { large, legacyStyle } from './styles.css';
      const thing = _vanilla_identifier_0;
      document.body.innerHTML = \`
              <div class="\${legacyStyle}"></div>
              <div class="\${thing({
        size: 'large'
      })}">I am a recipe$</div>
            \`;
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { recipe$ } from '@vanilla-extract/recipes';
      import { large, legacyStyle } from './styles.css';
      export const _vanilla_identifier_0 = recipe$({
        base: {
          background: 'black',
          color: 'white'
        },
        variants: {
          size: {
            small: {
              fontSize: 12
            },
            medium: {
              fontSize: 16
            },
            large: {
              fontSize: 32
            }
          }
        }
      });
      const thing = _vanilla_identifier_0;
      document.body.innerHTML = \`
              <div class="\${legacyStyle}"></div>
              <div class="\${thing({
        size: 'large'
      })}">I am a recipe$</div>
            \`;
    `);
  });

  it('should handle an imported identifier that is used both at buildtime and runtime', () => {
    const source = /* tsx */ `
      import { style$ } from '@vanilla-extract/css';
      import { large } from './myStyles';

      export const MyComponent = () => (
        <div>
          <span className={large}>Foo</span>
          <span className={style$([large, { color: 'blue' }])}>Foo</span>
        </div>
      );`;

    const result = transform(source, ['style$']);

    expect(result.code).toMatchInlineSnapshot(`
      import { large } from './myStyles';
      export const MyComponent = () => <div>
                <span className={large}>Foo</span>
                <span className={_vanilla_identifier_0}>Foo</span>
              </div>;
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style$ } from '@vanilla-extract/css';
      import { large } from './myStyles';
      export const _vanilla_identifier_0 = style$([large, {
        color: 'blue'
      }]);
      export const MyComponent = () => <div>
                <span className={large}>Foo</span>
                <span className={_vanilla_identifier_0}>Foo</span>
              </div>;
    `);
  });

  it('should retain required imports', () => {
    const source = /* tsx */ `
      import React from 'react';
      import polished from 'polished';
      import { style$ } from '@vanilla-extract/css';

      const lightRed = style$({ color: polished.lighten('red') });

      export default () => <div className={lightRed} />`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      import React from 'react';
      const lightRed = _vanilla_identifier_0;
      export default (() => <div className={lightRed} />);
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import React from 'react';
      import polished from 'polished';
      import { style$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_0 = style$({
        color: polished.lighten('red')
      });
      const lightRed = _vanilla_identifier_0;
      export default (() => <div className={lightRed} />);
    `);
  });

  it('should retain mixed required imports', () => {
    const source = /* tsx */ `
      import { style$ } from '@vanilla-extract/css';
      import { brandVar, brand, BrandDetails } from './colors';

      const className = style$({
        vars: {
          [brandVar]: brand,
        },
        backgroundColor: brandVar,
      });

      export const Component = () =>
        <BrandDetails className={className} />`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(`
      import { brandVar, brand, BrandDetails } from './colors';
      const className = _vanilla_identifier_0;
      export const Component = () => <BrandDetails className={className} />;
    `);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style$ } from '@vanilla-extract/css';
      import { brandVar, brand, BrandDetails } from './colors';
      export const _vanilla_identifier_0 = style$({
        vars: {
          [brandVar]: brand
        },
        backgroundColor: brandVar
      });
      const className = _vanilla_identifier_0;
      export const Component = () => <BrandDetails className={className} />;
    `);
  });

  it('should work inline as a classname', () => {
    const source = /* tsx */ `
      import { style, extract$ } from '@vanilla-extract/css';

      export default () => <div className={extract$(style({ display: 'flex' }))}>foo</div>;`;

    const result = transform(source);

    expect(result.code).toMatchInlineSnapshot(
      `export default (() => <div className={_vanilla_identifier_0}>foo</div>);`,
    );

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style, extract$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_0 = extract$(style({
        display: 'flex'
      }));
      export default (() => <div className={_vanilla_identifier_0}>foo</div>);
    `);
  });

  it('should not create identifiers if none were assigned', () => {
    const source = /* tsx */ `
      import { globalStyle$ } from '@vanilla-extract/css';

      globalStyle$('body', {
        color: 'red'
      })`;

    const result = transform(source, ['globalStyle$']);

    expect(result.code).toMatchInlineSnapshot(``);

    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { globalStyle$ } from '@vanilla-extract/css';
      globalStyle$('body', {
        color: 'red'
      });
    `);
  });

  it('should support multiple macros', () => {
    const source = /* tsx */ `
      import { style, extract$, style$ } from '@vanilla-extract/css';

      export const myStyle = extract$(style({ color: 'red' }));

      export const myOtherStyle = style$({ color: 'green' });

      export default extract$(style({ color: 'blue' }));`;

    const result = transform(source, ['extract$', 'style$']);

    expect(result.code).toMatchInlineSnapshot(`
      export const myStyle = _vanilla_identifier_0;
      export const myOtherStyle = _vanilla_identifier_1;
      export default _vanilla_identifier_2;
    `);
    expect(result.buildTimeCode).toMatchInlineSnapshot(`
      import { style, extract$, style$ } from '@vanilla-extract/css';
      export const _vanilla_identifier_0 = extract$(style({
        color: 'red'
      }));
      export const myStyle = _vanilla_identifier_0;
      export const _vanilla_identifier_1 = style$({
        color: 'green'
      });
      export const myOtherStyle = _vanilla_identifier_1;
      export const _vanilla_identifier_2 = extract$(style({
        color: 'blue'
      }));
      export default _vanilla_identifier_2;
    `);
  });
});
