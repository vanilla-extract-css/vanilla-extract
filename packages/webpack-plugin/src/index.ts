import type { Compiler, RuleSetRule, RuleSetUseItem } from 'webpack';

import { ChildCompiler } from './compiler';

type TODO = any;

const isProductionLikeMode = (options: TODO) => {
  return options.mode === 'production' || !options.mode;
};

const makeOptionDefaulter = (prodLike: boolean) => (
  option: TODO,
  { dev, prod }: TODO,
) => {
  if (typeof option !== 'undefined') {
    return option;
  }

  return prodLike ? prod : dev;
};

interface PluginOptions {
  test?: RuleSetRule['test'];
  outputCss?: boolean;
  outputLoaders?: Array<RuleSetUseItem>;
  minify?: boolean;
  externals?: any;
}
export class TreatPlugin {
  test: RuleSetRule['test'];
  minify: boolean | undefined;
  outputCss: boolean;
  outputLoaders: Array<RuleSetUseItem>;
  childCompiler: ChildCompiler;

  constructor(options: PluginOptions = {}) {
    const {
      test = /\.treat\.(js|ts)$/,
      outputCss = true,
      outputLoaders = ['style-loader'],
      minify,
      externals,
    } = options;

    this.test = test;
    this.minify = minify;
    this.outputCss = outputCss;
    this.outputLoaders = outputLoaders;
    this.childCompiler = new ChildCompiler(externals);
  }

  apply(compiler: Compiler) {
    compiler.hooks.watchRun.tap('treat-webpack-plugin', () => {
      this.childCompiler.clearCache();
    });

    const optionDefaulter = makeOptionDefaulter(
      isProductionLikeMode(compiler.options),
    );

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
              minify: optionDefaulter(this.minify, {
                dev: false,
                prod: true,
              }),
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
