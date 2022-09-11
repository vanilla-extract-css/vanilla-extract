import fileURLToPath from 'file-uri-to-path';
import outdent from 'outdent';

import { getProjectRoot, onEndFileScope } from './adapter';
import { relativePath } from './relativePath';
import type { FileScope } from './types';

let refCounter = 0;

const fileScopes: Array<FileScope> = [];

export function setFileScope(fileScopePath: string, packageName?: string) {
  let filePath = fileScopePath;

  try {
    filePath = fileURLToPath(fileScopePath);
  } catch (e) {
    // If fileURLToPath failed then fileScope is already a valid path
  }

  const projectRoot = getProjectRoot();

  if (projectRoot) {
    filePath = relativePath(projectRoot, filePath);
  }

  refCounter = 0;
  fileScopes.unshift({
    // Remove extra extensions
    filePath: filePath.replace(/\.[^.]*$/, ''),
    packageName,
  });
}

export function endFileScope() {
  onEndFileScope(getFileScope());
  refCounter = 0;
  fileScopes.splice(0, 1);
}

export function hasFileScope() {
  return fileScopes.length > 0;
}

export function getFileScope(): FileScope {
  if (fileScopes.length === 0) {
    throw new Error(
      outdent`
        Styles were unable to be assigned to a file. This is generally caused by one of the following:

        - You may have created styles outside of a '.css.ts' context
        - You may have incorrect configuration. See https://vanilla-extract.style/documentation/getting-started
      `,
    );
  }

  return fileScopes[0];
}

export function getAndIncrementRefCounter() {
  return refCounter++;
}
