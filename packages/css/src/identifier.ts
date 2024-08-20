import hash from '@emotion/hash';

import { getIdentOption } from './adapter';
import { getAndIncrementRefCounter, getFileScope } from './fileScope';
import { getFileAndDirFromPath } from './getFileAndDirFromPath';

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

    const fileAndDir = getFileAndDirFromPath(filePath);

    if (fileAndDir) {
      const { dir, file } = fileAndDir;
      const part = (file !== 'index' ? file : dir) || file;
      parts.unshift(part);
    }
  }

  return parts.join('_');
}

function normalizeIdentifier(identifier: string) {
  return identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
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
  const identOption = getIdentOption();
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

  if (identOption === 'debug') {
    const devPrefix = getDevPrefix({ debugId, debugFileName });

    if (devPrefix) {
      identifier = `${devPrefix}__${identifier}`;
    }

    return normalizeIdentifier(identifier);
  }
  if (typeof identOption === 'function') {
    identifier = identOption({
      hash: identifier,
      debugId,
      filePath,
      packageName,
    });

    if (!identifier.match(/^[A-Z_][0-9A-Z_-]+$/i)) {
      throw new Error(
        `Identifier function returned invalid indentifier: "${identifier}"`,
      );
    }

    return identifier;
  }

  return normalizeIdentifier(identifier);
}
