import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import { getGlobalCssLoader } from 'next/dist/build/webpack/config/blocks/css/loaders';

export const createVanillaExtractPlugin =
  (pluginOptions = {}) =>
  (nextConfig = {}) =>
    Object.assign({}, nextConfig, {
      webpack(config, options) {
        const { dev, isServer } = options;

        const cssRules = config.module.rules.find((rule) => {
          return (
            Array.isArray(rule.oneOf) &&
            rule.oneOf.some(
              ({ test }) =>
                typeof test === 'object' &&
                typeof test.test === 'function' &&
                test.test('filename.css'),
            )
          );
        }).oneOf;

        cssRules.unshift({
          test: /\.vanilla\.css$/i,
          sideEffects: true,
          use: getGlobalCssLoader(
            {
              assetPrefix: config.assetPrefix,
              isClient: !isServer,
              isServer,
              isDevelopment: dev,
            },
            [],
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
