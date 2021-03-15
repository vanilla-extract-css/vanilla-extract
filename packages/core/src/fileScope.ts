let refCounter = 0;

const defaultFileScope = 'DEFAULT_FILE_SCOPE';
const fileScopes = [defaultFileScope];

export function setFileScope(newFileScope: string) {
  refCounter = 0;
  fileScopes.unshift(newFileScope);
}

export function endFileScope() {
  refCounter = 0;
  fileScopes.splice(0, 1);
}

export function getFileScope() {
  return fileScopes[0];
}

export function getAndIncrementRefCounter() {
  return refCounter++;
}
