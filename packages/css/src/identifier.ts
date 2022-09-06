import hash from '@emotion/hash';

import { getIdentOption } from './adapter';
import { getAndIncrementRefCounter, getFileScope } from './fileScope';

function getDevPrefix({
  debugId,
  debugFileName,
}: {
  debugId?: string;
  debugFileName: boolean;
}) {
  const parts = debugId ? [debugId.replace(/\s/g, '_')] : [];

  if (debugFileName) {
    const { filePath } = getFileScope();

    const matches = filePath.match(
      /(?<dir>[^\/\\]*)?[\/\\]?(?<file>[^\/\\]*)\.css\.(ts|js|tsx|jsx|cjs|mjs)$/,
    );

    if (matches && matches.groups) {
      const { dir, file } = matches.groups;
      parts.unshift(file && file !== 'index' ? file : dir);
    }
  }

  return parts.join('_');
}

interface GenerateIdentifierOptions {
  debugId?: string;
  debugFileName?: boolean;
}

export function generateIdentifier(debugId?: string): string;
export function generateIdentifier(options?: GenerateIdentifierOptions): string;
export function generateIdentifier(
  arg?: string | GenerateIdentifierOptions,
): string {
  const { debugId, debugFileName = true } = {
    ...(typeof arg === 'string' ? { debugId: arg } : null),
    ...(typeof arg === 'object' ? arg : null),
  };

  // Convert ref count to base 36 for optimal hash lengths
  const refCount = getAndIncrementRefCounter().toString(36);
  const { filePath, packageName } = getFileScope();

  const fileScopeHash = hash(
    packageName ? `${packageName}${filePath}` : filePath,
  );

  let identifier = `${fileScopeHash}${refCount}`;

  if (getIdentOption() === 'debug') {
    const devPrefix = getDevPrefix({ debugId, debugFileName });

    if (devPrefix) {
      identifier = `${devPrefix}__${identifier}`;
    }
  }

  return identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
}
