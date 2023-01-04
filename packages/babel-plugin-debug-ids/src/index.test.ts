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

describe('babel plugin', () => {
  it('should not crash when using `satisfies` operator', () => {
    const source = `
      const dummy = {} satisfies {};
    `;

    expect(() => transform(source)).not.toThrow();
  });

  it('should handle style assigned to const', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const one = style({
        zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      const one = style({
        zIndex: 2
      }, "one");"
    `);
  });

  it('should handle styleVariants assigned to const', () => {
    const source = `
      import { styleVariants } from '@vanilla-extract/css';

      const colors = styleVariants({
        red: { color: 'red' }
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { styleVariants } from '@vanilla-extract/css';
      const colors = styleVariants({
        red: {
          color: 'red'
        }
      }, "colors");"
    `);
  });

  it('should handle styleVariants with mapper assigned to const', () => {
    const source = `
      import { styleVariants } from '@vanilla-extract/css';

      const colors = styleVariants({
        red: 'red'
      }, (color) => ({ color }));
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { styleVariants } from '@vanilla-extract/css';
      const colors = styleVariants({
        red: 'red'
      }, color => ({
        color
      }), "colors");"
    `);
  });

  it('should handle style assigned to default export', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      export default style({
          zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      export default style({
        zIndex: 2
      }, "default");"
    `);
  });

  it('should handle style assigned to object property', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const test = {
        one: {
          two: style({
            zIndex: 2,
          })
        }
      };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      const test = {
        one: {
          two: style({
            zIndex: 2
          }, "test_one_two")
        }
      };"
    `);
  });

  it('should handle style returned from an arrow function', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const test = () => {
        return style({
          color: 'red'
        });
      };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      const test = () => {
        return style({
          color: 'red'
        }, "test");
      };"
    `);
  });

  it('should handle style returned implicitly from an arrow function', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const test = () => style({
        color: 'red'
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      const test = () => style({
        color: 'red'
      }, "test");"
    `);
  });

  it('should handle style returned from a function', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      function test() {
        return style({
          color: 'red'
        });
      }
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      function test() {
        return style({
          color: 'red'
        }, "test");
      }"
    `);
  });

  it('should handle globalStyle', () => {
    const source = `
      import { globalStyle } from '@vanilla-extract/css';

      globalStyle('html, body', { margin: 0 });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { globalStyle } from '@vanilla-extract/css';
      globalStyle('html, body', {
        margin: 0
      });"
    `);
  });

  it('should handle createVar assigned to const', () => {
    const source = `
      import { createVar } from '@vanilla-extract/css';

      const myVar = createVar();
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { createVar } from '@vanilla-extract/css';
      const myVar = createVar("myVar");"
    `);
  });

  it('should handle createContainer assigned to const', () => {
    const source = `
      import { createContainer } from '@vanilla-extract/css';

      const myContainer = createContainer();
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { createContainer } from '@vanilla-extract/css';
      const myContainer = createContainer("myContainer");"
    `);
  });

  it('should handle fontFace assigned to const', () => {
    const source = `
      import { fontFace } from '@vanilla-extract/css';

      const myFont = fontFace({
        src: 'local("Comic Sans MS")',
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { fontFace } from '@vanilla-extract/css';
      const myFont = fontFace({
        src: 'local("Comic Sans MS")'
      }, "myFont");"
    `);
  });

  it('should handle globalFontFace', () => {
    const source = `
      import { globalFontFace } from '@vanilla-extract/css';

      globalFontFace('myFont', {
        src: 'local("Comic Sans MS")',
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { globalFontFace } from '@vanilla-extract/css';
      globalFontFace('myFont', {
        src: 'local("Comic Sans MS")'
      });"
    `);
  });

  it('should handle keyframes assigned to const', () => {
    const source = `
      import { keyframes } from '@vanilla-extract/css';

      const myAnimation = keyframes({
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { keyframes } from '@vanilla-extract/css';
      const myAnimation = keyframes({
        from: {
          transform: 'rotate(0deg)'
        },
        to: {
          transform: 'rotate(360deg)'
        }
      }, "myAnimation");"
    `);
  });

  it('should handle global keyframes', () => {
    const source = `
      import { globalKeyframes } from '@vanilla-extract/css';

      globalKeyframes('myKeyframes', {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { globalKeyframes } from '@vanilla-extract/css';
      globalKeyframes('myKeyframes', {
        from: {
          transform: 'rotate(0deg)'
        },
        to: {
          transform: 'rotate(360deg)'
        }
      });"
    `);
  });

  it('should handle createTheme assigned to const', () => {
    const source = `
      import { createTheme } from '@vanilla-extract/css';

      const darkTheme = createTheme({}, {});
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { createTheme } from '@vanilla-extract/css';
      const darkTheme = createTheme({}, {}, "darkTheme");"
    `);
  });

  it('should handle createTheme using destructuring', () => {
    const source = `
      import { createTheme } from '@vanilla-extract/css';

      const [theme, vars] = createTheme({}, {});
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { createTheme } from '@vanilla-extract/css';
      const [theme, vars] = createTheme({}, {}, "theme");"
    `);
  });

  it('should handle createTheme using destructuring when already compiled', () => {
    const source = `
      import { createTheme } from '@vanilla-extract/css';

      var _createTheme = createTheme({}),
        _createTheme2 = _slicedToArray(_createTheme, 2),
        myThemeClass = _createTheme2[0],
        vars = _createTheme2[1];
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { createTheme } from '@vanilla-extract/css';
      var _createTheme = createTheme({}, "myThemeClass"),
        _createTheme2 = _slicedToArray(_createTheme, 2),
        myThemeClass = _createTheme2[0],
        vars = _createTheme2[1];"
    `);
  });

  it('should handle createGlobalTheme', () => {
    const source = `
      import { createGlobalTheme } from '@vanilla-extract/css';

      const vars = createGlobalTheme(':root', { foo: 'bar' });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { createGlobalTheme } from '@vanilla-extract/css';
      const vars = createGlobalTheme(':root', {
        foo: 'bar'
      });"
    `);
  });

  it('should handle createThemeContract', () => {
    const source = `
      import { createThemeContract } from '@vanilla-extract/css';

      const vars = createThemeContract({
        foo: 'bar'
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { createThemeContract } from '@vanilla-extract/css';
      const vars = createThemeContract({
        foo: 'bar'
      });"
    `);
  });

  it('should handle recipe assigned to const', () => {
    const source = `
      import { recipe } from '@vanilla-extract/recipes';

      const button = recipe({});
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { recipe } from '@vanilla-extract/recipes';
      const button = recipe({}, "button");"
    `);
  });

  it('should ignore functions that already supply a debug name', () => {
    const source = `
      import { style, styleVariants } from '@vanilla-extract/css';

      const three = style({
        testStyle: {
          zIndex: 2,
        }
      }, 'myDebugValue');

      const four = styleVariants({
        red: { color: 'red' }
      }, 'myDebugValue');

      const fourTemplate = styleVariants({
        red: { color: 'red' }
      }, \`myDebugValue_\${i}\`);
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style, styleVariants } from '@vanilla-extract/css';
      const three = style({
        testStyle: {
          zIndex: 2
        }
      }, 'myDebugValue');
      const four = styleVariants({
        red: {
          color: 'red'
        }
      }, 'myDebugValue');
      const fourTemplate = styleVariants({
        red: {
          color: 'red'
        }
      }, \`myDebugValue_\${i}\`);"
    `);
  });

  it('should only apply debug ids to functions imported from the relevant package', () => {
    const source = `
      import { style } from 'some-other-package';

      const three = style({
        zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from 'some-other-package';
      const three = style({
        zIndex: 2
      });"
    `);
  });

  it('should handle renaming imports', () => {
    const source = `
      import { style as specialStyle } from '@vanilla-extract/css';

      const four = specialStyle({
        zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style as specialStyle } from '@vanilla-extract/css';
      const four = specialStyle({
        zIndex: 2
      }, "four");"
    `);
  });

  it('should handle anonymous style in arrays', () => {
    const source = `
       import { style } from '@vanilla-extract/css';

       export const height = [
        style({
          zIndex: 2,
        })
      ];
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      export const height = [style({
        zIndex: 2
      }, "height")];"
    `);
  });

  it('should handle object key with anonymous style in arrays', () => {
    const source = `
       import { style } from '@vanilla-extract/css';

       export const height = {
        full: [style({
          zIndex: 2,
        })]
       };
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      export const height = {
        full: [style({
          zIndex: 2
        }, "height_full")]
      };"
    `);
  });

  it('should handle namespace imports', () => {
    const source = `
      import * as css from '@vanilla-extract/css';

      const one = css.style({
          zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import * as css from '@vanilla-extract/css';
      const one = css.style({
        zIndex: 2
      }, "one");"
    `);
  });

  it('should handle nested call expressions', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const one = instrument(style({
        zIndex: 1,
      }));

      const two = instrument(instrument(style({
        zIndex: 2,
      })));

      const three = instrument(instrument(instrument(style({
        zIndex: 3,
      }))));
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      const one = instrument(style({
        zIndex: 1
      }, "one"));
      const two = instrument(instrument(style({
        zIndex: 2
      }, "two")));
      const three = instrument(instrument(instrument(style({
        zIndex: 3
      }, "three"))));"
    `);
  });

  it('should handle instrumentation via sequence expresions', () => {
    const source = `
      import { style } from '@vanilla-extract/css';

      const one = (something++, style({
        zIndex: 1,
      }));
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { style } from '@vanilla-extract/css';
      const one = (something++, style({
        zIndex: 1
      }, "one"));"
    `);
  });
});
