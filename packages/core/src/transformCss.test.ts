import cssesc from 'cssesc';

import { createVar } from './api';
import { transformCss } from './transformCss';

expect.addSnapshotSerializer({
  test: () => true,
  serialize: (val, config, indentation, depth, refs, printer) => {
    if (typeof val === 'object') {
      return Object.entries(val)
        .map(([selector, rule]) => {
          const indent = [...new Array(depth)]
            .map(() => config.indent)
            .join('');

          if (typeof rule === 'object') {
            return `${indent}"${selector}": {\n${printer(
              rule,
              config,
              indentation,
              depth + 1,
              refs,
            )}\n${indent}}`;
          }

          return `${indent}"${selector}": ${rule}`;
        })
        .join('\n');
    }

    return val;
  },
});

describe('transformCss', () => {
  it('should escape class names', () => {
    expect(
      transformCss({
        localClassNames: ['test_1/2_className'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".test_1\\/2_className": {
        "color": red
      }
      "@media screen and (min-width: 700px)": {
        ".test_1\\/2_className": {
          "color": green
        }
      }
      "@media screen and (min-width: 1000px)": {
        ".test_1\\/2_className": {
          "color": purple
        }
      }
    `);
  });

  it('should handle media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "color": red
      }
      "@media screen and (min-width: 700px)": {
        ".testClass": {
          "color": green
        }
      }
      "@media screen and (min-width: 1000px)": {
        ".testClass": {
          "color": purple
        }
      }
    `);
  });

  it('should remove irrelevant media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "color": red
      }
    `);
  });

  it('should combine media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "color": green
      }
      ".otherClass": {
        "color": purple
      }
      "@media screen and (min-width: 700px)": {
        ".testClass": {
          "color": red
        }
        ".otherClass": {
          "color": red
        }
      }
    `);
  });

  it('should handle simple pseudos', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            selector: 'testClass',
            rule: {
              color: 'red',
              ':hover': {
                color: 'blue',
              },
            },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "color": red
      }
      ".testClass:hover": {
        "color": blue
      }
    `);
  });

  it('should handle simple pseudos within conditionals', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      "@media screen and (min-width: 500px)": {
        ".testClass": {
          "color": red
        }
        ".testClass:hover": {
          "color": blue
        }
      }
    `);
  });

  it('should honour input order for simple pseudos', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "color": red
      }
      ".testClass:link": {
        "color": orange
      }
      ".testClass:visited": {
        "color": yellow
      }
      ".testClass:hover": {
        "color": green
      }
      ".testClass:active": {
        "color": blue
      }
    `);
  });

  it('should handle complex selectors', () => {
    expect(
      transformCss({
        localClassNames: ['testClass', 'parentClass'],
        cssObjs: [
          {
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
              },
            },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "color": red
      }
      ".testClass:nth-child(3)": {
        "color": blue
      }
      ".parentClass > div > span ~ .testClass.someGlobalClass:hover": {
        "background": green
      }
    `);
  });

  it('should handle complex selectors within media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "color": red
      }
      "@media screen and (min-width: 700px)": {
        ".testClass:nth-child(3)": {
          "color": blue
        }
      }
    `);
  });

  it('should handle @supports queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "display": flex
      }
      "@supports (display: grid)": {
        ".testClass": {
          "display": grid
        }
      }
    `);
  });

  it('should handle nested @supports and @media queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "display": flex
      }
      "@media screen and (min-width: 700px)": {
        ".testClass": {
          "color": green
        }
        "@supports (display: grid)": {
          ".testClass": {
            "borderColor": blue
            "display": grid
          }
        }
      }
      "@supports (display: grid)": {
        ".testClass": {
          "backgroundColor": yellow
        }
      }
    `);
  });

  it('should handle @supports negation queries', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "display": grid
      }
      "@supports not (display: grid)": {
        ".testClass": {
          "display": flex
        }
      }
    `);
  });

  it('should handle animations', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
            selector: 'testClass',
            rule: {
              animationTimingFunction: 'linear',
              animationDuration: '3s',
              animationFillMode: 'both',
              '@keyframes': {
                from: {
                  opacity: 0,
                },
                to: {
                  opacity: 1,
                },
              },
            },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      "@keyframes ru4hw5": {
        "from": {
          "opacity": 0
        }
        "to": {
          "opacity": 1
        }
      }
      ".testClass": {
        "animationTimingFunction": linear
        "animationDuration": 3s
        "animationFillMode": both
        "animation": undefined
        "animationName": ru4hw5
      }
    `);
  });

  it('should not create empty rules', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      "@media screen and (min-width: 700px)": {
        ".testClass": {
          "color": green
        }
      }
    `);
  });

  it('should lower all conditionals styles', () => {
    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
            selector: '.otherOtherClass',
            rule: {
              color: 'lightcyan',
            },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "color": hotpink
      }
      ".otherClass": {
        "color": indigo
      }
      ".otherOtherClass": {
        "color": lightcyan
      }
      "@media screen and (min-width: 700px)": {
        ".testClass": {
          "color": green
        }
        ".otherClass": {
          "color": red
        }
      }
    `);
  });

  it('should handle css vars', () => {
    const testVar = createVar();

    expect(
      transformCss({
        localClassNames: ['testClass'],
        cssObjs: [
          {
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
      }),
    ).toMatchInlineSnapshot(`
      ".testClass": {
        "--my-var": red
        "--_17rw2mr0": green
        "display": block
      }
      ".testClass:nth-child(3)": {
        "--my-var": orange
        "--_17rw2mr0": black
      }
      "@media screen and (min-width: 700px)": {
        ".testClass": {
          "--my-var": yellow
          "--_17rw2mr0": blue
        }
      }
    `);
  });
});
