import ts from 'dedent';

const css = ts;

export interface CodeSample {
  fileName: string;
  language?: string;
  contents: string;
  errors?: string[];
}

export const codeSamples = {
  hero: {
    fileName: 'styles.css.ts',
    errors: ['brandd', 'large'],
    contents: ts`
      import { createTheme, style } from '@vanilla-extract/css';

      export const [themeClass, vars] = createTheme({
        color: {
          brand: 'blue',
          white: '#fff'
        },
        space: {
          small: '4px',
          medium: '8px',
        }
      });

      export const hero = style({
        backgroundColor: vars.color.brandd,
        color: vars.color.white,
        padding: vars.space.large
      });
    `,
  },
  fullPower: {
    fileName: 'styles.css.ts',
    contents: ts`
      import { style } from '@vanilla-extract/css';

      export const className = style({
        display: 'flex',
        flexDirection: 'column',
        selectors: {
          '&:nth-child(2n)': {
            background: 'aliceblue'
          }
        },
        '@media': {
          'screen and (min-width: 768px)': {
            flexDirection: 'row'
          }
        }
      });
    `,
  },
  theming: {
    fileName: 'styles.css.ts',
    errors: ['brandd'],
    contents: ts`
      import { createTheme, style } from '@vanilla-extract/css';

      export const [themeClass, vars] = createTheme({
        color: {
          brand: 'aquamarine',
          accent: 'honeydew',
        },
      });

      export const brandedSection = style({
        backgroundColor: vars.color.brandd,
      });
    `,
  },
  variables: {
    fileName: 'styles.css.ts',
    contents: ts`
      import { style, createVar } from '@vanilla-extract/css';

      const shadowColor = createVar();

      export const shadow = style({
        boxShadow: ${'`0 0 10px ${shadowColor}`'},
        selectors: {
          '.light &': {
            vars: { [shadowColor]: 'black' }
          },
          '.dark &': {
            vars: { [shadowColor]: 'white' }
          },
        },
      });
    `,
  },
  variants: {
    fileName: 'styles.css.ts',
    contents: ts`
      import { styleVariants } from '@vanilla-extract/css';

      export const background = styleVariants({
        primary: { background: 'navy' },
        secondary: { background: 'blue' },
        tertiary: { background: 'aqua' },
      });

      export const color = styleVariants({
        neutral: { color: 'black' },
        secondary: { color: 'gray' },
        link: { color: 'blue' },
      });
    `,
  },
  output: {
    fileName: 'output.css',
    language: 'css',
    contents: css`
      :root {
        --space-none__ya5b7b0: 0;
        --space-small__ya5b7b1: 4px;
        --space-medium__ya5b7b2: 8px;
        --space-large__ya5b7b3: 12px;
      }

      .Hero_container__1ldw6lo0 {
        padding: var(--space-medium__ya5b7b2);
      }
    `,
  },
} satisfies Record<string, CodeSample>;
