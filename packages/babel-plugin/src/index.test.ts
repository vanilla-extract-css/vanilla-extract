import { transformSync } from '@babel/core';
import { Options } from './types';
import plugin from './';

const transform = (
  source: string,
  options: Options = {},
  filename = '/root/projects/my-app/dir/mockFilename.treat.ts',
) => {
  const result = transformSync(source, {
    filename,
    root: '/root/projects/my-app',
    plugins: [[plugin, options]],
    configFile: false,
  });

  if (!result) {
    throw new Error('No result');
  }

  return result.code;
};

describe('babel plugin', () => {
  it('should handle style assigned to const', () => {
    const source = `
      import { style } from '@mattsjones/css-core';

      const one = style({
          zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from '@mattsjones/css-core';
      const one = style({
        zIndex: 2
      }, \\"one\\");
      endFileScope()"
    `);
  });

  it('should handle style assigned to default export', () => {
    const source = `
      import { style } from '@mattsjones/css-core';

      export default style({
          zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from '@mattsjones/css-core';
      export default style({
        zIndex: 2
      }, \\"default\\");
      endFileScope()"
    `);
  });

  it('should handle style assigned to object property', () => {
    const source = `
      import { style } from '@mattsjones/css-core';

      const test = {
        one: {
          two: style({
            zIndex: 2,
          })
        }
      };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from '@mattsjones/css-core';
      const test = {
        one: {
          two: style({
            zIndex: 2
          }, \\"test_one_two\\")
        }
      };
      endFileScope()"
    `);
  });

  it('should handle style returned from an arrow function', () => {
    const source = `
      import { style } from '@mattsjones/css-core';

      const test = () => {
        return style({
          color: 'red'
        });
      };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from '@mattsjones/css-core';

      const test = () => {
        return style({
          color: 'red'
        }, \\"test\\");
      };

      endFileScope()"
    `);
  });

  it('should handle style returned implicitly from an arrow function', () => {
    const source = `
      import { style } from '@mattsjones/css-core';

      const test = () => style({
        color: 'red'
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from '@mattsjones/css-core';

      const test = () => style({
        color: 'red'
      }, \\"test\\");

      endFileScope()"
    `);
  });

  it('should handle style returned from a function', () => {
    const source = `
      import { style } from '@mattsjones/css-core';

      function test() {
        return style({
          color: 'red'
        });
      }
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from '@mattsjones/css-core';

      function test() {
        return style({
          color: 'red'
        }, \\"test\\");
      }

      endFileScope()"
    `);
  });

  it('should handle createTheme assigned to const', () => {
    const source = `
      import { createTheme } from '@mattsjones/css-core';

      const darkTheme = createTheme({}, {});
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { createTheme } from '@mattsjones/css-core';
      const darkTheme = createTheme({}, {}, \\"darkTheme\\");
      endFileScope()"
    `);
  });

  it('should ignore functions that already supply a debug name', () => {
    const source = `
      import { style } from '@mattsjones/css-core';

      const three = style({
          testStyle: {
            zIndex: 2,
          }
      }, 'myDebugValue');
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from '@mattsjones/css-core';
      const three = style({
        testStyle: {
          zIndex: 2
        }
      }, 'myDebugValue');
      endFileScope()"
    `);
  });

  it('should only apply to functions imported from the relevant package', () => {
    const source = `
      import { style } from 'treats';

      const three = style({
        zIndex: 2,  
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from 'treats';
      const three = style({
        zIndex: 2
      });"
    `);
  });

  it('should handle renaming imports', () => {
    const source = `
      import { style as specialStyle } from '@mattsjones/css-core';

      const four = specialStyle({
        zIndex: 2,  
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style as specialStyle } from '@mattsjones/css-core';
      const four = specialStyle({
        zIndex: 2
      }, \\"four\\");
      endFileScope()"
    `);
  });

  it('should handle package aliases', () => {
    const source = `
      import { style } from 'my-alias';

      const four = style({
        zIndex: 2,  
      });
    `;

    expect(transform(source, { alias: 'my-alias' })).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"my-alias/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from 'my-alias';
      const four = style({
        zIndex: 2
      }, \\"four\\");
      endFileScope()"
    `);
  });

  it('should handle anonymous style in arrays', () => {
    const source = `
       import { style } from '@mattsjones/css-core';

       export const height = [
        style({
          zIndex: 2,  
        })
      ];
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from '@mattsjones/css-core';
      export const height = [style({
        zIndex: 2
      }, \\"height\\")];
      endFileScope()"
    `);
  });

  it('should handle object key with anonymous style in arrays', () => {
    const source = `
       import { style } from '@mattsjones/css-core';

       export const height = {
        full: [style({
          zIndex: 2,  
        })]
       };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import { style } from '@mattsjones/css-core';
      export const height = {
        full: [style({
          zIndex: 2
        }, \\"height_full\\")]
      };
      endFileScope()"
    `);
  });

  it('should handle namespace imports', () => {
    const source = `
      import * as css from '@mattsjones/css-core';

      const one = css.style({
          zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope, endFileScope } from \\"@mattsjones/css-core/fileScope\\";
      setFileScope(\\"dir/mockFilename.treat.ts\\");
      import * as css from '@mattsjones/css-core';
      const one = css.style({
        zIndex: 2
      }, \\"one\\");
      endFileScope()"
    `);
  });
});
