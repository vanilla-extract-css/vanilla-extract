import type { Compiler } from 'webpack';
import { AbstractVanillaExtractPlugin } from './plugin';

export class VanillaExtractPlugin extends AbstractVanillaExtractPlugin {
  apply(compiler: Compiler) {
    this.inject(compiler, 'virtualFileLoader');
  }
}
