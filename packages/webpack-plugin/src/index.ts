import type { Compiler } from 'webpack';
// import { AbstractVanillaExtractPlugin } from './plugin';
import { AbstractVanillaExtractPlugin } from './plugin2';

export class VanillaExtractPlugin extends AbstractVanillaExtractPlugin {
  apply(compiler: Compiler) {
    this.inject(compiler, 'virtualFileLoader');
  }
}
