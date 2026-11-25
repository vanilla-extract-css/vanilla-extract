import type { Asset } from 'webpack';
import type { LoaderContext } from './types';

// Webpack exposes the `Externals` type which is a union of several types.
// We likely intended to only accept a subset of these, but chose to use `any`.
// We handle potential array inputs, but really we should be more specific about what we accept
// here, or handling all types. Changing this type would be a breaking change,
// so we can look at this in a future major release.
type Externals = any;

interface CompilationResult {
  source: string;
  moduleAssets: Array<Asset>;
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

  isChildCompiler(name: string | undefined): boolean {
    return (
      typeof name === 'string' && name.startsWith('vanilla-extract-compiler')
    );
  }

  async getCompiledSource(loader: LoaderContext): Promise<{
    source: string;
    dependencies: string[];
  }> {
    const { source, moduleAssets, fileDependencies, contextDependencies } =
      await compileVanillaSource(loader, this.externals);

    // Emitting through the loader attaches these assets to the parent module, so
    // they are restored alongside it from webpack's persistent cache
    // https://github.com/vanilla-extract-css/vanilla-extract/issues/1123
    moduleAssets.forEach(({ name, source, info }) => {
      loader.emitFile(name, source.buffer(), undefined, info);
    });

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

export const escapeWebpackTemplateString = (s: string): string =>
  s.replaceAll(templateStringRegexp, '[\\$1\\]');

function compileVanillaSource(
  loader: LoaderContext,
  externals: Externals | undefined,
): Promise<CompilationResult> {
  return new Promise((resolve, reject) => {
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

    const {
      node: { NodeTemplatePlugin, NodeTargetPlugin },
      optimize: { LimitChunkCountPlugin },
      ExternalsPlugin,
      EntryOptionPlugin,
      library: { EnableLibraryPlugin },
    } = loader._compiler.webpack;

    new NodeTemplatePlugin().apply(childCompiler);
    new NodeTargetPlugin().apply(childCompiler);

    new EnableLibraryPlugin('commonjs2').apply(childCompiler);

    EntryOptionPlugin.applyEntryOption(childCompiler, loader.context, {
      child: {
        library: {
          type: 'commonjs2',
        },
        import: [loader.resourcePath],
      },
    });

    new LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler);
    new ExternalsPlugin('commonjs', [
      '@vanilla-extract/css',
      '@vanilla-extract/css/fileScope',
      ...(Array.isArray(externals) ? externals : [externals]),
    ]).apply(childCompiler);

    let source: string;
    const moduleAssets: Array<Asset> = [];

    childCompiler.hooks.compilation.tap(compilerName, (compilation) => {
      compilation.hooks.processAssets.tap(compilerName, () => {
        source =
          compilation.assets[loader.resourcePath] &&
          (compilation.assets[loader.resourcePath].source() as string);
      });

      // Runs after every other stage, so assets from plugins inherited from the
      // parent compiler (e.g. Next.js' `.nft.json` traces) are also removed
      compilation.hooks.processAssets.tap(
        { name: compilerName, stage: Infinity },
        () => {
          const moduleAssetNames = new Set<string>();
          for (const module of compilation.modules) {
            const { assets: emittedFiles, filename } = module.buildInfo ?? {};
            Object.keys(emittedFiles ?? {}).forEach((name) =>
              moduleAssetNames.add(name),
            );
            if (filename) {
              moduleAssetNames.add(filename);
            }
          }

          for (const asset of compilation.getAssets()) {
            if (moduleAssetNames.has(asset.name)) {
              moduleAssets.push(asset);
            }
            compilation.deleteAsset(asset.name);
          }
        },
      );
    });

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
          moduleAssets,
          fileDependencies: Array.from(compilation.fileDependencies),
          contextDependencies: Array.from(compilation.contextDependencies),
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}
