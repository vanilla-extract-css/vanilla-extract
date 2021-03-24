import hash from '@emotion/hash';

import { getAndIncrementRefCounter, getFileScope } from './fileScope';

function getShortFileName() {
  const fileScope = getFileScope();

  const matches = fileScope.match(/.*\/(.*)\..*\..*$/);

  if (matches && matches[1]) {
    return matches[1];
  }

  return '';
}

export function generateIdentifier(debugId: string | undefined) {
  const refCount = getAndIncrementRefCounter();

  const identifier =
    process.env.NODE_ENV !== 'production' && debugId
      ? `${getShortFileName()}_${debugId}__${hash(getFileScope())}${refCount}`
      : `${hash(getFileScope())}${refCount}`;

  return identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
}
