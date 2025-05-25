import { generateIdentifier } from './identifier';

// createViewTransition is used for locally scoping CSS view transitions
// For now it is mostly just an alias of generateIdentifier
export const createViewTransition = (debugId?: string): string =>
  generateIdentifier(debugId);
