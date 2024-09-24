import { setFileScope, endFileScope } from './fileScope';
import { createVar } from './vars';
import { transformCss } from './transformCss';
import { style } from './style';

setFileScope('test');

const testVar = createVar();
const style1 = style({});
const style2 = style({});

// remove quotes around the snapshot
expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) => (val as string).trim(),
});

describe('transformCss', () => {
  it('should escape class names', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['test_1/2_className', '[test_with_brackets]'],
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
          {
            type: 'local',
            selector: '[test_with_brackets]',
            rule: {
              color: 'blue',
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .test_1\\/2_className {
        color: red;
      }
      .\\[test_with_brackets\\] {
        color: blue;
      }
      @media screen and (min-width: 700px) {
        .test_1\\/2_className {
          color: green;
        }
      }
      @media screen and (min-width: 1000px) {
        .test_1\\/2_className {
          color: purple;
        }
      }
    `);
  });

  it('should handle media queries', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
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
      }
    `);
  });

  it('should handle media queries inside selectors', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
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
      }
    `);
  });

  it('should merge media queries', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'green',
              '@media': {
                'screen and (min-width: 1000px)': {
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
          {
            type: 'local',
            selector: '.otherOtherClass',
            rule: {
              color: 'purple',
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'green',
                },
                'screen and (min-width: 1000px)': {
                  color: 'yellow',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass {
        color: green;
      }
      .otherClass {
        color: purple;
      }
      .otherOtherClass {
        color: purple;
      }
      @media screen and (min-width: 700px) {
        .otherClass {
          color: red;
        }
        .otherOtherClass {
          color: green;
        }
      }
      @media screen and (min-width: 1000px) {
        .testClass {
          color: red;
        }
        .otherOtherClass {
          color: yellow;
        }
      }
    `);
  });

  it('should not merge media queries if not safe to do so', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              '@media': {
                'screen and (min-width: 1000px)': {
                  color: 'red',
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.otherClass',
            rule: {
              '@media': {
                'screen and (min-width: 700px)': {
                  color: 'yellow',
                },
                'screen and (min-width: 1000px)': {
                  color: 'purple',
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.otherOtherClass',
            rule: {
              '@media': {
                'screen and (min-width: 600px)': {
                  color: 'yellow',
                },
                'screen and (min-width: 1000px)': {
                  color: 'purple',
                },
                'screen and (min-width: 700px)': {
                  color: 'purple',
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.otherOtherOtherClass',
            rule: {
              '@media': {
                'screen and (min-width: 600px)': {
                  color: 'yellow',
                },
                'screen and (min-width: 700px)': {
                  color: 'purple',
                },
                'screen and (min-width: 1700px)': {
                  color: 'purple',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @media screen and (min-width: 700px) {
        .otherClass {
          color: yellow;
        }
      }
      @media screen and (min-width: 1000px) {
        .testClass {
          color: red;
        }
        .otherClass {
          color: purple;
        }
      }
      @media screen and (min-width: 600px) {
        .otherOtherClass {
          color: yellow;
        }
        .otherOtherOtherClass {
          color: yellow;
        }
      }
      @media screen and (min-width: 1000px) {
        .otherOtherClass {
          color: purple;
        }
      }
      @media screen and (min-width: 700px) {
        .otherOtherClass {
          color: purple;
        }
        .otherOtherOtherClass {
          color: purple;
        }
      }
      @media screen and (min-width: 1700px) {
        .otherOtherOtherClass {
          color: purple;
        }
      }
    `);
  });

  it('should not merge nested media queries if not safe to do so', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              '@supports': {
                '(display: grid)': {
                  '@media': {
                    'screen and (min-width: 1000px)': {
                      color: 'red',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.otherClass',
            rule: {
              '@supports': {
                '(display: grid)': {
                  '@media': {
                    'screen and (min-width: 700px)': {
                      color: 'yellow',
                    },
                    'screen and (min-width: 1000px)': {
                      color: 'purple',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.otherOtherClass',
            rule: {
              '@supports': {
                '(display: grid)': {
                  '@media': {
                    'screen and (min-width: 600px)': {
                      color: 'yellow',
                    },
                    'screen and (min-width: 1000px)': {
                      color: 'purple',
                    },
                    'screen and (min-width: 700px)': {
                      color: 'purple',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.otherOtherOtherClass',
            rule: {
              '@supports': {
                '(display: grid)': {
                  '@media': {
                    'screen and (min-width: 600px)': {
                      color: 'yellow',
                    },
                    'screen and (min-width: 700px)': {
                      color: 'purple',
                    },
                    'screen and (min-width: 1700px)': {
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
      @supports (display: grid) {
        @media screen and (min-width: 700px) {
          .otherClass {
            color: yellow;
          }
        }
        @media screen and (min-width: 1000px) {
          .testClass {
            color: red;
          }
          .otherClass {
            color: purple;
          }
        }
      }
      @supports (display: grid) {
        @media screen and (min-width: 600px) {
          .otherOtherClass {
            color: yellow;
          }
          .otherOtherOtherClass {
            color: yellow;
          }
        }
        @media screen and (min-width: 1000px) {
          .otherOtherClass {
            color: purple;
          }
        }
        @media screen and (min-width: 700px) {
          .otherOtherClass {
            color: purple;
          }
          .otherOtherOtherClass {
            color: purple;
          }
        }
        @media screen and (min-width: 1700px) {
          .otherOtherOtherClass {
            color: purple;
          }
        }
      }
    `);
  });

  it('should merge nested media queries if safe to do so', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              '@media': {
                'screen and (min-width: 1024px)': {
                  padding: '50px',
                },
              },
            },
          },

          {
            type: 'local',
            selector: '.otherClass',
            rule: {
              '@media': {
                'screen and (min-width: 1200px)': {
                  color: 'red',
                },
              },
            },
          },

          {
            type: 'local',
            selector: '.otherOtherClass',
            rule: {
              '@media': {
                'screen and (min-width: 768px)': {
                  background: 'blue',
                },

                'screen and (min-width: 1024px)': {
                  background: 'green',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @media screen and (min-width: 768px) {
        .otherOtherClass {
          background: blue;
        }
      }
      @media screen and (min-width: 1024px) {
        .testClass {
          padding: 50px;
        }
        .otherOtherClass {
          background: green;
        }
      }
      @media screen and (min-width: 1200px) {
        .otherClass {
          color: red;
        }
      }
    `);
  });

  it('should merge declarations with the same selector when merging conditional rules', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: [],
        cssObjs: [
          {
            type: 'local',
            selector: '.testClass',
            rule: {
              '@layer': {
                myLayer: {
                  color: 'red',
                },
              },
            },
          },
          {
            type: 'local',
            selector: '.testClass',
            rule: {
              '@layer': {
                myLayer: {
                  fontSize: '32px',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @layer myLayer;
      @layer myLayer {
        .testClass {
          color: red;
          font-size: 32px;
        }
      }
    `);
  });

  it('should handle simple pseudos', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
        color: red;
      }
      .testClass:hover {
        color: blue;
      }
    `);
  });

  it('should handle property fallbacks', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
        color: red;
        color: blue;
      }
      .testClass:hover {
        color: blue;
        color: red;
        color: yellow;
      }
    `);
  });

  it('should dashify properties but leave custom properties', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
        --myCustomVar: 10px;
        background-color: green;
        -webkit-align-content: end;
      }
    `);
  });

  it('should handle blank content', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              content: '',
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass {
        content: "";
      }
    `);
  });

  it('should add quotes to custom content values', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              content: 'hello',
              selectors: {
                '&': { content: 'there' },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass {
        content: "hello";
      }
      .testClass {
        content: "there";
      }
    `);
  });

  it('should handle content with fallbacks', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              content: ['hello', 'there'],
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass {
        content: "hello";
        content: "there";
      }
    `);
  });

  it('should not add quotes to content that already has quotes', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              content: "'hello there'",
              selectors: {
                '&': { content: '"hello there"' },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass {
        content: 'hello there';
      }
      .testClass {
        content: "hello there";
      }
    `);
  });

  it('should not add quotes to meaningful content values (examples from mdn: https://developer.mozilla.org/en-US/docs/Web/CSS/content)', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              content: 'normal',
              selectors: {
                '._01 &': { content: 'none' },
                '._02 &': { content: 'url("http://www.example.com/test.png")' },
                '._03 &': { content: 'linear-gradient(#e66465, #9198e5)' },
                '._04 &': {
                  content: 'image-set("image1x.png" 1x, "image2x.png" 2x)',
                },
                '._05 &': {
                  content:
                    'url("http://www.example.com/test.png") / "This is the alt text"',
                },
                '._06 &': { content: '"prefix"' },
                '._07 &': { content: 'counter(chapter_counter)' },
                '._08 &': { content: 'counter(chapter_counter, upper-roman)' },
                '._09 &': { content: 'counters(section_counter, ".")' },
                '._10 &': {
                  content:
                    'counters(section_counter, ".", decimal-leading-zero)',
                },
                '._11 &': { content: 'attr(value string)' },
                '._12 &': { content: 'open-quote' },
                '._13 &': { content: 'close-quote' },
                '._14 &': { content: 'no-open-quote' },
                '._15 &': { content: 'no-close-quote' },
                '._16 &': { content: 'open-quote counter(chapter_counter)' },
                '._17 &': { content: 'inherit' },
                '._18 &': { content: 'initial' },
                '._19 &': { content: 'revert' },
                '._20 &': { content: 'unset' },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass {
        content: normal;
      }
      ._01 .testClass {
        content: none;
      }
      ._02 .testClass {
        content: url("http://www.example.com/test.png");
      }
      ._03 .testClass {
        content: linear-gradient(#e66465, #9198e5);
      }
      ._04 .testClass {
        content: image-set("image1x.png" 1x, "image2x.png" 2x);
      }
      ._05 .testClass {
        content: url("http://www.example.com/test.png") / "This is the alt text";
      }
      ._06 .testClass {
        content: "prefix";
      }
      ._07 .testClass {
        content: counter(chapter_counter);
      }
      ._08 .testClass {
        content: counter(chapter_counter, upper-roman);
      }
      ._09 .testClass {
        content: counters(section_counter, ".");
      }
      ._10 .testClass {
        content: counters(section_counter, ".", decimal-leading-zero);
      }
      ._11 .testClass {
        content: attr(value string);
      }
      ._12 .testClass {
        content: open-quote;
      }
      ._13 .testClass {
        content: close-quote;
      }
      ._14 .testClass {
        content: no-open-quote;
      }
      ._15 .testClass {
        content: no-close-quote;
      }
      ._16 .testClass {
        content: open-quote counter(chapter_counter);
      }
      ._17 .testClass {
        content: inherit;
      }
      ._18 .testClass {
        content: initial;
      }
      ._19 .testClass {
        content: revert;
      }
      ._20 .testClass {
        content: unset;
      }
    `);
  });

  it('should handle simple pseudos within conditionals', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      @media screen and (min-width: 500px) {
        .testClass {
          color: red;
        }
        .testClass:hover {
          color: blue;
        }
      }
    `);
  });

  it('should honour input order for simple pseudos', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
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
      }
    `);
  });

  it('should handle complex selectors', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
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
      }
    `);
  });

  it('should handle getter selectors', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass', 'parentClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              color: 'red',
              get selectors() {
                return {
                  '&:nth-child(3)': {
                    color: 'blue',
                  },
                  'parentClass > div > span ~ &.someGlobalClass:hover': {
                    background: 'green',
                  },
                  'parentClass&': {
                    background: 'black',
                  },
                };
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass {
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
      }
    `);
  });

  it('should handle complex selectors within media queries', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
        color: red;
      }
      @media screen and (min-width: 700px) {
        .testClass:nth-child(3) {
          color: blue;
        }
      }
    `);
  });

  it('should handle @supports queries', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
        display: flex;
      }
      @supports (display: grid) {
        .testClass {
          display: grid;
        }
      }
    `);
  });

  it('should handle @container queries', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              display: 'flex',
              containerName: 'sidebar',
              '@container': {
                'sidebar (min-width: 700px)': {
                  display: 'grid',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass {
        display: flex;
        container-name: sidebar;
      }
      @container sidebar (min-width: 700px) {
        .testClass {
          display: grid;
        }
      }
    `);
  });

  it('should handle @layer declarations', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'layer',
            name: 'reset',
          },
          {
            type: 'layer',
            name: 'foo.bar.baz',
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @layer reset;
      @layer foo.bar.baz;
    `);
  });

  it('should hoist @layer declarations', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              display: 'flex',
              '@layer': {
                layer1: {
                  display: 'grid',
                },
              },
            },
          },
          {
            type: 'layer',
            name: 'layer1',
          },
          {
            type: 'layer',
            name: 'layer2',
          },
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              display: 'flex',
              '@layer': {
                layer2: {
                  display: 'grid',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @layer layer1;
      @layer layer2;
      .testClass {
        display: flex;
      }
      .testClass {
        display: flex;
      }
      @layer layer1 {
        .testClass {
          display: grid;
        }
      }
      @layer layer2 {
        .testClass {
          display: grid;
        }
      }
    `);
  });

  it('should handle conditional declaration of layers', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['link', 'pink'],
        cssObjs: [
          { type: 'layer', name: 'lib' },
          { type: 'layer', name: 'lib.base' },
          {
            type: 'global',
            selector: 'a',
            rule: {
              '@media': {
                'screen and (min-width: 600px)': {
                  '@layer': {
                    'lib.typography': {
                      color: 'green',
                    },
                  },
                },
              },
              '@layer': {
                'lib.base': {
                  fontWeight: 800,
                  color: 'red',
                },
              },
            },
          },
          {
            type: 'local',
            selector: 'link',
            rule: {
              '@layer': {
                'lib.base': {
                  color: 'blue',
                },
              },
            },
          },
          { type: 'layer', name: 'lib.utilities' },
          {
            type: 'local',
            selector: 'pink',
            rule: {
              '@layer': {
                'lib.utilities': {
                  color: 'hotpink',
                },
              },
            },
          },
          { type: 'layer', name: 'lib.typography' },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @layer lib;
      @layer lib.base;
      @media screen and (min-width: 600px) {
        @layer lib.typography;
      }
      @layer lib.utilities;
      @layer lib.typography;
      @layer lib.base {
        a {
          font-weight: 800;
          color: red;
        }
        .link {
          color: blue;
        }
      }
      @media screen and (min-width: 600px) {
        @layer lib.typography {
          a {
            color: green;
          }
        }
      }
      @layer lib.utilities {
        .pink {
          color: hotpink;
        }
      }
    `);
  });

  it('should merge styles from the same layer', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['link', 'pink'],
        cssObjs: [
          {
            type: 'global',
            selector: 'a',
            rule: {
              '@layer': {
                lib: {
                  fontWeight: 800,
                  color: 'red',
                  '@media': {
                    'screen and (min-width: 600px)': {
                      color: 'green',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'local',
            selector: 'link',
            rule: {
              '@layer': {
                lib: {
                  color: 'blue',
                },
              },
            },
          },
          {
            type: 'local',
            selector: 'pink',
            rule: {
              '@layer': {
                lib: {
                  color: 'hotpink',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @layer lib;
      @layer lib {
        a {
          font-weight: 800;
          color: red;
        }
        .link {
          color: blue;
        }
        .pink {
          color: hotpink;
        }
        @media screen and (min-width: 600px) {
          a {
            color: green;
          }
        }
      }
    `);
  });

  it('should bailout merging for nested layers', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass', 'otherTestClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              '@layer': {
                layerA: {
                  '@media': {
                    '(min-width: 700px)': {
                      display: 'grid',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'layer',
            name: 'layerA.layerA1',
          },
          {
            type: 'layer',
            name: 'layerA.layerA2',
          },
          {
            type: 'local',
            selector: 'otherTestClass',
            rule: {
              '@layer': {
                layerA: {
                  '@media': {
                    '(min-width: 700px)': {
                      '@layer': {
                        layerA2: {
                          display: 'block',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @layer layerA;
      @layer layerA.layerA1;
      @layer layerA.layerA2;
      @layer layerA {
        @media (min-width: 700px) {
          @layer layerA2;
        }
      }
      @layer layerA {
        @media (min-width: 700px) {
          .testClass {
            display: grid;
          }
          @layer layerA2 {
            .otherTestClass {
              display: block;
            }
          }
        }
      }
    `);
  });

  it('should handle @layer rules with complex selectors and simple pseudos', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              '@layer': {
                foo: {
                  ':hover': {
                    color: 'purple',
                  },
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
      @layer foo;
      @layer foo {
        .testClass:hover {
          color: purple;
        }
        .testClass:nth-child(3) {
          color: blue;
        }
      }
    `);
  });

  it('should handle nested @supports, @media and @container queries', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
                      '@container': {
                        'sidebar (min-width: 700px)': {
                          display: 'grid',
                        },
                      },
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
                      '@container': {
                        'sidebar (min-width: 700px)': {
                          display: 'grid',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass {
        display: flex;
      }
      @media screen and (min-width: 700px) {
        .testClass {
          color: green;
        }
        @supports (display: grid) {
          .testClass {
            border-color: blue;
          }
          @container sidebar (min-width: 700px) {
            .testClass {
              display: grid;
            }
          }
        }
      }
      @supports (display: grid) {
        .testClass {
          background-color: yellow;
        }
        @media screen and (min-width: 700px) {
          .testClass {
            display: grid;
          }
          @container sidebar (min-width: 700px) {
            .testClass {
              display: grid;
            }
          }
        }
      }
    `);
  });

  it('should merge nested @supports, @media and @container queries when safe to do so', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass', 'otherClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              '@media': {
                'screen and (min-width: 700px)': {
                  '@supports': {
                    '(display: grid)': {
                      borderColor: 'blue',
                      '@container': {
                        'sidebar (min-width: 700px)': {
                          display: 'grid',
                        },

                        'sidebar (min-width: 800px)': {
                          display: 'grid',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            type: 'local',
            selector: 'otherClass',
            rule: {
              '@media': {
                'screen and (min-width: 700px)': {
                  '@supports': {
                    '(display: grid)': {
                      borderColor: 'blue',
                      '@container': {
                        'sidebar (min-width: 700px)': {
                          display: 'grid',
                        },

                        'sidebar (min-width: 800px)': {
                          display: 'grid',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @media screen and (min-width: 700px) {
        @supports (display: grid) {
          .testClass {
            border-color: blue;
          }
          .otherClass {
            border-color: blue;
          }
          @container sidebar (min-width: 700px) {
            .testClass {
              display: grid;
            }
            .otherClass {
              display: grid;
            }
          }
          @container sidebar (min-width: 800px) {
            .testClass {
              display: grid;
            }
            .otherClass {
              display: grid;
            }
          }
        }
      }
    `);
  });

  it('should not merge nested @supports, @media and @container queries when not safe to do so', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass', 'otherClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              '@media': {
                'screen and (min-width: 700px)': {
                  '@supports': {
                    '(display: grid)': {
                      borderColor: 'blue',
                      '@container': {
                        'sidebar (min-width: 700px)': {
                          display: 'grid',
                        },

                        'sidebar (min-width: 800px)': {
                          display: 'grid',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            type: 'local',
            selector: 'otherClass',
            rule: {
              '@media': {
                'screen and (min-width: 700px)': {
                  '@supports': {
                    '(display: grid)': {
                      borderColor: 'blue',
                      '@container': {
                        'sidebar (min-width: 800px)': {
                          display: 'grid',
                        },

                        'sidebar (min-width: 700px)': {
                          display: 'grid',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @media screen and (min-width: 700px) {
        @supports (display: grid) {
          .testClass {
            border-color: blue;
          }
          @container sidebar (min-width: 700px) {
            .testClass {
              display: grid;
            }
          }
          @container sidebar (min-width: 800px) {
            .testClass {
              display: grid;
            }
          }
        }
      }
      @media screen and (min-width: 700px) {
        @supports (display: grid) {
          .otherClass {
            border-color: blue;
          }
          @container sidebar (min-width: 800px) {
            .otherClass {
              display: grid;
            }
          }
          @container sidebar (min-width: 700px) {
            .otherClass {
              display: grid;
            }
          }
        }
      }
    `);
  });

  it('should handle @supports negation queries', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
        display: grid;
      }
      @supports not (display: grid) {
        .testClass {
          display: flex;
        }
      }
    `);
  });

  it('should handle animations', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'keyframes',
            name: 'myAnimation',
            rule: {
              from: {
                opacity: 0,
                content: 'none',
                padding: 0,
              },
              to: {
                opacity: 1,
                content: 'foo',
                padding: 10,
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @keyframes myAnimation {
        from {
          content: none;
          opacity: 0;
          padding: 0;
        }
        to {
          content: "foo";
          opacity: 1;
          padding: 10px;
        }
      }
    `);
  });

  it('should handle font face', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      @font-face {
        src: local("Comic Sans MS");
      }
    `);
  });

  it('should handle multiple font faces of the same family', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: [],
        cssObjs: [
          {
            type: 'fontFace',
            rule: {
              fontFamily: 'MyFont',
              src: 'local("Helvetica")',
            },
          },
          {
            type: 'fontFace',
            rule: {
              fontFamily: 'MyFont',
              src: 'local("Helvetica-Bold")',
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      @font-face {
        font-family: MyFont;
        src: local("Helvetica");
      }
      @font-face {
        font-family: MyFont;
        src: local("Helvetica-Bold");
      }
    `);
  });

  it('should handle multiple font faces', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      @font-face {
        font-family: MyFont1;
        src: local("Comic Sans MS");
      }
      @font-face {
        font-family: MyFont2;
        src: local("Impact");
      }
    `);
  });

  it('should not create empty rules', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      @media screen and (min-width: 700px) {
        .testClass {
          color: green;
        }
      }
    `);
  });

  it('should lower all conditionals styles', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
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
      }
    `);
  });

  it('should handle css vars', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
        --my-var: red;
        --skkcyc0: green;
        display: block;
      }
      .testClass:nth-child(3) {
        --my-var: orange;
        --skkcyc0: black;
      }
      @media screen and (min-width: 700px) {
        .testClass {
          --my-var: yellow;
          --skkcyc0: blue;
        }
      }
    `);
  });

  it('should cast property values to pixels when relevant', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass {
        --my-var: 12;
        --skkcyc0: 24;
        display: block;
        padding-top: 10px;
        line-height: 20;
      }
    `);
  });

  it('should allow valid global styles', () => {
    expect(
      transformCss({
        composedClassLists: [],
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
      .testClass > div {
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
      }
    `);
  });

  it('should not allow simple pseudos on global styles', () => {
    expect(() =>
      transformCss({
        composedClassLists: [],
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
      `Simple pseudos are not valid in "globalStyle"`,
    );
  });

  it('should not allow selectors on global styles', () => {
    expect(() =>
      transformCss({
        composedClassLists: [],
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
      `Selectors are not allowed within "globalStyle"`,
    );
  });

  it('should map composed class lists into single identifiers', () => {
    const composedStyle1 = 'composedStyle1 pd-sm dblock border-red';
    const composedStyle2 = `composedStyle2 background-red ${composedStyle1}`;

    expect(
      transformCss({
        composedClassLists: [
          { identifier: 'composedStyle1', classList: composedStyle1 },
          {
            identifier: 'composedStyle2',
            classList: composedStyle2,
          },
        ],

        localClassNames: ['composedStyle1', 'composedStyle2'],
        cssObjs: [
          {
            type: 'local',
            selector: `${composedStyle1} button, body > ${composedStyle2}`,
            rule: {
              display: 'block',
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .composedStyle1 button, body > .composedStyle2 {
        display: block;
      }
    `);
  });

  it('should handle the pseudo-elements with params', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: ['testClass'],
        cssObjs: [
          {
            type: 'local',
            selector: 'testClass',
            rule: {
              selectors: {
                '&::part(external-wrapper)': {
                  display: 'block',
                },
                '&::slotted(span)': {
                  display: 'block',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .testClass::part(external-wrapper) {
        display: block;
      }
      .testClass::slotted(span) {
        display: block;
      }
    `);
  });

  it('should handle multiple references to the same locally scoped selector', () => {
    expect(
      transformCss({
        composedClassLists: [],
        localClassNames: [style1, style2, '_1g1ptzo1', '_1g1ptzo10'],
        cssObjs: [
          {
            type: 'local',
            selector: style1,
            rule: {
              selectors: {
                [`${style2} &:before, ${style2} &:after`]: {
                  background: 'black',
                },
                [`_1g1ptzo1_1g1ptzo10 ${style1}`]: {
                  background: 'blue',
                },
                [`_1g1ptzo10_1g1ptzo1 ${style1}`]: {
                  background: 'blue',
                },
              },
            },
          },
        ],
      }).join('\n'),
    ).toMatchInlineSnapshot(`
      .skkcyc2 .skkcyc1:before, .skkcyc2 .skkcyc1:after {
        background: black;
      }
      ._1g1ptzo1._1g1ptzo10 .skkcyc1 {
        background: blue;
      }
      ._1g1ptzo10._1g1ptzo1 .skkcyc1 {
        background: blue;
      }
    `);
  });
});

endFileScope();
