import {
  createTheme,
  createThemeContract,
  createGlobalTheme,
} from '@vanilla-extract/css';

const vars = createThemeContract({
  shouldSupportNull: null,
  shouldSupportNestedNull: {
    nested: null,
  },
  shouldSupportString: '',
  shouldSupportNestedString: {
    nested: '',
  },
});

createGlobalTheme(':root', vars, {
  shouldSupportNull: 'some-value',
  shouldSupportNestedNull: { nested: 'some-value' },
  shouldSupportString: 'some-value',
  shouldSupportNestedString: { nested: 'some-value' },
});

createTheme(vars, {
  shouldSupportNull: 'some-value',
  shouldSupportNestedNull: { nested: 'some-value' },
  shouldSupportString: 'some-value',
  shouldSupportNestedString: { nested: 'some-value' },
});
