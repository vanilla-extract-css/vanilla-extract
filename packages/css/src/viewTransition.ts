import { generateIdentifier } from './identifier';

// createViewTransition is used for locally scoping CSS view transitions
export const createViewTransition = (name: string, debugId?: string) => {
  const ident = generateIdentifier(debugId);
  return `${ident}.${name}`;
}
