# Angular

This example shows how to use vanilla-extract with Angular.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.9.

**Note** this integration uses the Angular runtime to attach vanilla-extract class names to components. This works, and is probably fine for 99% of use cases. There is **probably** a more "Angular" way to do this where we could hook into the `styleUrls` feature of Angular components.

## Setup

Getting vanilla-extract working with Angular requires an extra step or two.

### 1. Pre-requisites

Vanilla-extract needs to integrate with your build step. If you're working As a lucky Angular user, the only option here is to extend your webpack config.

Follow the steps in the [Angular Builders repo](https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack) to add a custom webpack config to your Angular app.

### 2. Webpack config

To make the necessary changes to the webpack config, some existing rules need to be modified. To do this, you have to use a config function in the custom webpack config file.

```javascript
// webpack.config.js

// e.g.

module.exports = (config) => {
  // etc.
  return config;
}
```

#### **1. Modify the Angular webpack loader & css-loader**

The Angular webpack loader will try and load all `*.ts` files. To avoid this, the current approach is to modify the loader config and exclude `.css.ts` files.

The existing css-loader (from the Angular webpack config) will try and handle `vanilla.css` files too - causing a conflict with the MiniCssExtract loader for vanilla-extract.

```javascript
config.module.rules = config.module?.rules?.map((rule) => {
  // Exclude .css.ts files from angular loader
  if (rule?.loader?.endsWith('@ngtools/webpack/src/ivy/index.js')) {
    (rule.exclude ||= []).push(/\.css\.ts$/);
  }
  // Exclude .vanilla.css files from angular's css-loader implementation
  if ('.css'.match(rule.test)) {
    (rule.exclude ||= []).push(/\.vanilla\.css$/);
  }
  return rule;
})
```

#### **2. (optional) Add a typescript loader**

Because we excluded the `css.ts` files from the Angular webpack loader, if your setup doesn't include a typescript loader (a default Angular app doesn't seem to), then it'll be necessary to add a loader to handle the `css.ts` files.

Install the necessary dependencies;

```bash
npm i -D babel-loader @babel/core @babel/preset-env @babel/preset-typescript
```

```javascript
config.module?.rules.push({
  test: /\.css\.ts$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-typescript',
        ['@babel/preset-env', { targets: 'defaults' }],
      ],
    },
  },
});
```

#### **3. Add vanilla-extract**

Finally, you can add vanilla-extract to the config, as per the docs.

Follow the instructions in the docs to [install vanilla-extract](https://vanilla-extract.style/documentation/getting-started/) and the [vanilla-extract webpack plugin](https://vanilla-extract.style/documentation/integrations/webpack/).

```javascript
config.plugins.push(new VanillaExtractPlugin());
```

```javascript
config.module?.rules.push({
  test: /\.vanilla\.css$/i,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: {
        url: false,
      },
    },
  ],
});
```

## A note on the webpack implementation

The webpack implementation mentioned here *works*, but it may be possible to instead provide an "emitter" to the Angular webpack plugin/loader to tell it how to handle these files. This would remove the need to exclude these files from the loader in the fairly invasive way we have. It would presumably also mean that adding the babel-loader is not necessary.