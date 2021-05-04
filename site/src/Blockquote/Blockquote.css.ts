import { globalStyle, style, createVar } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/atoms.css';
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
        [borderColorVar]: vars.palette.gray600,
      },
    },
  },
});

globalStyle(`${root} code`, {
  background: vars.palette.blue200,
  color: 'inherit',
});

globalStyle(`.${darkMode} ${root} code`, {
  background: vars.palette.gray600,
  color: 'inherit',
});
