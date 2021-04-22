import hash from '@emotion/hash';

import { getAndIncrementRefCount, getFileScope } from './fileScope';

function getShortFileName() {
  const { filePath } = getFileScope();

  const matches = filePath.match(/.*\/(.*)\..*\..*$/);

  if (matches && matches[1]) {
    return matches[1];
  }

  return '';
}

export function generateIdentifier(debugId: string | undefined) {
  // Convert ref count to base 36 for optimal hash lengths
  const refCount = getAndIncrementRefCount();
  const { filePath, packageName } = getFileScope();
  const fileScopeHash = hash(
    packageName ? `${packageName}${filePath}` : filePath,
  );

  const identifier =
    process.env.NODE_ENV !== 'production' && debugId
      ? `${getShortFileName()}_${debugId}__${refCount}${fileScopeHash}`
      : `${refCount}${fileScopeHash}`;

  return identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
}
