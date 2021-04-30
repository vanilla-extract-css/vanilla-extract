import { globalStyle, style } from '@vanilla-extract/css';
import { darkMode, lightMode } from '../system/styles/atoms.css';
import { vars } from '../themes.css';

export const root = style({
  selectors: {
    [`.${lightMode} &`]: {
      borderLeft: `${vars.border.width.large} solid ${vars.palette.blue400}`,
    },
    [`.${darkMode} &`]: {
      borderLeft: `${vars.border.width.large} solid ${vars.palette.gray600}`,
    },
  },
});

globalStyle(`.${darkMode} ${root} code`, {
  background: vars.palette.gray600,
  color: 'inherit',
});
globalStyle(`.${lightMode} ${root} code`, {
  background: vars.palette.blue200,
  color: 'inherit',
});
