import { transformCss } from './transformCss';

describe('transformCss', () => {
  it('should handle media queries', () => {
    expect(
      transformCss({
        selector: '.testClass',
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
      }),
    ).toMatchInlineSnapshot(`
      Object {
        ".testClass": Object {
          "color": "red",
        },
        "@media screen and (min-width: 1000px)": Object {
          ".testClass": Object {
            "color": "purple",
          },
        },
        "@media screen and (min-width: 700px)": Object {
          ".testClass": Object {
            "color": "green",
          },
        },
      }
    `);
  });

  it('should remove irrelevant media queries', () => {
    expect(
      transformCss({
        selector: '.testClass',
        rule: {
          color: 'red',
          '@media': {
            'screen and (min-width: 700px)': {
              color: 'red',
            },
          },
        },
      }),
    ).toMatchInlineSnapshot(`
                            Object {
                              ".testClass": Object {
                                "color": "red",
                              },
                            }
                `);
  });

  it('should combine media queries', () => {
    expect(
      transformCss(
        {
          selector: '.testClass',
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
      ),
    ).toMatchInlineSnapshot(`
            Object {
              ".otherClass": Object {
                "color": "purple",
              },
              ".testClass": Object {
                "color": "green",
              },
              "@media screen and (min-width: 700px)": Object {
                ".otherClass": Object {
                  "color": "red",
                },
                ".testClass": Object {
                  "color": "red",
                },
              },
            }
        `);
  });

  it('should handle simple pseudos', () => {
    expect(
      transformCss({
        selector: '.testClass',
        rule: {
          color: 'red',
          ':hover': {
            color: 'blue',
          },
        },
      }),
    ).toMatchInlineSnapshot(`
                          Object {
                            ".testClass": Object {
                              "color": "red",
                            },
                            ".testClass:hover": Object {
                              "color": "blue",
                            },
                          }
                `);
  });

  it('should honour input order for simple pseudos', () => {
    expect(
      Object.entries(
        transformCss({
          selector: '.testClass',
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
        }),
      ),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          ".testClass",
          Object {
            "color": "red",
          },
        ],
        Array [
          ".testClass:link",
          Object {
            "color": "orange",
          },
        ],
        Array [
          ".testClass:visited",
          Object {
            "color": "yellow",
          },
        ],
        Array [
          ".testClass:hover",
          Object {
            "color": "green",
          },
        ],
        Array [
          ".testClass:active",
          Object {
            "color": "blue",
          },
        ],
      ]
    `);
  });

  it('should handle complex selectors', () => {
    expect(
      transformCss({
        selector: '.testClass',
        rule: {
          color: 'red',
          selectors: {
            '&:nth-child(3)': {
              color: 'blue',
            },
          },
        },
      }),
    ).toMatchInlineSnapshot(`
                        Object {
                          ".testClass": Object {
                            "color": "red",
                          },
                          ".testClass:nth-child(3)": Object {
                            "color": "blue",
                          },
                        }
                `);
  });

  it('should handle complex selectors within media queries', () => {
    expect(
      transformCss({
        selector: '.testClass',
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
      }),
    ).toMatchInlineSnapshot(`
      Object {
        ".testClass": Object {
          "color": "red",
        },
        "@media screen and (min-width: 700px)": Object {
          ".testClass": Object {},
          ".testClass:nth-child(3)": Object {
            "color": "blue",
          },
        },
      }
    `);
  });

  it('should handle @supports queries', () => {
    expect(
      transformCss({
        selector: '.testClass',
        rule: {
          display: 'flex',
          '@supports': {
            '(display: grid)': {
              display: 'grid',
            },
          },
        },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        ".testClass": Object {
          "display": "flex",
        },
        "@supports (display: grid)": Object {
          ".testClass": Object {
            "display": "grid",
          },
        },
      }
    `);
  });

  it('should handle nested @supports and @media queries', () => {
    expect(
      transformCss({
        selector: '.testClass',
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
      }),
    ).toMatchInlineSnapshot(`
      Object {
        ".testClass": Object {
          "display": "flex",
        },
        "@media screen and (min-width: 700px)": Object {
          ".testClass": Object {
            "color": "green",
          },
          "@supports (display: grid)": Object {
            ".testClass": Object {
              "borderColor": "blue",
              "display": "grid",
            },
          },
        },
        "@supports (display: grid)": Object {
          ".testClass": Object {
            "backgroundColor": "yellow",
          },
        },
      }
    `);
  });

  it('should handle @supports negation queries', () => {
    expect(
      transformCss({
        selector: '.testClass',
        rule: {
          display: 'grid',
          '@supports': {
            'not (display: grid)': {
              display: 'flex',
            },
          },
        },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        ".testClass": Object {
          "display": "grid",
        },
        "@supports not (display: grid)": Object {
          ".testClass": Object {
            "display": "flex",
          },
        },
      }
    `);
  });

  it('should handle animations', () => {
    expect(
      transformCss({
        selector: '.testClass',
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
      }),
    ).toMatchInlineSnapshot(`
      Object {
        ".testClass": Object {
          "animation": undefined,
          "animationDuration": "3s",
          "animationFillMode": "both",
          "animationName": "ru4hw5",
          "animationTimingFunction": "linear",
        },
        "@keyframes ru4hw5": Object {
          "from": Object {
            "opacity": 0,
          },
          "to": Object {
            "opacity": 1,
          },
        },
      }
    `);
  });
});
