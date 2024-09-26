import { appendCss } from './adapter';
import { getFileScope } from './fileScope';
import { generateIdentifier } from './identifier';
import { CSSViewTransition } from './types';

// createViewTransition is used for locally scoping CSS view transitions
// For now it is mostly just an alias of generateIdentifier
export const createViewTransition = (debugId?: string) =>
  generateIdentifier(debugId);

export function viewTransition(rule: CSSViewTransition) {
  appendCss({ type: 'view-transition', rule }, getFileScope());
}
