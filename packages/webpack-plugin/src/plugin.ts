import {
  cssFileFilter,
  type IdentifierOption,
} from '@vanilla-extract/integration';
import type { Compiler, RuleSetRule } from 'webpack';

import { ChildCompiler } from './compiler';
import createCompat, { type WebpackCompat } from './compat';

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
            (createData.matchResource.endsWith('.vanilla.css') ||
              createData.matchResource.endsWith('vanilla.virtual.css'))
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
            (result.matchResource.endsWith('.vanilla.css') ||
              result.matchResource.endsWith('vanilla.virtual.css'))
          ) {
            result.settings.sideEffects = true;
          }
        },
      );
    }
  });
}

export interface PluginOptions {
  test?: RuleSetRule['test'];
  identifiers?: IdentifierOption;
  outputCss?: boolean;
  externals?: any;
  /** @deprecated */
  allowRuntime?: boolean;
}

export abstract class AbstractVanillaExtractPlugin {
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

  protected inject(
    compiler: Compiler,
    virtualLoader: 'virtualFileLoader' | 'virtualNextFileLoader',
  ) {
    const compat = createCompat(
      Boolean(compiler.webpack && compiler.webpack.version),
    );

    markCSSFilesAsSideEffects(compiler, compat);

    compiler.options.module?.rules.splice(0, 0, {
      test: this.test,
      use: [
        {
          loader: require.resolve('../loader'),
          options: {
            outputCss: this.outputCss,
            childCompiler: this.childCompiler,
            identifiers: this.identifiers,
            virtualLoader: virtualLoader,
          },
        },
      ],
    });
  }
}
