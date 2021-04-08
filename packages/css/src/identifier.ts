import hash from '@emotion/hash';

import { getAndIncrementRefCounter, getFileScope } from './fileScope';

function getShortFileName() {
  const { filePath } = getFileScope();

  const matches = filePath.match(/.*\/(.*)\..*\..*$/);

  if (matches && matches[1]) {
    return matches[1];
  }

  return '';
}

export function generateIdentifier(debugId: string | undefined) {
  const refCount = getAndIncrementRefCounter();
  const { filePath, packageName } = getFileScope();
  const fileScopeHash = hash(
    packageName ? `${packageName}${filePath}` : filePath,
  );

  const identifier =
    process.env.NODE_ENV !== 'production' && debugId
      ? `${getShortFileName()}_${debugId}__${fileScopeHash}${refCount}`
      : `${fileScopeHash}${refCount}`;

  return identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
}
