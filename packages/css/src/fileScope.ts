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

export function getAndIncrementRefCounter() {
  return refCounter++;
}
