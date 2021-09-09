import { style, createThemeContract, createTheme } from '@vanilla-extract/css';
import { createPattern } from '@vanilla-extract/frosted';

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

export const button = createPattern(
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
          height: '24px',
        },
        standard: {
          fontSize: '24px',
          height: '40px',
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
    },

    defaultVariants: {
      size: 'standard',
      tone: 'calm',
    },

    compoundVariants: [
      {
        size: 'small',
        tone: 'calm',
        style: {
          border: '2px green solid',
        },
      },
    ],
  },
  'button',
);

export const stack = createPattern({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  variants: {
    space: {
      medium: {
        gap: 20,
      },
    },
  },

  defaultVariants: {
    space: 'medium',
  },
});
