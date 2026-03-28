import { AbstractVanillaExtractPlugin } from './plugin';
import type { Compiler } from 'webpack';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const virtualNextFileLoader =
  require.resolve('@vanilla-extract/webpack-plugin/virtualNextFileLoader');

export class VanillaExtractPlugin extends AbstractVanillaExtractPlugin {
  static loader: string = virtualNextFileLoader;

  apply(compiler: Compiler): void {
    this.inject(compiler, 'virtualNextFileLoader');
  }
}
