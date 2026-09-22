import { createGlobalThemeContract } from '@vanilla-extract/css';

export const contract = createGlobalThemeContract({
  color: {
    primary: 'global-token',
  },
});
