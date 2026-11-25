import type {
  Compilation,
  Compiler,
  LoaderContext as WebpackLoaderContext,
} from 'webpack';

export interface LoaderContext<OptionsType = unknown> {
  getOptions: WebpackLoaderContext<OptionsType>['getOptions'];
  utils: WebpackLoaderContext<OptionsType>['utils'];
  addDependency: (filePath: string) => void;
  addContextDependency: (filePath: string) => void;
  cacheable: (value: boolean) => void;
  target: string;
  resourcePath: string;
  context: string;
  rootContext: string;
  async: () => (err: unknown, result?: string) => void;
  hot: boolean;
  loaders: any[];
  emitError: (error: Error) => void;
  emitFile: WebpackLoaderContext<OptionsType>['emitFile'];
  _compiler: Compiler;
  _compilation: Compilation;
  mode: 'production' | 'development' | 'none';
}
