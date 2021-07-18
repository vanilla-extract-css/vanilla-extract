import {
  createTheme,
  createThemeContract,
  createGlobalTheme,
} from '@vanilla-extract/css';

const vars = createThemeContract({
  shouldSupportNull: null,
  shouldSupportString: '',
});

createGlobalTheme(':root', vars, {
  shouldSupportNull: 'some-value',
  shouldSupportString: 'some-value',
});

createTheme(vars, {
  shouldSupportNull: 'some-value',
  shouldSupportString: 'some-value',
});
