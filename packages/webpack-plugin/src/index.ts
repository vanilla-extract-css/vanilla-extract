import type { Compiler } from 'webpack';
import { AbstractVanillaExtractPlugin } from './plugin';

export class VanillaExtractPlugin extends AbstractVanillaExtractPlugin {
  apply(compiler: Compiler): void {
    this.inject(compiler, 'virtualFileLoader');
  }
}
