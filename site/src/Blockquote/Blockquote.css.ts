import { globalStyle, style, createVar } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';

const borderColorVar = createVar();

export const root = style({
  vars: {
    [borderColorVar]: vars.palette.blue400,
  },
  borderLeft: `${vars.border.width.large} solid ${borderColorVar}`,
  selectors: {
    [`.${darkMode} &`]: {
      vars: {
        [borderColorVar]: vars.palette.gray700,
      },
    },
  },
});

globalStyle(`${root} code, ${root} a`, {
  background: vars.palette.blue200,
  color: 'inherit',
});

globalStyle(`.${darkMode} ${root} code, .${darkMode} ${root} a`, {
  background: vars.palette.gray700,
  color: 'inherit',
});
