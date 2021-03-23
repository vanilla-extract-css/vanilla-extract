import type { Compiler, RuleSetRule } from 'webpack';

import { ChildCompiler } from './compiler';

interface PluginOptions {
  test?: RuleSetRule['test'];
  outputCss?: boolean;
  externals?: any;
}
export class TreatPlugin {
  test: RuleSetRule['test'];
  outputCss: boolean;
  childCompiler: ChildCompiler;

  constructor(options: PluginOptions = {}) {
    const {
      test = /\.css\.(js|ts|jsx|tsx)$/,
      outputCss = true,
      externals,
    } = options;

    this.test = test;
    this.outputCss = outputCss;
    this.childCompiler = new ChildCompiler(externals);
  }

  apply(compiler: Compiler) {
    compiler.hooks.watchRun.tap('treat-webpack-plugin', () => {
      this.childCompiler.clearCache();
    });

    compiler.options.module?.rules.splice(0, 0, {
      test: this.test,
      use: [
        {
          loader: require.resolve('@mattsjones/css-webpack-plugin/loader'),
          options: {
            outputCss: this.outputCss,
            childCompiler: this.childCompiler,
          },
        },
      ],
    });
  }
}
