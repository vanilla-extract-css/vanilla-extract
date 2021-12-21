# @vanilla-extract/private

## 1.0.3

### Patch Changes

- [#520](https://github.com/seek-oss/vanilla-extract/pull/520) [`b294764`](https://github.com/seek-oss/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Transpile code to meet [esmodules target](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

  This should allow code that runs in the browser to conform to most browser policies. If you need to support browsers prior to the esmodules target (e.g. IE 11) then you'll need to configure custom transpilation in your projects.

## 1.0.2

### Patch Changes

- [#489](https://github.com/seek-oss/vanilla-extract/pull/489) [`0c1ec7d`](https://github.com/seek-oss/vanilla-extract/commit/0c1ec7d5bfa5c4e66b4655c4f417f2751af7b3e3) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix theme contract types in TypeScript 4.5

## 1.0.1

### Patch Changes

- [#235](https://github.com/seek-oss/vanilla-extract/pull/235) [`1e49dfc`](https://github.com/seek-oss/vanilla-extract/commit/1e49dfc4fc21ccb53870e297e5e4664b098cc22e) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `createGlobalTheme` types when accepting an existing contract

## 1.0.0

### Major Changes

- [#171](https://github.com/seek-oss/vanilla-extract/pull/171) [`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

## 0.1.2

### Patch Changes

- [#84](https://github.com/seek-oss/vanilla-extract/pull/84) [`0bc4e0a`](https://github.com/seek-oss/vanilla-extract/commit/0bc4e0a164e9167e0356557f8feee42d7889d4b1) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Validate tokens match corresponding theme contracts

## 0.1.1

### Patch Changes

- [#45](https://github.com/seek-oss/vanilla-extract/pull/45) [`e154028`](https://github.com/seek-oss/vanilla-extract/commit/e1540281d327fc0883f47255f710de3f9b342c64) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `createThemeVars` when using null values
