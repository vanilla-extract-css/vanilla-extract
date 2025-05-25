import dedent from 'dedent';
import { onBeginFileScope, onEndFileScope } from './adapter';
import type { FileScope } from './types';

let refCounter = 0;

const fileScopes: Array<FileScope> = [];

export function setFileScope(filePath: string, packageName?: string): void {
  refCounter = 0;
  const fileScope = {
    filePath,
    packageName,
  };
  fileScopes.unshift(fileScope);
  onBeginFileScope(fileScope);
}

export function endFileScope(): void {
  onEndFileScope(getFileScope());
  refCounter = 0;
  fileScopes.splice(0, 1);
}

export function hasFileScope(): boolean {
  return fileScopes.length > 0;
}

export function getFileScope(): FileScope {
  if (fileScopes.length === 0) {
    throw new Error(
      dedent`
        Styles were unable to be assigned to a file. This is generally caused by one of the following:

        - You may have created styles outside of a '.css.ts' context
        - You may have incorrect configuration. See https://vanilla-extract.style/documentation/getting-started
      `,
    );
  }

  return fileScopes[0];
}

export function getAndIncrementRefCounter(): number {
  return refCounter++;
}
