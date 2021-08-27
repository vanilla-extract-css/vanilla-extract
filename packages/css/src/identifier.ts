import hash from '@emotion/hash';

import { getIdentType } from './adapter';
import { getAndIncrementRefCounter, getFileScope } from './fileScope';

function getDevPrefix(debugId: string | undefined) {
  const parts = debugId ? [debugId] : [];
  const { filePath } = getFileScope();

  const matches = filePath.match(
    /(?<dir>[^\/\\]*)?[\/\\]?(?<file>[^\/\\]*)\.css\.(ts|js|tsx|jsx)$/,
  );

  if (matches && matches.groups) {
    const { dir, file } = matches.groups;
    parts.unshift(file && file !== 'index' ? file : dir);
  }

  return parts.join('_');
}

export function generateIdentifier(debugId: string | undefined) {
  // Convert ref count to base 36 for optimal hash lengths
  const refCount = getAndIncrementRefCounter().toString(36);
  const { filePath, packageName } = getFileScope();

  const fileScopeHash = hash(
    packageName ? `${packageName}${filePath}` : filePath,
  );

  let identifier = `${fileScopeHash}${refCount}`;

  if (getIdentType() === 'debug') {
    const devPrefix = getDevPrefix(debugId);

    if (devPrefix) {
      identifier = `${devPrefix}__${identifier}`;
    }
  }

  return identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
}
