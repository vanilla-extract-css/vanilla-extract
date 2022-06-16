import { style, globalStyle } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';

export const root = style({
  overflowX: 'auto',
});

const tokenSelector = ({
  darkMode,
  tokens,
}: {
  darkMode?: string;
  tokens: Array<string>;
}) =>
  tokens
    .map((t) => `${darkMode ? `.${darkMode} ` : ''}${root} .${t}`)
    .join(', ');

globalStyle(`${root} code`, {
  fontFamily: vars.fonts.code,
  padding: 0,
  margin: 0,
});

globalStyle(tokenSelector({ tokens: ['comment'] }), {
  color: vars.palette.coolGray500,
});
globalStyle(tokenSelector({ tokens: ['keyword', 'selector'] }), {
  color: vars.palette.blue200,
});
globalStyle(tokenSelector({ tokens: ['string'] }), {
  color: vars.palette.green200,
});
globalStyle(
  tokenSelector({ tokens: ['function', 'property', 'number', 'unit'] }),
  {
    color: vars.palette.pink300,
  },
);
globalStyle(tokenSelector({ tokens: ['tag'] }), {
  color: vars.palette.pink200,
});
globalStyle(tokenSelector({ tokens: ['attr-name'] }), {
  color: vars.palette.pink100,
});
globalStyle(tokenSelector({ tokens: ['punctuation', 'operator'] }), {
  color: vars.palette.coolGray400,
});

globalStyle(tokenSelector({ darkMode, tokens: ['comment'] }), {
  color: vars.palette.gray500,
});
globalStyle(tokenSelector({ darkMode, tokens: ['keyword', 'selector'] }), {
  color: vars.palette.blue300,
});
globalStyle(tokenSelector({ darkMode, tokens: ['string'] }), {
  color: vars.palette.green300,
});
globalStyle(
  tokenSelector({
    darkMode,
    tokens: ['function', 'property', 'number', 'unit'],
  }),
  {
    color: vars.palette.pink400,
  },
);
globalStyle(
  tokenSelector({ darkMode: darkMode, tokens: ['punctuation', 'operator'] }),
  {
    color: vars.palette.gray400,
  },
);

export const theme = {
  'pre[class*="language-"]': {
    whiteSpace: 'pre',
    margin: 0,
  },
};
