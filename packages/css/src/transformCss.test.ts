import { createVar } from './vars';
import { transformCss } from './transformCss';

import { setFileScope, endFileScope } from './fileScope';

setFileScope('test');

const testVar = createVar();

describe('transformCss', () => {
  it('should escape class names', () => {
    expect(
      transformCss({
        localClassNames: ['test_1/2_className'],
        cssObjs: [
          {
            type: 'local',
            selector: 'test_1/2_className',
            rule: {
              color: 'red',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'green',
                },
                'screen and (min-width: 1000px)': {
                  color: 'purple',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".test_1\\\\/2_className {
        color: red;
      }
      @media screen and (min-width: 700px) {
        .test_1\\\\/2_className {
          color: green;
        }
      }
      @media screen and (min-width: 1000px) {
        .test_1\\\\/2_className {
          color: purple;
        }
      }"
    `);
  });

  it('should handle media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'red',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'green',
                },
                'screen and (min-width: 1000px)': {
                  color: 'purple',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: red;
      }
      @media screen and (min-width: 700px) {
        .testClass {
          color: green;
        }
      }
      @media screen and (min-width: 1000px) {
        .testClass {
          color: purple;
        }
      }"
    `);
  });

  it('should handle media queries inside selectors', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'red',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'yellow',
                },
                'screen and (min-width: 1000px)': {
                  color: 'green',
                },
              },
              selectors: {
                'body &': {
                  '@media': {
                    'screen and (min-width: 700px)': {
                      color: 'green',
                    },
                    'screen and (min-width: 1000px)': {
                      color: 'purple',
                    },
                  },
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: red;
      }
      @media screen and (min-width: 700px) {
        .testClass {
          color: yellow;
        }
        body .testClass {
          color: green;
        }
      }
      @media screen and (min-width: 1000px) {
        .testClass {
          color: green;
        }
        body .testClass {
          color: purple;
        }
      }"
    `);
  });

  it('should remove irrelevant media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'red',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'red',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: red;
      }"
    `);
  });

  it('should combine media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'green',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'red',
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.otherClass',
            rule: {
              color: 'purple',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'red',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: green;
      }
      .otherClass {
        color: purple;
      }
      @media screen and (min-width: 700px) {
        .testClass {
          color: red;
        }
        .otherClass {
          color: red;
        }
      }"
    `);
  });

  it('should handle simple pseudos', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'red',
              ':hover': {
                color: 'blue',
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: red;
      }
      .testClass:hover {
        color: blue;
      }"
    `);
  });

  it('should handle property fallbacks', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: ['red', 'blue'],
              ':hover': {
                color: ['blue', 'red', 'yellow'],
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: red;
        color: blue;
      }
      .testClass:hover {
        color: blue;
        color: red;
        color: yellow;
      }"
    `);
  });

  it('should dashify properties but leave custom properties', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              backgroundColor: 'green',
              WebkitAlignContent: 'end',
              vars: {
                '--myCustomVar': '10px',
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        --myCustomVar: 10px;
        background-color: green;
        -webkit-align-content: end;
      }"
    `);
  });

  it('should handle simple pseudos within conditionals', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              '@media': {
                'screen and (min-width: 500px)': {
                  color: 'red',
                  ':hover': {
                    color: 'blue',
                  },
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "@media screen and (min-width: 500px) {
        .testClass {
          color: red;
        }
        .testClass:hover {
          color: blue;
        }
      }"
    `);
  });

  it('should honour input order for simple pseudos', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'red',
              ':link': {
                color: 'orange',
              },
              ':visited': {
                color: 'yellow',
              },
              ':hover': {
                color: 'green',
              },
              ':active': {
                color: 'blue',
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: red;
      }
      .testClass:link {
        color: orange;
      }
      .testClass:visited {
        color: yellow;
      }
      .testClass:hover {
        color: green;
      }
      .testClass:active {
        color: blue;
      }"
    `);
  });

  it('should handle complex selectors', () => {
    expect(
      transformCss({
        localClassNames: ['testClass', 'parentClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'red',
              selectors: {
                '&:nth-child(3)': {
                  color: 'blue',
                },
                'parentClass > div > span ~ &.someGlobalClass:hover': {
                  background: 'green',
                },
                'parentClass&': {
                  background: 'black',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: red;
      }
      .testClass:nth-child(3) {
        color: blue;
      }
      .parentClass > div > span ~ .testClass.someGlobalClass:hover {
        background: green;
      }
      .parentClass.testClass {
        background: black;
      }"
    `);
  });

  it('should handle complex selectors within media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'red',
              '@media': {
                'screen and (min-width: 700px)': {
                  selectors: {
                    '&:nth-child(3)': {
                      color: 'blue',
                    },
                  },
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: red;
      }
      @media screen and (min-width: 700px) {
        .testClass:nth-child(3) {
          color: blue;
        }
      }"
    `);
  });

  it('should handle @supports queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              display: 'flex',
              '@supports': {
                '(display: grid)': {
                  display: 'grid',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        display: flex;
      }
      @supports (display: grid) {
        .testClass {
          display: grid;
        }
      }"
    `);
  });

  it('should handle nested @supports and @media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              display: 'flex',
              '@supports': {
                '(display: grid)': {
                  backgroundColor: 'yellow',
                  '@media': {
                    'screen and (min-width: 700px)': {
                      display: 'grid',
                    },
                  },
                },
              },
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'green',
                  '@supports': {
                    '(display: grid)': {
                      borderColor: 'blue',
                    },
                  },
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        display: flex;
      }
      @media screen and (min-width: 700px) {
        .testClass {
          color: green;
        }
        @supports (display: grid) {
          .testClass {
            border-color: blue;
            display: grid;
          }
        }
      }
      @supports (display: grid) {
        .testClass {
          background-color: yellow;
        }
      }"
    `);
  });

  it('should handle @supports negation queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              display: 'grid',
              '@supports': {
                'not (display: grid)': {
                  display: 'flex',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        display: grid;
      }
      @supports not (display: grid) {
        .testClass {
          display: flex;
        }
      }"
    `);
  });

  it('should handle animations', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'keyframes',
            name: 'myAnimation',
            rule: {
              from: {
                opacity: 0,
              },
              to: {
                opacity: 1,
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "@keyframes myAnimation {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }"
    `);
  });

  it('should handle font face', () => {
    expect(
      transformCss({
        localClassNames: [],
        cssObjs: [
          {
            type: 'fontFace',
            rule: {
              src: 'local("Comic Sans MS")',
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "@font-face {
        src: local(\\"Comic Sans MS\\");
      }"
    `);
  });

  it('should handle multiple font faces', () => {
    expect(
      transformCss({
        localClassNames: [],
        cssObjs: [
          {
            type: 'fontFace',
            rule: {
              fontFamily: 'MyFont1',
              src: 'local("Comic Sans MS")',
            },
          },
          {
            type: 'fontFace',
            rule: {
              fontFamily: 'MyFont2',
              src: 'local("Impact")',
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "@font-face {
        font-family: MyFont1;
        src: local(\\"Comic Sans MS\\");
      }
      @font-face {
        font-family: MyFont2;
        src: local(\\"Impact\\");
      }"
    `);
  });

  it('should not create empty rules', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'green',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      "@media screen and (min-width: 700px) {
        .testClass {
          color: green;
        }
      }"
    `);
  });

  it('should lower all conditionals styles', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'hotpink',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'green',
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.otherClass',
            rule: {
              color: 'indigo',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'red',
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.otherOtherClass',
            rule: {
              color: 'lightcyan',
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        color: hotpink;
      }
      .otherClass {
        color: indigo;
      }
      .otherOtherClass {
        color: lightcyan;
      }
      @media screen and (min-width: 700px) {
        .testClass {
          color: green;
        }
        .otherClass {
          color: red;
        }
      }"
    `);
  });

  it('should handle css vars', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              display: 'block',
              vars: {
                '--my-var': 'red',
                [testVar]: 'green',
              },
              selectors: {
                '&:nth-child(3)': {
                  vars: {
                    '--my-var': 'orange',
                    [testVar]: 'black',
                  },
                },
              },
              '@media': {
                'screen and (min-width: 700px)': {
                  vars: {
                    '--my-var': 'yellow',
                    [testVar]: 'blue',
                  },
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        --my-var: red;
        --askkcyc: green;
        display: block;
      }
      .testClass:nth-child(3) {
        --my-var: orange;
        --askkcyc: black;
      }
      @media screen and (min-width: 700px) {
        .testClass {
          --my-var: yellow;
          --askkcyc: blue;
        }
      }"
    `);
  });

  it('should cast property values to pixels when relevant', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              display: 'block',
              paddingTop: 10,
              lineHeight: 20,
              vars: {
                '--my-var': '12',
                [testVar]: '24',
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass {
        --my-var: 12;
        --askkcyc: 24;
        display: block;
        padding-top: 10px;
        line-height: 20;
      }"
    `);
  });

  it('should allow valid global styles', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'global',
            selector: 'testClass > div',
            rule: {
              color: 'red',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'blue',
                },
              },
              '@supports': {
                'not (display: grid)': {
                  display: 'flex',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      ".testClass > div {
        color: red;
      }
      @media screen and (min-width: 700px) {
        .testClass > div {
          color: blue;
        }
      }
      @supports not (display: grid) {
        .testClass > div {
          display: flex;
        }
      }"
    `);
  });

  it('should not allow simple psuedos on global styles', () => {
    expect(() =>
      transformCss({
        localClassNames: [],
        cssObjs: [
          {
            type: 'global',
            selector: 'div',
            rule: {
              // @ts-expect-error
              ':hover': {
                color: 'red',
              },
            },
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Simple pseudos are not valid in \\"globalStyle\\""`,
    );
  });

  it('should not allow selectors on global styles', () => {
    expect(() =>
      transformCss({
        localClassNames: [],
        cssObjs: [
          {
            type: 'global',
            selector: 'div',
            rule: {
              // @ts-expect-error
              selectors: {
                '& > span': {
                  color: 'red',
                },
              },
            },
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Selectors are not allowed within \\"globalStyle\\""`,
    );
  });
});

endFileScope();
