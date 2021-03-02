import createCompat from './compat';

const TWL = 'treat-webpack-loader';

export const getCompiledSource = async (loader) => {
  const isWebpack5 = Boolean(
    loader._compiler.webpack && loader._compiler.webpack.version,
  );
  const compat = createCompat(isWebpack5);

  const {
    source,
    fileDependencies,
    contextDependencies,
  } = await compileTreatSource(loader, compat);

  // Set loader dependencies to dependecies of the child compiler
  fileDependencies.forEach((dep) => {
    loader.addDependency(dep);
  });
  contextDependencies.forEach((dep) => {
    loader.addContextDependency(dep);
  });

  return {
    source,
    dependencies: fileDependencies,
  };
};

function getRootCompilation(loader) {
  var compiler = loader._compiler;
  var compilation = loader._compilation;
  while (compiler.parentCompilation) {
    compilation = compiler.parentCompilation;
    compiler = compilation.compiler;
  }
  return compilation;
}

function compileTreatSource(loader, compat) {
  return new Promise((resolve, reject) => {
    // Child compiler will compile treat files to be evaled during compilation
    const outputOptions = { filename: loader.resourcePath };

    const childCompiler = getRootCompilation(loader).createChildCompiler(
      TWL,
      outputOptions,
    );

    const NodeTemplatePlugin = compat.getNodeTemplatePlugin(loader._compiler);
    const NodeTargetPlugin = compat.getNodeTargetPlugin(loader._compiler);
    const LimitChunkCountPlugin = compat.getLimitChunkCountPlugin(
      loader._compiler,
    );
    const ExternalsPlugin = compat.getExternalsPlugin(loader._compiler);

    new NodeTemplatePlugin(outputOptions).apply(childCompiler);
    new NodeTargetPlugin().apply(childCompiler);

    if (compat.isWebpack5) {
      const {
        EntryOptionPlugin,
        library: { EnableLibraryPlugin },
      } = loader._compiler.webpack;

      new EnableLibraryPlugin('commonjs2').apply(childCompiler);

      EntryOptionPlugin.applyEntryOption(childCompiler, loader.context, {
        child: {
          library: {
            type: 'commonjs2',
          },
          import: [loader.resourcePath],
        },
      });
    } else {
      // Webpack 4 code. Remove once support is removed
      const { LibraryTemplatePlugin, SingleEntryPlugin } = require('webpack');

      new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
      new SingleEntryPlugin(loader.context, loader.resourcePath).apply(
        childCompiler,
      );
    }

    new LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);
    new ExternalsPlugin('commonjs', '@treat/core').apply(childCompiler);

    let source;

    if (compat.isWebpack5) {
      childCompiler.hooks.compilation.tap(TWL, (compilation) => {
        compilation.hooks.processAssets.tap(TWL, () => {
          source =
            compilation.assets[loader.resourcePath] &&
            compilation.assets[loader.resourcePath].source();

          // Remove all chunk assets
          compilation.chunks.forEach((chunk) => {
            chunk.files.forEach((file) => {
              compilation.deleteAsset(file);
            });
          });
        });
      });
    } else {
      childCompiler.hooks.afterCompile.tap(TWL, (compilation) => {
        source =
          compilation.assets[loader.resourcePath] &&
          compilation.assets[loader.resourcePath].source();

        // Remove all chunk assets
        compilation.chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            delete compilation.assets[file];
          });
        });
      });
    }

    try {
      childCompiler.runAsChild((err, entries, compilation) => {
        if (err) return reject(err);

        if (compilation.errors.length > 0) {
          return reject(compilation.errors[0]);
        }
        if (!source) {
          return reject(new Error("Didn't get a result from child compiler"));
        }

        resolve({
          source,
          fileDependencies: Array.from(compilation.fileDependencies),
          contextDependencies: Array.from(compilation.contextDependencies),
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}
