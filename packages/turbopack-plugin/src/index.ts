import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import {
  createCompiler,
  type Compiler as VeCompiler,
} from '@vanilla-extract/compiler';
import {
  serializeCss,
  deserializeCss,
  type IdentifierOption,
} from '@vanilla-extract/integration';

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
};

let singletonCompiler: VeCompiler | undefined;

const getCompiler = async (
  root: string,
  identifiers: IdentifierOption,
  getResolve?: LoaderContext<TurboLoaderOptions>['getResolve'],
  nextEnv?: Record<string, string> | null,
): Promise<VeCompiler> => {
  if (singletonCompiler) return singletonCompiler;

  const defineEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(nextEnv ?? {})) {
    defineEnv[`process.env.${key}`] = JSON.stringify(value);
  }

  singletonCompiler = createCompiler({
    root,
    identifiers,
    viteConfig: {
      define: defineEnv,
      plugins: [
        {
          // avoid module resolution errors by letting turbopack resolve our modules for us
          name: 'vanilla-extract-turbo-resolve',
          async resolveId(source: string, importer: string | undefined) {
            if (!getResolve || !importer) return null;
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

    // process virtual css if needed
    const rawQuery: string | undefined = this.resourceQuery;
    if (typeof rawQuery === 'string') {
      const query = rawQuery.startsWith('?') ? rawQuery.slice(1) : rawQuery;
      const params = new URLSearchParams(query);
      const encoded = params.get('ve-source');
      if (encoded != null) {
        const css = await deserializeCss(encoded);
        return callback(null, css);
      }
    }

    // turbopack has trouble resolving directly to our package and the import cannot be server relative
    // we need to reference a real file, so write one to our next cache to reference
    const virtualCssPath = path.join(
      this.rootContext,
      '.next',
      'vanilla.virtual.css',
    );
    try {
      await fs.writeFile(
        virtualCssPath,
        '/* Virtual CSS file for vanilla-extract */',
      );
    } catch {
      // file already exists
    }

    const compiler = await getCompiler(
      this.rootContext,
      identifiers,
      this.getResolve,
      options.nextEnv,
    );
    const { source: veSource, watchFiles } = await compiler.processVanillaFile(
      this.resourcePath,
      {
        outputCss: false, // always false since we inject CSS manually
      },
    );

    watchFiles?.forEach((file) => this.addDependency(file));

    // get generated css (if any) and construct css import
    const { css } = compiler.getCssForFile(this.resourcePath);

    let transformed = veSource;
    if (css && outputCss && css.length > 0) {
      const serialized = await serializeCss(css);
      const fromDir = path.dirname(this.resourcePath);
      const relPath = path
        .relative(fromDir, virtualCssPath)
        .replace(/\\/g, '/');
      const importPath = relPath.startsWith('.') ? relPath : `./${relPath}`;
      const importRequest = `${importPath}?ve-source=${encodeURIComponent(
        serialized,
      )}`;
      const importStmt = `import '${importRequest}';\n`;
      transformed = `${importStmt}${veSource}`;
    }

    callback(null, transformed);
  } catch (e) {
    callback(e as Error);
  }
}
