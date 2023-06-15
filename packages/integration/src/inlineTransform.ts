import assert from 'assert';

import * as babel from '@babel/core';
import generate from '@babel/generator';
// @ts-expect-error
import typescriptSyntax from '@babel/plugin-syntax-typescript';
// @ts-expect-error
import jsxSyntax from '@babel/plugin-syntax-jsx';
import vanillaDebugIdsBabelPlugin from '@vanilla-extract/babel-plugin-debug-ids';

import vanillaBabelPlugin from './babel-plugin-split-file/index.old';
import { addFileScope } from './addFileScope';
import type { IdentifierOption } from './types';
import { cssFileFilter } from './filters';

interface TransformParams {
  source: string;
  filePath: string;
  rootPath: string;
  packageName: string;
  identOption: IdentifierOption;
  globalAdapterIdentifier?: string;
  macros: Array<string>;
}

export const transform = async ({
  source,
  filePath,
  rootPath,
  packageName,
  identOption,
  globalAdapterIdentifier,
  macros,
}: TransformParams): Promise<{ buildtime: string; runtime: string }> => {
  const babelConfig = {
    filename: filePath,
    cwd: rootPath,
    configFile: false,
  };

  const ast = await babel.parseAsync(source, {
    ...babelConfig,
    plugins: [[typescriptSyntax, { isTSX: true }], jsxSyntax],
  });

  assert(ast, 'Error creating VE file AST');

  let program = ast.program;

  if (identOption === 'debug') {
    const result = await babel.transformFromAstAsync(program, undefined, {
      ...babelConfig,
      ast: true,
      code: false,
      plugins: [vanillaDebugIdsBabelPlugin],
    });

    assert(result && result.ast?.program, 'Error adding automatic debug ids');

    program = result.ast.program;
  }

  const store: any = {
    buildTimeStatements: [],
  };

  const result = await babel.transformFromAstAsync(program, undefined, {
    ...babelConfig,
    plugins: [
      [
        vanillaBabelPlugin,
        { store, macros, isCssFile: cssFileFilter.test(filePath) },
      ],
    ],
  });

  assert(
    result && typeof result.code === 'string',
    'Error transforming VE file',
  );

  const buildtimeProgram = babel.types.program(store.buildTimeStatements);

  const buildtime = addFileScope({
    source: generate(
      buildtimeProgram,
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
