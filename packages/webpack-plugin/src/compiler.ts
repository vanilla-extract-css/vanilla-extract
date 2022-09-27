import {
  createCompiler,
  Compiler,
  CreateCompilerParams,
} from '@vanilla-extract/integration';

export let compiler: Compiler;

export const initializeCompiler = (params: CreateCompilerParams) => {
  compiler = createCompiler(params);
};
