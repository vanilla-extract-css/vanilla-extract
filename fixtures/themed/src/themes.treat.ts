import { defineVars, setFileScope } from '@treat/core';

setFileScope('themes');

export const theme = defineVars({
  colors: {
    background: 'blue',
    text: 'white',
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
  },
});

export const altTheme = theme.alternate({
  colors: {
    background: 'green',
  },
  space: {
    1: '8px',
    2: '12px',
    3: '16px',
  },
});
