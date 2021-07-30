import dedent from 'dedent';
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
      dedent`
        Styles were unable to be assigned to a file. This is generally caused by one of the following:

        - You may have created styles outside of a '.css.ts' context
        - You may have incorrect configuration. See https://vanilla-extract.style/documentation/setup
      `,
    );
  }

  return fileScopes[0];
}

export function getAndIncrementRefCounter() {
  return refCounter++;
}
