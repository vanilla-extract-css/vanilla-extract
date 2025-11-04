import {
  createCompiler,
  type Compiler as VeCompiler,
} from '@vanilla-extract/compiler';
import { type IdentifierOption } from '@vanilla-extract/integration';
import * as path from 'node:path';
import { buildValidationPrelude } from './next-font/devValidation';
import {
  createNextFontVePlugins,
  type NextFontPluginState,
} from './next-font/plugin';
import { createNextStubsVePlugin } from './next-stubs/plugin';

type LoaderContext<OptionsType> = {
  getOptions: (schema?: unknown) => OptionsType;
  getResolve?: (
    options?: unknown,
  ) => (
    context: string,
    request: string,
    callback: (err: any, result?: string) => void,
  ) => void;
  async: () => (
    err?: Error | null,
    content?: string,
    sourceMap?: unknown,
    additionalData?: unknown,
  ) => void;
  addDependency: (file: string) => void;
  mode: 'none' | 'development' | 'production';
  rootContext: string;
  resourcePath: string;
  resourceQuery?: string;
};

export type TurboLoaderOptions = {
  identifiers: IdentifierOption | null;
  nextEnv: Record<string, string> | null;
  outputCss: boolean | null;
  distDir: string | null;
};

let singletonCompiler: VeCompiler | undefined;
// font state includes family, weight, and style for validation
let nextFontState: NextFontPluginState | undefined;
let processedPaths = new Set<string>();

const getCompiler = async (
  root: string,
  identifiers: IdentifierOption,
  getResolve: LoaderContext<TurboLoaderOptions>['getResolve'] | undefined,
  nextEnv: Record<string, string> | null | undefined,
  currentFilePath: string,
): Promise<VeCompiler> => {
  // If we've already processed this file with the current compiler, create a fresh compiler.
  if (singletonCompiler && processedPaths.has(currentFilePath)) {
    try {
      await singletonCompiler.close();
    } catch {}
    singletonCompiler = undefined;
    processedPaths.clear();
    // helpful log for diagnosing compiler resets during HMR
    console.log('[vanilla-extract] Resetting style compiler');
  }

  if (!singletonCompiler) {
    const defineEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(nextEnv ?? {})) {
      defineEnv[`process.env.${key}`] = JSON.stringify(value);
    }

    console.log('[vanilla-extract] Creating style compiler');
    singletonCompiler = createCompiler({
      root,
      identifiers,
      viteConfig: {
        define: defineEnv,
        plugins: [
          createNextStubsVePlugin(),
          ...(() => {
            const created = createNextFontVePlugins();
            nextFontState = created.state;
            return created.plugins;
          })(),
          {
            // avoid module resolution errors by letting turbopack resolve our modules for us
            name: 'vanilla-extract-turbo-resolve',
            // we cannot use enforce: 'pre' because turbopack doesn't support server relative imports
            // so we'll let vite try to resolve first, then delegate
            async resolveId(source: string, importer: string | undefined) {
              // never delegate virtual ids or our stub ids to turbopack
              if (
                source.startsWith('ve-stub:') ||
                source.startsWith('\\0') ||
                source.includes('\\0') ||
                !getResolve ||
                !importer ||
                importer.startsWith('ve-stub:') ||
                importer.startsWith('\\0') ||
                importer.includes('\\0')
              ) {
                return null;
              }
              const resolver = getResolve({});
              return new Promise((resolve) => {
                resolver(
                  path.dirname(importer),
                  source,
                  (_err: any, result?: string) => {
                    resolve(result);
                  },
                );
              });
            },
          },
        ],
      },
    });
  }

  // record the file as processed for this compiler instance
  processedPaths.add(currentFilePath);

  return singletonCompiler;
};

/**
 * The Turbopack-compatible loader for vanilla-extract.
 * - JS mode: processes .css.{ts,tsx,js,jsx} files, compiles and extracts CSS.
 * - CSS mode: when applied to a request with ?ve-source, emits the provided CSS.
 */
export default async function turbopackVanillaExtractLoader(
  this: LoaderContext<TurboLoaderOptions>,
) {
  const callback = this.async();
  try {
    const options = this.getOptions();
    const identifiers =
      options.identifiers ?? (this.mode === 'production' ? 'short' : 'debug');
    const outputCss = options.outputCss ?? true;

    const compiler = await getCompiler(
      this.rootContext,
      identifiers,
      this.getResolve,
      options.nextEnv,
      this.resourcePath,
    );
    const { source: veSource, watchFiles } = await compiler.processVanillaFile(
      this.resourcePath,
      { outputCss },
    );

    watchFiles?.forEach((file) => this.addDependency(file));

    // prepend next/font dev validation if this file used any providers
    let veSourceWithValidation = veSource;
    if (nextFontState && watchFiles && watchFiles.size > 0) {
      const usedProviders = [...watchFiles].filter((f) =>
        nextFontState!.fontProviders.has(f),
      );
      if (usedProviders.length > 0) {
        const prelude = buildValidationPrelude(
          this.resourcePath,
          usedProviders,
          nextFontState.fontProviderDetails,
        );
        if (prelude) {
          veSourceWithValidation = `${prelude}\n${veSource}`;
        }
      }
    }

    // rewrite compiler-emitted .vanilla.css imports to data URL side-effect imports

    let transformed = veSourceWithValidation;
    const importRegex = /import\s+['"](.+?\.vanilla\.css)['"];?/g;
    const matches = Array.from(veSourceWithValidation.matchAll(importRegex));

    for (const match of matches) {
      const fullImport = match[0];
      const cssImportPath = match[1];
      if (!fullImport || !cssImportPath) continue;

      let cssModulePath = cssImportPath;
      if (cssModulePath.endsWith('.vanilla.css')) {
        cssModulePath = cssModulePath.slice(0, -'.vanilla.css'.length);
      }

      const { css } = compiler.getCssForFile(cssModulePath);

      if (css) {
        const base64 = Buffer.from(css, 'utf8').toString('base64');
        const dataUrl = `data:text/css;base64,${base64}`;
        const newImport = `import '${dataUrl}';`;
        transformed = transformed.replace(fullImport, newImport);
      } else {
        // no css available for this import; drop it
        transformed = transformed.replace(fullImport, '');
      }
    }

    callback(null, transformed);
  } catch (e) {
    callback(e as Error);
  }
}
