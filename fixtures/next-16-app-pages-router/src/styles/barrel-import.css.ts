import { style } from '@vanilla-extract/css';
// this import would normally crash during evaluation because it pulls in next apis
// but our stubs prevent the AsyncLocalStorage error
import { colors, spacing } from './barrel-with-next';

export const container = style({
  backgroundColor: colors.primary,
  padding: spacing.md,
});

export const header = style({
  color: colors.secondary,
  marginBottom: spacing.lg,
});
