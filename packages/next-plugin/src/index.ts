import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import browserslist from 'browserslist';
import { lazyPostCSS } from 'next/dist/build/webpack/config/blocks/css';
import { getGlobalCssLoader } from 'next/dist/build/webpack/config/blocks/css/loaders';

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

export const createVanillaExtractPlugin =
  (pluginOptions: any = {}) =>
  (nextConfig: any = {}) =>
    Object.assign({}, nextConfig, {
      webpack(config: any, options: any) {
        const { dir, dev, isServer } = options;

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
          use: getGlobalCssLoader(
            {
              assetPrefix: config.assetPrefix,
              isClient: !isServer,
              isServer,
              isDevelopment: dev,
              future: nextConfig.future || {},
              experimental: nextConfig.experimental || {},
            } as any,
            // @ts-expect-error
            () => lazyPostCSS(dir, getSupportedBrowsers(dir, dev)),
            [],
          ),
        });

        config.plugins.push(new VanillaExtractPlugin(pluginOptions));

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    });
