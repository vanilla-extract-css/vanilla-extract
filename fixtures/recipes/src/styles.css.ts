import { style, createThemeContract, createTheme } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const vars = createThemeContract({
  bg: null,
  fg: null,
});

const calm = createTheme(vars, {
  bg: 'powderblue',
  fg: 'white',
});

const angry = createTheme(vars, {
  bg: 'crimson',
  fg: 'black',
});

export const reset = style({
  border: 0,
});

export const button = recipe(
  {
    base: [
      reset,
      {
        borderRadius: '6px',
        background: vars.bg,
        color: vars.fg,
        transition: 'all 0.2s ease',

        ':hover': {
          transform: 'translateY(-3px)',
        },
      },
    ],

    variants: {
      size: {
        small: {
          fontSize: '16px',
          lineHeight: '24px',
        },
        standard: {
          fontSize: '24px',
          lineHeight: '40px',
        },
      },
      tone: {
        calm,
        angry: [
          angry,
          {
            ':hover': {
              boxShadow: '0 10px 6px -6px #777',
            },
          },
        ],
      },
      bold: {
        true: {
          fontWeight: 'bold',
        },
      },
    },

    defaultVariants: {
      size: 'standard',
      tone: 'calm',
    },

    compoundVariants: [
      {
        variants: {
          size: 'small',
          bold: true,
        },
        style: {
          '@media': {
            'only screen and (min-width: 600px)': {
              border: '2px green solid',
            },
          },
        },
      },
    ],
  },
  'button',
);

export const stack = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  variants: {
    space: {
      medium: {
        gap: 20,
        '@media': {
          'only screen and (min-width: 600px)': {
            gap: 30,
          },
        },
      },
    },
  },

  defaultVariants: {
    space: 'medium',
  },
});
