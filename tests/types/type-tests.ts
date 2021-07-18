import {
  createTheme,
  createThemeContract,
  createGlobalTheme,
} from '@vanilla-extract/css';

// @ts-expect-error
const markAsUsed = (...args: any[]) => {};

const vars = createThemeContract({
  shouldSupportNull: null,
  shouldSupportString: '',
});

createGlobalTheme(':root', vars, {
  shouldSupportNull: 'some-value',
  shouldSupportString: 'some-value',
});

const theme = createTheme(vars, {
  shouldSupportNull: 'some-value',
  shouldSupportString: 'some-value',
});

markAsUsed(theme);
