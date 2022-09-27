import { join, dirname, posix } from 'path';

import { cssFileFilter, IdentifierOption } from '@vanilla-extract/integration';
import type { Compiler, RuleSetRule } from 'webpack';

import createCompat, { WebpackCompat } from './compat';
import { initializeCompiler } from './compiler';

const pluginName = 'VanillaExtractPlugin';

const virtualLoader = require.resolve(
  join(dirname(require.resolve('../package.json')), 'virtualFileLoader'),
);

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
    this.identifiers = identifiers;
  }

  apply(compiler: Compiler) {
    const compat = createCompat(
      Boolean(compiler.webpack && compiler.webpack.version),
    );

    markCSSFilesAsSideEffects(compiler, compat);

    const root = compiler.context;
    initializeCompiler({
      root,
      toCssImport(filePath) {
        const virtualCssPath = posix.relative(root, filePath) + '.vanilla.css';

        return `${virtualCssPath}!=!${virtualLoader}!${filePath}`;
      },
    });

    compiler.options.module?.rules.splice(0, 0, {
      test: this.test,
      use: [
        {
          loader: require.resolve('../loader'),
          options: {
            outputCss: this.outputCss,
            identifiers: this.identifiers,
          },
        },
      ],
    });
  }
}
