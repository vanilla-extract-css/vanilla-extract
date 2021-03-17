import type { Compilation, Compiler } from 'webpack';

export interface LoaderContext {
  addDependency: (filePath: string) => void;
  addContextDependency: (filePath: string) => void;
  cacheable: (value: boolean) => void;
  target: string;
  resourcePath: string;
  context: string;
  async: () => (err: unknown, result?: string) => void;
  hot: boolean;
  _compiler: Compiler;
  _compilation: Compilation;
}
