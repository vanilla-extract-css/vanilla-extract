import { onEndFileScope } from './adapter';
import type { FileScope } from './types';

let refCounter = 0;

const fileScopes: Array<FileScope> = [];

export function setFileScope(filePath: string, packageName?: string) {
  refCounter = 0;
  fileScopes.unshift({
    filePath,
    packageName,
  });
}

export function endFileScope() {
  onEndFileScope(getFileScope());
  refCounter = 0;
  fileScopes.splice(0, 1);
}

export function getFileScope(): FileScope {
  if (fileScopes.length === 0) {
    throw new Error(
      'New styles cannot be registered dynamically after initial boot. This is to ensure that styles are statically extractible.',
    );
  }

  return fileScopes[0];
}

const startingCharCode = 'a'.charCodeAt(0);

export function refCountToAlpha(number: number) {
  let n = number + 1;
  let returnValue = '';

  while (n > 0) {
    const offset = (n - 1) % 26;
    returnValue = String.fromCharCode(startingCharCode + offset) + returnValue;
    n = ((n - offset) / 26) | 0;
  }

  return returnValue;
}

export function getAndIncrementRefCounter() {
  const alpha = refCountToAlpha(refCounter);
  refCounter++;

  return alpha;
}
