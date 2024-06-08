import {
  cssFileFilter,
  createCompiler,
  IdentifierOption,
  type Compiler,
  serializeCss,
} from '@vanilla-extract/integration';
import type { Compiler as WebpackCompiler, RuleSetRule } from 'webpack';
// @ts-expect-error
import loaderUtils from 'loader-utils';

import createCompat, { WebpackCompat } from './compat';
import path from 'path';

const pluginName = 'VanillaExtractPlugin';

function markCSSFilesAsSideEffects(
  compiler: WebpackCompiler,
  compat: WebpackCompat,
) {
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
  vanillaExtractCompiler?: Compiler;
  identifiers?: IdentifierOption;

  constructor(options: PluginOptions = {}) {
    const {
      test = cssFileFilter,
      outputCss = true,
      // Maybe pass externals to vite?
      // externals,
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

  protected inject(
    compiler: WebpackCompiler,
    virtualLoader: 'virtualFileLoader' | 'virtualNextFileLoader',
  ) {
    const compat = createCompat(
      Boolean(compiler.webpack && compiler.webpack.version),
    );

    markCSSFilesAsSideEffects(compiler, compat);

    compiler.hooks.shutdown.tapPromise(pluginName, async () => {
      console.log('Shutting down vanillaExtractCompiler');
      await vanillaExtractCompiler.close();
    });

    const virtualFileLoader = require.resolve(
      `@vanilla-extract/webpack-plugin/${virtualLoader}`,
    );

    const virtualFileLoaderExtractionFile = path.join(
      path.dirname(require.resolve('../package.json')),
      'extracted.js',
    );

    const virtualNextFileLoaderExtractionFile = path.join(
      path.dirname(require.resolve('../package.json')),
      'vanilla.virtual.css',
    );

    const vanillaExtractCompiler = createCompiler({
      // Not sure if an absolute path will work here, hopefully it will
      root: compiler.context,
      identifiers: this.identifiers,
      cssImportSpecifier: async (cssDepModuleId, moduleId, source) => {
        const serializedCss = await serializeCss(source);
        // `moduleId` won't change between css imports, so we should try memoize this I think
        const moduleContext = path.dirname(moduleId);

        if (virtualLoader === 'virtualFileLoader') {
          const relativeVirtualFileLoader = path.relative(
            moduleContext,
            virtualFileLoader,
          );
          const relativeVirtualFileLoaderExtractionFile = path.relative(
            moduleContext,
            virtualFileLoaderExtractionFile,
          );
          const relativeVirtualResourceLoader = `${relativeVirtualFileLoader}?${JSON.stringify(
            {
              source: serializedCss,
            },
          )}`;

          const request = `${cssDepModuleId}.vanilla.css!=!${relativeVirtualResourceLoader}!${relativeVirtualFileLoaderExtractionFile}`;
          return request;
        } else {
          // https://github.com/SukkaW/style9-webpack/blob/f51c46bbcd95ea3b988d3559c3b35cc056874366/src/next-appdir/style9-next-loader.ts#L64-L72
          const relativeVirtualNextFileLoaderExtractionFile = path.relative(
            moduleContext,
            virtualNextFileLoaderExtractionFile,
          );
          const request =
            // Next.js RSC CSS extraction will discard any loaders in the request.
            // So we need to pass virtual css information through resourceQuery.
            // https://github.com/vercel/next.js/blob/3a9bfe60d228fc2fd8fe65b76d49a0d21df4ecc7/packages/next/src/build/webpack/plugins/flight-client-entry-plugin.ts#L425-L429
            // The compressed serialized CSS of vanilla-extract will add compressionFlag.
            // Causing the resourceQuery to be abnormally split, so uri encoding is required.
            // https://github.com/vanilla-extract-css/vanilla-extract/blob/58005eb5e7456cf2b3c04ea7aef29677db37cc3c/packages/integration/src/serialize.ts#L15
            `${relativeVirtualNextFileLoaderExtractionFile}?${encodeURIComponent(
              JSON.stringify({ source: serializedCss }),
            )}`;
          return request;
        }
      },
    });
    this.vanillaExtractCompiler = vanillaExtractCompiler;

    compiler.options.module?.rules.splice(0, 0, {
      test: this.test,
      use: [
        {
          loader: require.resolve('../loader2'),
          options: {
            outputCss: this.outputCss,
            identifiers: this.identifiers,
            vanillaExtractCompiler,
            virtualLoader: virtualLoader,
          },
        },
      ],
    });
  }
}
