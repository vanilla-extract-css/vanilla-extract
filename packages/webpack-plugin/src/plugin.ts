import {
  cssFileFilter,
  type IdentifierOption,
} from '@vanilla-extract/integration';
import type { Compiler, RuleSetRule } from 'webpack';

import { ChildCompiler } from './compiler';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const pluginName = 'VanillaExtractPlugin';

function markCSSFilesAsSideEffects(compiler: Compiler) {
  compiler.hooks.normalModuleFactory.tap(pluginName, (nmf) => {
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
  });
}

export interface PluginOptions {
  test?: RuleSetRule['test'];
  identifiers?: IdentifierOption;
  outputCss?: boolean;
  /**
   * Effectively `ExternalItem[]` from webpack. Currently typed as `any` as this type was
   * previously not exposed. The `any` type will be fixed in the next major version.
   */
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
  ): void {
    markCSSFilesAsSideEffects(compiler);

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
