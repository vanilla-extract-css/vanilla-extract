import {
  createInlineCompiler,
  cssFileFilter,
  IdentifierOption,
} from '@vanilla-extract/integration';
import type { Compiler, RuleSetRule } from 'webpack';
// @ts-expect-error
import loaderUtils from 'loader-utils';

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
}
export class VanillaExtractPlugin {
  test: RuleSetRule['test'];
  outputCss: boolean;
  identifiers?: IdentifierOption;

  constructor(options: PluginOptions = {}) {
    const { test = cssFileFilter, outputCss = true, identifiers } = options;

    this.test = test;
    this.outputCss = outputCss;
    this.identifiers = identifiers;
  }

  apply(compiler: Compiler) {
    const veCompiler = createInlineCompiler({
      root: compiler.context,
      identifiers: this.identifiers,
    });
    const compat = createCompat(
      Boolean(compiler.webpack && compiler.webpack.version),
    );

    markCSSFilesAsSideEffects(compiler, compat);

    compiler.options.module?.rules.splice(0, 0, {
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('../loader'),
          options: {
            outputCss: this.outputCss,
            veCompiler: veCompiler,
            identifiers: this.identifiers,
          },
        },
      ],
    });
  }
}
