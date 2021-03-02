const webpack4 = {
  isWebpack5: false,
  getModuleIssuer: (_compilation, module) => module.issuer,
  getNodeTemplatePlugin: () => require('webpack/lib/node/NodeTemplatePlugin'),
  getNodeTargetPlugin: () => require('webpack/lib/node/NodeTargetPlugin'),
  getLimitChunkCountPlugin: () =>
    require('webpack/lib/optimize/LimitChunkCountPlugin'),
  getExternalsPlugin: () => require('webpack/lib/ExternalsPlugin'),
};

const webpack5 = {
  isWebpack5: true,
  getNodeTemplatePlugin: (compiler) => compiler.webpack.node.NodeTemplatePlugin,
  getNodeTargetPlugin: (compiler) => compiler.webpack.node.NodeTargetPlugin,
  getLimitChunkCountPlugin: (compiler) =>
    compiler.webpack.optimize.LimitChunkCountPlugin,
  getExternalsPlugin: (compiler) => compiler.webpack.ExternalsPlugin,
};

export default (isWebpack5) => {
  if (isWebpack5) {
    return webpack5;
  }
  return webpack4;
};
