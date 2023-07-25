import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import browserslist from 'browserslist';
import { lazyPostCSS } from 'next/dist/build/webpack/config/blocks/css';
import { findPagesDir } from 'next/dist/lib/find-pages-dir';
import NextMiniCssExtractPluginDefault from 'next/dist/build/webpack/plugins/mini-css-extract-plugin';

import type webpack from 'webpack';
import type { NextConfig } from 'next/types';
import type { WebpackConfigContext } from 'next/dist/server/config-shared';

const NextMiniCssExtractPlugin = NextMiniCssExtractPluginDefault as any;

function getSupportedBrowsers(dir: any, isDevelopment: any) {
  let browsers;
  try {
    browsers = browserslist.loadConfig({
      path: dir,
      env: isDevelopment ? 'development' : 'production',
    });
  } catch {}

  return browsers;
}

type PluginOptions = ConstructorParameters<typeof VanillaExtractPlugin>[0];

// https://github.com/vercel/next.js/blob/canary/packages/next/src/build/webpack/config/blocks/css/loaders/global.ts#L7
const getVanillaExtractCssLoaders = (
  options: WebpackConfigContext,
  assetPrefix: string,
) => {
  const loaders: webpack.RuleSetUseItem[] = [];

  // https://github.com/vercel/next.js/blob/a4f2bbbe2047d4ed88e9b6f32f6b0adfc8d0c46a/packages/next/src/build/webpack/config/blocks/css/loaders/global.ts#L14
  if (!options.isServer) {
    // https://github.com/vercel/next.js/blob/a4f2bbbe2047d4ed88e9b6f32f6b0adfc8d0c46a/packages/next/src/build/webpack/config/blocks/css/loaders/client.ts#L44
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

  const postcss = () =>
    lazyPostCSS(
      options.dir,
      getSupportedBrowsers(options.dir, options.dev),
      undefined,
    );

  // https://github.com/vercel/next.js/blob/a4f2bbbe2047d4ed88e9b6f32f6b0adfc8d0c46a/packages/next/src/build/webpack/config/blocks/css/loaders/global.ts#L28
  loaders.push({
    loader: require.resolve('next/dist/build/webpack/loaders/css-loader/src'),
    options: {
      postcss,
      importLoaders: 1,
      modules: false,
    },
  });

  // https://github.com/vercel/next.js/blob/a4f2bbbe2047d4ed88e9b6f32f6b0adfc8d0c46a/packages/next/src/build/webpack/config/blocks/css/loaders/global.ts#L43
  loaders.push({
    loader: require.resolve(
      'next/dist/build/webpack/loaders/postcss-loader/src',
    ),
    options: {
      postcss,
    },
  });

  return loaders;
};

export const createVanillaExtractPlugin =
  (pluginOptions: PluginOptions = {}) =>
  (nextConfig: NextConfig = {}): NextConfig =>
    Object.assign({}, nextConfig, {
      webpack(config: any, options: WebpackConfigContext) {
        const { dir, dev, isServer, config: resolvedNextConfig } = options;
        const findPagesDirResult = findPagesDir(
          dir,
          resolvedNextConfig.experimental?.appDir,
        );

        // https://github.com/vercel/next.js/blob/1fb4cad2a8329811b5ccde47217b4a6ae739124e/packages/next/build/index.ts#L336
        // https://github.com/vercel/next.js/blob/1fb4cad2a8329811b5ccde47217b4a6ae739124e/packages/next/build/webpack-config.ts#L626
        // https://github.com/vercel/next.js/pull/43916
        const hasAppDir =
          // on Next.js 12, findPagesDirResult is a string. on Next.js 13, findPagesDirResult is an object
          !!resolvedNextConfig.experimental?.appDir &&
          !!(findPagesDirResult && findPagesDirResult.appDir);

        const outputCss = hasAppDir
          ? // Always output css since Next.js App Router needs to collect Server CSS from React Server Components
            true
          : // There is no appDir, do not output css on server build
            !isServer;

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

        cssRules.unshift({
          test: /\.vanilla\.css$/i,
          sideEffects: true,
          use: getVanillaExtractCssLoaders(
            options,
            resolvedNextConfig.assetPrefix,
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
            (plugin: any) => plugin instanceof NextMiniCssExtractPlugin,
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
          new VanillaExtractPlugin({ outputCss, ...pluginOptions }),
        );

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    });
