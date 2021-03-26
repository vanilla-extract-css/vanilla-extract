import { onEndFileScope } from './adapter';

let refCounter = 0;

const fileScopes: Array<string> = [];

export function setFileScope(newFileScope: string) {
  refCounter = 0;
  fileScopes.unshift(newFileScope);
}

export function endFileScope() {
  onEndFileScope(getFileScope());
  refCounter = 0;
  fileScopes.splice(0, 1);
}

export function getFileScope() {
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
