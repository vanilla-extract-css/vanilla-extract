// @ts-expect-error
import browserslist from 'next/dist/compiled/browserslist';
import NextMiniCssExtractPluginDefault from 'next/dist/build/webpack/plugins/mini-css-extract-plugin';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin/next';
import { findPagesDir } from 'next/dist/lib/find-pages-dir';
import { lazyPostCSS } from 'next/dist/build/webpack/config/blocks/css';
import { cssFileResolve } from 'next/dist/build/webpack/config/blocks/css/loaders/file-resolve';

import type webpack from 'webpack';
import type {
  NextConfig,
  WebpackConfigContext,
} from 'next/dist/server/config-shared';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import type { TurboLoaderOptions } from '@vanilla-extract/turbopack-plugin';
import semver from 'semver';

const require = createRequire(import.meta.url);

type PluginOptions = ConstructorParameters<typeof VanillaExtractPlugin>[0] & {
  turbopackGlob?: string[];
  /**
   * controls whether we attempt to configure turbopack
   * auto: enable only when Next >= 16.0.0
   * on: force enable regardless of detected Next version
   * off: never configure turbopack, webpack only
   */
  turbopackMode?: 'auto' | 'on' | 'off';
};

const NextMiniCssExtractPlugin = NextMiniCssExtractPluginDefault as any;

// Adopted from https://github.com/vercel/next.js/blob/1f1632979c78b3edfe59fd85d8cce62efcdee688/packages/next/build/webpack-config.ts#L60-L72
function getSupportedBrowsers(dir: string, isDevelopment: boolean) {
  try {
    return browserslist.loadConfig({
      path: dir,
      env: isDevelopment ? 'development' : 'production',
    });
  } catch (_) {
    return undefined;
  }
}

// Adopt from Next.js' getGlobalCssLoader
// https://github.com/vercel/next.js/blob/6e5b935fd7a61497f6854a81aec7df3a5dbf61ac/packages/next/src/build/webpack/config/blocks/css/loaders/global.ts#L7
const getVanillaExtractCssLoaders = (
  options: WebpackConfigContext,
  assetPrefix: string,
  hasAppDir: boolean,
) => {
  const loaders: webpack.RuleSetUseItem[] = [];

  // Adopt from Next.js' getClientStyleLoader
  // https://github.com/vercel/next.js/blob/6e5b935fd7a61497f6854a81aec7df3a5dbf61ac/packages/next/src/build/webpack/config/blocks/css/loaders/client.ts#L3
  if (!options.isServer) {
    // https://github.com/vercel/next.js/blob/6e5b935fd7a61497f6854a81aec7df3a5dbf61ac/packages/next/src/build/webpack/config/blocks/css/loaders/client.ts#L16
    // Keep next-style-loader for development mode in `pages/`
    if (options.dev && !hasAppDir) {
      loaders.push({
        loader: 'next-style-loader',
        options: {
          insert: function (element: Node) {
            // By default, style-loader injects CSS into the bottom
            // of <head>. This causes ordering problems between dev
            // and prod. To fix this, we render a <noscript> tag as
            // an anchor for the styles to be placed before. These
            // styles will be applied _before_ <style jsx global>.

            // These elements should always exist. If they do not,
            // this code should fail.
            const anchorElement = document.querySelector(
              '#__next_css__DO_NOT_USE__',
            )!;
            const parentNode = anchorElement.parentNode!; // Normally <head>

            // Each style tag should be placed right before our
            // anchor. By inserting before and not after, we do not
            // need to track the last inserted element.
            parentNode.insertBefore(element, anchorElement);
          },
        },
      });
    } else {
      // https://github.com/vercel/next.js/blob/6e5b935fd7a61497f6854a81aec7df3a5dbf61ac/packages/next/src/build/webpack/config/blocks/css/loaders/client.ts#L44
      // next-style-loader will mess up css order in development mode.
      // Next.js appDir doesn't use next-style-loader either.
      // So we always use css-loader here, to simplify things and get proper order of output CSS
      loaders.push({
        loader: NextMiniCssExtractPlugin.loader,
        options: {
          publicPath: `${assetPrefix}/_next/`,
          esModule: false,
        },
      });
    }
  }

  const postcss = () =>
    lazyPostCSS(
      options.dir,
      getSupportedBrowsers(options.dir, options.dev),
      undefined,
    );

  // https://github.com/vercel/next.js/blob/6e5b935fd7a61497f6854a81aec7df3a5dbf61ac/packages/next/src/build/webpack/config/blocks/css/loaders/global.ts#L28
  loaders.push({
    loader: require.resolve('next/dist/build/webpack/loaders/css-loader/src'),
    options: {
      postcss,
      importLoaders: 1,
      modules: false,
      url: (url: string, resourcePath: string) =>
        cssFileResolve(
          url,
          resourcePath,
          options.config.experimental?.urlImports,
        ),
      import: (url: string, _: any, resourcePath: string) =>
        cssFileResolve(
          url,
          resourcePath,
          options.config.experimental?.urlImports,
        ),
    },
  });

  // https://github.com/vercel/next.js/blob/6e5b935fd7a61497f6854a81aec7df3a5dbf61ac/packages/next/src/build/webpack/config/blocks/css/loaders/global.ts#L29-L38
  loaders.push({
    loader: require.resolve(
      'next/dist/build/webpack/loaders/postcss-loader/src',
    ),
    options: {
      postcss,
    },
  });

  // https://github.com/SukkaW/style9-webpack/blob/f51c46bbcd95ea3b988d3559c3b35cc056874366/src/next-appdir/index.ts#L103-L105
  loaders.push({
    loader: VanillaExtractPlugin.loader,
  });

  return loaders;
};

export const createVanillaExtractPlugin = (
  pluginOptions: PluginOptions = {},
) => {
  return (nextConfig: NextConfig = {}): NextConfig => {
    const {
      turbopackMode = 'auto',
      turbopackGlob = ['**/*.css.{js,cjs,mjs,jsx,ts,tsx}'],
      ...webpackPluginOptions
    } = pluginOptions;
    // detect Next version and decide whether to configure turbopack
    const nextVersion = (() => {
      try {
        // resolve from the consumer app's cwd, not this package
        const requireFromCwd = createRequire(
          path.join(process.cwd(), 'package.json'),
        );
        const pkg = requireFromCwd('next/package.json') as { version?: string };
        return pkg?.version ?? null;
      } catch {
        return null;
      }
    })();
    const coerced = nextVersion ? semver.coerce(nextVersion) : null;
    const supportsTurbopackRules = !!coerced && semver.gte(coerced, '16.0.0');
    const enableTurbopack =
      turbopackMode === 'on' ||
      (turbopackMode === 'auto' && supportsTurbopackRules);

    let turbopack: typeof nextConfig.turbopack;
    if (enableTurbopack) {
      turbopack = { ...(nextConfig.turbopack || {}) };

      if (turbopackGlob.some((glob) => turbopack.rules?.[glob])) {
        throw new Error(
          'Vanilla extract could not be applied automatically due to conflicting turbopack rules',
        );
      }

      const vanillaExtractRule = {
        as: '*.js',
        loaders: [
          {
            loader: require.resolve('@vanilla-extract/turbopack-plugin'),
            options: {
              nextEnv: nextConfig.env ?? null,
              outputCss: pluginOptions.outputCss ?? null,
              identifiers: pluginOptions.identifiers ?? null,
            } satisfies TurboLoaderOptions,
          },
        ],
      } as const;

      const vanillaExtractCssRule = {
        as: '*.css',
        loaders: ['@vanilla-extract/turbopack-plugin'],
      } as const;

      turbopack.rules = {
        ...(turbopack.rules || {}),
        ...Object.fromEntries(
          turbopackGlob.map((glob) => [glob, vanillaExtractRule]),
        ),
        'vanilla.virtual.css': vanillaExtractCssRule,
      };
    }

    const baseConfig: NextConfig = {
      ...nextConfig,
      webpack(config: any, options: WebpackConfigContext) {
        const { dir, dev, config: resolvedNextConfig } = options;

        // https://github.com/vercel/next.js/blob/1fb4cad2a8329811b5ccde47217b4a6ae739124e/packages/next/build/index.ts#L336
        // https://github.com/vercel/next.js/blob/1fb4cad2a8329811b5ccde47217b4a6ae739124e/packages/next/build/webpack-config.ts#L626
        // https://github.com/vercel/next.js/pull/43916
        // on Next.js 12, findPagesDirResult is a string. on Next.js 13, findPagesDirResult is an object
        const findPagesDirResult = findPagesDir(
          dir,
          resolvedNextConfig.experimental?.appDir ?? false,
        );
        // Skip nextConfig check since appDir is stable feature after Next.js 13.4
        const hasAppDir = !!(findPagesDirResult && findPagesDirResult.appDir);

        const outputCss = true;

        // https://github.com/vercel/next.js/blob/6e5b935fd7a61497f6854a81aec7df3a5dbf61ac/packages/next/src/build/webpack/config/helpers.ts#L12-L21
        const cssRules = config.module.rules.find(
          (rule: any) =>
            Array.isArray(rule.oneOf) &&
            rule.oneOf.some(
              ({ test }: any) =>
                typeof test === 'object' &&
                typeof test.test === 'function' &&
                test.test('filename.css'),
            ),
        ).oneOf;

        // https://github.com/SukkaW/style9-webpack/blob/f51c46bbcd95ea3b988d3559c3b35cc056874366/src/next-appdir/index.ts#L187-L190
        cssRules.unshift({
          test: /vanilla\.virtual\.css/i,
          sideEffects: true,
          use: getVanillaExtractCssLoaders(
            options,
            resolvedNextConfig.assetPrefix,
            hasAppDir,
          ),
        });

        // vanilla-extract need to emit the css file on both server and client, both during the
        // development and production.
        // However, Next.js only add MiniCssExtractPlugin on pages dir + client build + production mode.
        //
        // To simplify the logic at our side, we will add MiniCssExtractPlugin based on
        // the "instanceof" check (We will only add our required MiniCssExtractPlugin if
        // Next.js hasn't added it yet).
        // This also prevent multiple MiniCssExtractPlugin being added (which will cause
        // RealContentHashPlugin to panic)
        if (
          !config.plugins.some(
            (p: any) => p instanceof NextMiniCssExtractPlugin,
          )
        ) {
          // HMR reloads the CSS file when the content changes but does not use
          // the new file name, which means it can't contain a hash.
          const filename = dev
            ? 'static/css/[name].css'
            : 'static/css/[contenthash].css';

          config.plugins.push(
            new NextMiniCssExtractPlugin({
              filename,
              chunkFilename: filename,
              // Next.js guarantees that CSS order "doesn't matter", due to imposed
              // restrictions:
              // 1. Global CSS can only be defined in a single entrypoint (_app)
              // 2. CSS Modules generate scoped class names by default and cannot
              //    include Global CSS (:global() selector).
              //
              // While not a perfect guarantee (e.g. liberal use of `:global()`
              // selector), this assumption is required to code-split CSS.
              //
              // If this warning were to trigger, it'd be unactionable by the user,
              // but likely not valid -- so just disable it.
              ignoreOrder: true,
            }),
          );
        }

        config.plugins.push(
          new VanillaExtractPlugin({ outputCss, ...webpackPluginOptions }),
        );

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    };

    if (enableTurbopack && turbopack) {
      return { ...baseConfig, turbopack } as NextConfig;
    }
    return baseConfig;
  };
};
