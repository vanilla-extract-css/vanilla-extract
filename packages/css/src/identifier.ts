import hash from '@emotion/hash';

import { getIdentOption } from './adapter';
import { getAndIncrementRefCounter, getFileScope } from './fileScope';

function getDevPrefix(debugId: string | undefined) {
  const parts = debugId ? [debugId.replace(/\s/g, '_')] : [];
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

function generateShortIdentifier(scope: string, index: number) {
  // Convert ref count to base 36 for optimal hash lengths
  const refCountStr = index.toString(36);
  const fileScopeHash = hash(scope);
  return `${fileScopeHash}${refCountStr}`;
}

function generateDebugIdentifier(
  scope: string,
  index: number,
  debugId: string | undefined,
) {
  let identifier = generateShortIdentifier(scope, index);
  const devPrefix = getDevPrefix(debugId);
  if (devPrefix) {
    identifier = `${devPrefix}__${identifier}`;
  }
  return identifier;
}

export function generateIdentifier(debugId: string | undefined) {
  const refCount = getAndIncrementRefCounter();
  const { filePath, packageName } = getFileScope();
  const fileScopeStr = packageName ? `${packageName}${filePath}` : filePath;
  const opt = getIdentOption();

  let identifier: string;
  if (opt === 'short') {
    identifier = generateShortIdentifier(fileScopeStr, refCount);
    identifier = identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
  } else if (opt === 'debug') {
    identifier = generateDebugIdentifier(fileScopeStr, refCount, debugId);
    identifier = identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
  } else {
    identifier = opt(fileScopeStr, refCount, debugId);

    if (!identifier.match(/^[A-Z_][0-9A-Z_]+$/i)) {
      throw new Error(`Identifier function returned invalid indentifier: "${identifier}"`);
    }
  }

  return identifier;
}
