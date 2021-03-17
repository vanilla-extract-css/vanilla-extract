import { Compiler, ExternalsPlugin, node, optimize } from 'webpack';

interface WebpackCompat {
  isWebpack5: boolean;
  getNodeTemplatePlugin: (compiler: Compiler) => typeof node.NodeTemplatePlugin;
  getNodeTargetPlugin: (compiler: Compiler) => typeof node.NodeTargetPlugin;
  getLimitChunkCountPlugin: (
    compiler: Compiler,
  ) => typeof optimize.LimitChunkCountPlugin;
  getExternalsPlugin: (compiler: Compiler) => typeof ExternalsPlugin;
}

const webpack4: WebpackCompat = {
  isWebpack5: false,
  getNodeTemplatePlugin: () => require('webpack/lib/node/NodeTemplatePlugin'),
  getNodeTargetPlugin: () => require('webpack/lib/node/NodeTargetPlugin'),
  getLimitChunkCountPlugin: () =>
    require('webpack/lib/optimize/LimitChunkCountPlugin'),
  getExternalsPlugin: () => require('webpack/lib/ExternalsPlugin'),
};

const webpack5: WebpackCompat = {
  isWebpack5: true,
  getNodeTemplatePlugin: (compiler) => compiler.webpack.node.NodeTemplatePlugin,
  getNodeTargetPlugin: (compiler) => compiler.webpack.node.NodeTargetPlugin,
  getLimitChunkCountPlugin: (compiler) =>
    compiler.webpack.optimize.LimitChunkCountPlugin,
  getExternalsPlugin: (compiler) => compiler.webpack.ExternalsPlugin,
};

export default (isWebpack5: boolean): WebpackCompat => {
  if (isWebpack5) {
    return webpack5;
  }
  return webpack4;
};
