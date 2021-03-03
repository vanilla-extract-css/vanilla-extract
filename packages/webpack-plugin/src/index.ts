import type { Compiler, RuleSetRule, RuleSetUseItem } from 'webpack';

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
}
export class TreatPlugin {
  test: RuleSetRule['test'];
  minify: boolean | undefined;
  outputCss: boolean;
  outputLoaders: Array<RuleSetUseItem>;

  constructor(options: PluginOptions = {}) {
    const {
      test = /\.treat\.(js|ts)$/,
      outputCss = true,
      outputLoaders = ['style-loader'],
      minify,
    } = options;

    this.test = test;
    this.minify = minify;
    this.outputCss = outputCss;
    this.outputLoaders = outputLoaders;
  }

  apply(compiler: Compiler) {
    // TODO do we need this
    // compiler.hooks.normalModuleFactory.tap(TWP, (nmf) => {
    //   nmf.hooks.afterResolve.tap(TWP, (result) => {
    //     if (this.store.getCSSResources().has(result.matchResource)) {
    //       result.settings = Object.assign({}, result.settings, {
    //         sideEffects: true,
    //       });
    //     }
    //   });
    // });

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
            loader: require.resolve('@treat/webpack-plugin/loader'),
            options: {
              outputCss: this.outputCss,
              minify: optionDefaulter(this.minify, {
                dev: false,
                prod: true,
              }),
            },
          },
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [require.resolve('@treat/babel-plugin')],
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
