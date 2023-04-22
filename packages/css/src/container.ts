import { generateIdentifier } from './identifier';

// createContainer is used for local scoping of CSS containers
// For now it is mostly just an alias of generateIdentifier
export const createContainer = (debugId?: string) =>
  generateIdentifier(debugId);

export const createContainer$ = createContainer;
