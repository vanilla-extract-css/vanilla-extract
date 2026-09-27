import * as babel from '@babel/core';
import vanillaBabelPlugin, {
  mightHaveDebuggableCalls,
} from '@vanilla-extract/babel-plugin-debug-ids';
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

  // Skip the Babel pass entirely when the source provably contains no calls
  // the debug-ids plugin could touch (e.g. files using only `globalStyle`).
  // This avoids parsing + regenerating large generated stylesheets for nothing
  // — and sidesteps Babel's ">500KB" code-generator deopt on such files.
  if (identOption === 'debug' && mightHaveDebuggableCalls(source)) {
    const result = babel.transformSync(source, {
      filename: filePath,
      cwd: rootPath,
      plugins: [vanillaBabelPlugin, typescriptSyntax],
      configFile: false,
      babelrc: false,
    });

    if (!result || result.code == null) {
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

  // See `transformSync` above — same no-op-Babel bail-out.
  if (identOption === 'debug' && mightHaveDebuggableCalls(source)) {
    const result = await babel.transformAsync(source, {
      filename: filePath,
      cwd: rootPath,
      plugins: [vanillaBabelPlugin, typescriptSyntax],
      configFile: false,
      babelrc: false,
    });

    if (!result || result.code == null) {
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
