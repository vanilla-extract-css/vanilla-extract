import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import { getGlobalCssLoader } from 'next/dist/build/webpack/config/blocks/css/loaders';

export const createVanillaExtractPlugin =
  (pluginOptions = {}) =>
  (nextConfig = {}) =>
    Object.assign({}, nextConfig, {
      webpack(config, options) {
        const { dev, isServer } = options;

        config.module.rules[config.module.rules.length - 1].oneOf.unshift({
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
