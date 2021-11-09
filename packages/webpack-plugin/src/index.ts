import {
  cssFileFilter,
  IdentifierOption,
  getPackageInfo,
} from '@vanilla-extract/integration';
import type { Compiler, RuleSetRule } from 'webpack';

import { ChildCompiler } from './compiler';
import createCompat, { WebpackCompat } from './compat';

const pluginName = 'VanillaExtractPlugin';

function markCSSFilesAsSideEffects(compiler: Compiler, compat: WebpackCompat) {
  compiler.hooks.normalModuleFactory.tap(pluginName, (nmf) => {
    if (compat.isWebpack5) {
      nmf.hooks.createModule.tap(
        pluginName,
        // @ts-expect-error CreateData is typed as 'object'...
        (createData: {
          matchResource?: string;
          settings: { sideEffects?: boolean };
        }) => {
          if (
            createData.matchResource &&
            createData.matchResource.endsWith('.vanilla.css')
          ) {
            createData.settings.sideEffects = true;
          }
        },
      );
    } else {
      nmf.hooks.afterResolve.tap(
        pluginName,
        // @ts-expect-error Can't be typesafe for webpack 4
        (result: {
          matchResource?: string;
          settings: { sideEffects?: boolean };
        }) => {
          if (
            result.matchResource &&
            result.matchResource.endsWith('.vanilla.css')
          ) {
            result.settings.sideEffects = true;
          }
        },
      );
    }
  });
}

interface PluginOptions {
  test?: RuleSetRule['test'];
  identifiers?: IdentifierOption;
  outputCss?: boolean;
  externals?: any;
  /** @deprecated */
  allowRuntime?: boolean;
}
export class VanillaExtractPlugin {
  test: RuleSetRule['test'];
  outputCss: boolean;
  allowRuntime: boolean;
  childCompiler: ChildCompiler;
  identifiers?: IdentifierOption;

  constructor(options: PluginOptions = {}) {
    const {
      test = cssFileFilter,
      outputCss = true,
      externals,
      allowRuntime,
      identifiers,
    } = options;

    if (allowRuntime !== undefined) {
      console.warn('The "allowRuntime" option is deprecated.');
    }

    this.test = test;
    this.outputCss = outputCss;
    this.allowRuntime = allowRuntime ?? false;
    this.childCompiler = new ChildCompiler(externals);
    this.identifiers = identifiers;
  }

  apply(compiler: Compiler) {
    const compat = createCompat(
      Boolean(compiler.webpack && compiler.webpack.version),
    );

    markCSSFilesAsSideEffects(compiler, compat);

    compiler.options.module?.rules.splice(0, 0, {
      test: this.test,
      use: [
        {
          loader: require.resolve('@vanilla-extract/webpack-plugin/loader'),
          options: {
            outputCss: this.outputCss,
            childCompiler: this.childCompiler,
            identifiers: this.identifiers,
            packageInfo: getPackageInfo(compiler.context),
          },
        },
      ],
    });
  }
}
