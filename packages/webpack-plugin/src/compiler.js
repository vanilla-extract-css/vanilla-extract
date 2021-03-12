import path from 'path';

import createCompat from './compat';
import { debug } from './logger';

const log = debug('treat:compiler');

const getCompilerName = (resource) => `treat-compiler:${resource}`;

const wrapFileScope = (source, fileScope) => `
  const { setFileScope, endFileScope } = require("@mattsjones/css-core");
  setFileScope('${fileScope}');
  ${source}
  endFileScope()`;

export class ChildCompiler {
  constructor() {
    this.cache = new Map();
  }

  clearCache() {
    log('Clearing child compiler cache');
    this.cache.clear();
  }

  isChildCompiler(name) {
    return typeof name === 'string' && name.startsWith('treat-compiler');
  }

  async getCompiledSource(loader, request) {
    const projectRelativeResourcePath = path.relative(
      loader.rootContext,
      loader.resourcePath,
    );
    const cacheId = projectRelativeResourcePath;
    let compilationResult = this.cache.get(cacheId);

    if (!compilationResult) {
      log('No cached source. Compiling: %s', cacheId);
      const isWebpack5 = Boolean(
        loader._compiler.webpack && loader._compiler.webpack.version,
      );
      const compat = createCompat(isWebpack5);
      compilationResult = await compileTreatSource(loader, compat, request);

      this.cache.set(cacheId, compilationResult);
    } else {
      log('Using cached source: %s', cacheId);
    }

    const { source, fileDependencies, contextDependencies } = compilationResult;

    // Set loader dependencies to dependecies of the child compiler
    fileDependencies.forEach((dep) => {
      loader.addDependency(dep);
    });
    contextDependencies.forEach((dep) => {
      loader.addContextDependency(dep);
    });

    return {
      source: wrapFileScope(source, projectRelativeResourcePath),
      dependencies: fileDependencies,
    };
  }
}

function getRootCompilation(loader) {
  var compiler = loader._compiler;
  var compilation = loader._compilation;
  while (compiler.parentCompilation) {
    compilation = compiler.parentCompilation;
    compiler = compilation.compiler;
  }
  return compilation;
}

function compileTreatSource(loader, compat, request) {
  return new Promise((resolve, reject) => {
    // Child compiler will compile treat files to be evaled during compilation
    const outputOptions = { filename: loader.resourcePath };

    const compilerName = getCompilerName(loader.resourcePath);
    const childCompiler = getRootCompilation(loader).createChildCompiler(
      compilerName,
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
          import: [`!!${request}`],
        },
      });
    } else {
      // Webpack 4 code. Remove once support is removed
      const { LibraryTemplatePlugin, SingleEntryPlugin } = require('webpack');

      new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
      new SingleEntryPlugin(loader.context, `!!${request}`).apply(
        childCompiler,
      );
    }

    new LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);
    new ExternalsPlugin('commonjs', '@mattsjones/css-core').apply(
      childCompiler,
    );

    let source;

    if (compat.isWebpack5) {
      childCompiler.hooks.compilation.tap(compilerName, (compilation) => {
        compilation.hooks.processAssets.tap(compilerName, () => {
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
      childCompiler.hooks.afterCompile.tap(compilerName, (compilation) => {
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
