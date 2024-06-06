import type { LoaderContext } from './types';
import createCompat from './compat';

// Should be "ExternalsItem" but webpack doesn't expose it
type Externals = any;

interface CompilationResult {
  source: string;
  fileDependencies: Array<string>;
  contextDependencies: Array<string>;
}

const getCompilerName = (resource: string) =>
  `vanilla-extract-compiler:${resource}`;

export class ChildCompiler {
  externals: Externals | undefined;

  constructor(externals: Externals) {
    this.externals = externals;
  }

  isChildCompiler(name: string | undefined) {
    return (
      typeof name === 'string' && name.startsWith('vanilla-extract-compiler')
    );
  }

  async getCompiledSource(loader: LoaderContext) {
    const { source, fileDependencies, contextDependencies } =
      await compileVanillaSource(loader, this.externals);

    // Set loader dependencies to dependencies of the child compiler
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
  }
}

function getRootCompilation(loader: LoaderContext) {
  var compiler = loader._compiler;
  var compilation = loader._compilation;
  while (compiler.parentCompilation) {
    compilation = compiler.parentCompilation;
    compiler = compilation.compiler;
  }
  return compilation;
}

// Modified version of webpack's regex for detecting template strings.
// We only want to match un-escaped strings so we can escape them ourselves.
// https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/TemplatedPathPlugin.js#L19
const templateStringRegexp = /\[([\w:]+)\]/g;

export const escapeWebpackTemplateString = (s: string) =>
  s.replaceAll(templateStringRegexp, '[\\$1\\]');

function compileVanillaSource(
  loader: LoaderContext,
  externals: Externals | undefined,
): Promise<CompilationResult> {
  return new Promise((resolve, reject) => {
    const isWebpack5 = Boolean(
      loader._compiler.webpack && loader._compiler.webpack.version,
    );
    const compat = createCompat(isWebpack5);

    // Escape webpack template strings and Next.js dynamic routes in output files so they don't get replaced
    // Non-standard escape syntax, see https://webpack.js.org/configuration/output/#template-strings
    // and https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
    const outputOptions = {
      filename: escapeWebpackTemplateString(loader.resourcePath),
    };

    // Child compiler will compile vanilla-extract files to be evaled during compilation
    const compilerName = getCompilerName(loader.resourcePath);
    const childCompiler = getRootCompilation(loader).createChildCompiler(
      compilerName,
      outputOptions,
      [],
    );

    const NodeTemplatePlugin = compat.getNodeTemplatePlugin(loader._compiler);
    const NodeTargetPlugin = compat.getNodeTargetPlugin(loader._compiler);
    const LimitChunkCountPlugin = compat.getLimitChunkCountPlugin(
      loader._compiler,
    );
    const ExternalsPlugin = compat.getExternalsPlugin(loader._compiler);

    new NodeTemplatePlugin().apply(childCompiler);
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
    new ExternalsPlugin('commonjs', [
      '@vanilla-extract/css',
      '@vanilla-extract/css/fileScope',
      externals,
    ]).apply(childCompiler);

    let source: string;

    if (compat.isWebpack5) {
      childCompiler.hooks.compilation.tap(compilerName, (compilation) => {
        compilation.hooks.processAssets.tap(compilerName, () => {
          source =
            compilation.assets[loader.resourcePath] &&
            (compilation.assets[loader.resourcePath].source() as string);

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
          (compilation.assets[loader.resourcePath].source() as string);

        // Remove all chunk assets
        compilation.chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            delete compilation.assets[file];
          });
        });
      });
    }

    try {
      childCompiler.runAsChild((err, _entries, compilation) => {
        if (err) {
          return reject(err);
        }

        if (!compilation) {
          return reject(
            new Error('Missing compilation in child compiler result'),
          );
        }

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
