import * as babel from '@babel/core';
import vanillaBabelPlugin from '@vanilla-extract/babel-plugin-debug-ids';
// @ts-expect-error
import typescriptSyntax from '@babel/plugin-syntax-typescript';

import { addFileScope } from './addFileScope';
import type { IdentifierOption } from './types';

interface TransformParams {
  source: string;
  filePath: string;
  rootPath: string;
  packageName: string;
  identOption: IdentifierOption;
  globalAdapterIdentifier?: string;
}
export const transformSync = ({
  source,
  filePath,
  rootPath,
  packageName,
  identOption,
}: TransformParams): string => {
  let code = source;

  if (identOption === 'debug') {
    const result = babel.transformSync(source, {
      filename: filePath,
      cwd: rootPath,
      plugins: [vanillaBabelPlugin, typescriptSyntax],
      configFile: false,
    });

    if (!result || !result.code) {
      throw new Error('Error adding debug IDs');
    }

    code = result.code;
  }

  return addFileScope({
    source: code,
    filePath,
    rootPath,
    packageName,
  });
};

export const transform = async ({
  source,
  filePath,
  rootPath,
  packageName,
  identOption,
  globalAdapterIdentifier,
}: TransformParams): Promise<string> => {
  let code = source;

  if (identOption === 'debug') {
    const result = await babel.transformAsync(source, {
      filename: filePath,
      cwd: rootPath,
      plugins: [vanillaBabelPlugin, typescriptSyntax],
      configFile: false,
    });

    if (!result || !result.code) {
      throw new Error('Error adding debug IDs');
    }

    code = result.code;
  }

  return addFileScope({
    source: code,
    filePath,
    rootPath,
    packageName,
    globalAdapterIdentifier,
  });
};
