import * as babel from '@babel/core';
import vanillaBabelPlugin from '@vanilla-extract/babel-plugin-split-file';
import generate from '@babel/generator';
// @ts-expect-error
import typescriptSyntax from '@babel/plugin-syntax-typescript';
// @ts-expect-error
import jsxSyntax from '@babel/plugin-syntax-jsx';

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

export const transform = async ({
  source,
  filePath,
  rootPath,
  packageName,
  identOption,
  globalAdapterIdentifier,
}: TransformParams): Promise<{ buildtime: string; runtime: string }> => {
  const store: any = {
    statementSourceMap: new Map(),
    buildTimeStatements: [],
  };

  const result = await babel.transformAsync(source, {
    filename: filePath,
    cwd: rootPath,
    plugins: [
      [vanillaBabelPlugin, { store }],
      [typescriptSyntax, { isTSX: true }],
      jsxSyntax,
    ],
    configFile: false,
  });

  if (!result || result.code == null) {
    throw new Error('Error transforming file');
  }

  const program = babel.types.program(store.buildTimeStatements);
  const buildtime = addFileScope({
    source: generate(
      program,
      { comments: false, sourceMaps: true, sourceFileName: filePath },
      source,
    ).code,
    filePath,
    rootPath,
    packageName,
    globalAdapterIdentifier,
  });

  return {
    buildtime,
    runtime: result.code,
  };
};
