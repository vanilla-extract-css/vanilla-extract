import type { Compiler, RuleSetRule, RuleSetUseItem } from 'webpack';

import { ChildCompiler } from './compiler';

interface PluginOptions {
  test?: RuleSetRule['test'];
  outputCss?: boolean;
  outputLoaders?: Array<RuleSetUseItem>;
  externals?: any;
}
export class TreatPlugin {
  test: RuleSetRule['test'];
  outputCss: boolean;
  outputLoaders: Array<RuleSetUseItem>;
  childCompiler: ChildCompiler;

  constructor(options: PluginOptions = {}) {
    const {
      test = /\.treat\.(js|ts)$/,
      outputCss = true,
      outputLoaders = ['style-loader'],
      externals,
    } = options;

    this.test = test;
    this.outputCss = outputCss;
    this.outputLoaders = outputLoaders;
    this.childCompiler = new ChildCompiler(externals);
  }

  apply(compiler: Compiler) {
    compiler.hooks.watchRun.tap('treat-webpack-plugin', () => {
      this.childCompiler.clearCache();
    });

    compiler.options.module?.rules.splice(
      0,
      0,
      {
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
      },
      {
        test: /\.treatcss$/,
        sideEffects: true,
        use: [
          ...this.outputLoaders,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              url: false,
            },
          },
        ],
      },
    );
  }
}
