import {
  createCompiler,
  type Compiler as VeCompiler,
} from '@vanilla-extract/compiler';
import {
  deserializeCss,
  serializeCss,
  type IdentifierOption,
} from '@vanilla-extract/integration';
import * as path from 'node:path';
import { createNextFontVePlugin } from './next-font/plugin';
import type fs from 'node:fs';
import { injectFontImports } from './next-font/inject';

export type TurboLoaderContext<OptionsType> = {
  getOptions: {
    (): OptionsType;
  };
  getResolve: (options: unknown) => {
    (context: string, request: string): Promise<string>;
  };

  fs: {
    readFile: typeof fs.readFile;
  };

  rootContext: string;
  resourcePath: string;
  resourceQuery?: string;
};

export type TurboLoaderOptions = {
  identifiers: IdentifierOption | null;
  outputCss: boolean | null;
  nextEnv: Record<string, string | undefined> | null;
};

let sharedCompiler: VeCompiler | null = null;

/**
 * reset the global state, used in tests to cleanup the compiler
 */
export const cleanupSharedCompiler = () => {
  if (sharedCompiler) {
    sharedCompiler.close();
    sharedCompiler = null;
  }
};

const getOrMakeCompiler = async ({
  identifiers,
  nextEnv,
  loaderContext,
}: {
  identifiers: IdentifierOption;
  nextEnv: Record<string, string | undefined> | null;
  loaderContext: TurboLoaderContext<TurboLoaderOptions>;
}): Promise<VeCompiler> => {
  if (sharedCompiler) return sharedCompiler;

  const defineEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(nextEnv ?? {})) {
    defineEnv[`process.env.${key}`] = JSON.stringify(value);
  }

  sharedCompiler = createCompiler({
    root: loaderContext.rootContext,
    identifiers,
    enableFileWatcher: false,
    splitCssPerRule: true,
    cssImportSpecifier: async (_filePath, css) => {
      return `@vanilla-extract/css/vanilla.virtual.css?ve-css=${encodeURIComponent(
        await serializeCss(css),
      )}`;
    },
    viteConfig: {
      define: defineEnv,
      plugins: [
        createNextFontVePlugin(),
        {
          // route vite file reads through turbopack's fs to handle dependency tracking automatically
          name: 'vanilla-extract-turbo-fs',
          enforce: 'pre',
          async load(id: string) {
            return new Promise((resolve, reject) => {
              // we can reuse this fs instance across all loader calls
              // turbopack will associate dependencies to the file currently being loaded
              loaderContext.fs.readFile(id, (error, data) => {
                if (error) {
                  reject(error);
                } else if (typeof data === 'string') {
                  resolve({ code: data });
                } else resolve(null);
              });
            });
          },
        },
        {
          name: 'vanilla-extract-next-image',
          enforce: 'pre',
          async resolveId(source: string, importer: string | undefined) {
            if (!importer) return null;

            if (
              source.endsWith('.png') ||
              source.endsWith('.svg') ||
              source.endsWith('.jpg') ||
              source.endsWith('.jpeg') ||
              source.endsWith('.gif') ||
              source.endsWith('.webp') ||
              source.endsWith('.avif') ||
              source.endsWith('.ico') ||
              source.endsWith('.bmp')
            ) {
              const sourceImage = path.isAbsolute(source)
                ? path.join(loaderContext.rootContext, source)
                : path.join(path.dirname(importer), source);

              // since we'll be using the image in our final css file, we must craft an import path that will resolve to the image file from the css file
              const referenceFile = require.resolve(
                '@vanilla-extract/css/vanilla.virtual.css?ve-css=unknown',
                { paths: [importer] },
              );
              const relativeImport = path.relative(
                path.dirname(referenceFile),
                sourceImage,
              );

              // determine the dimensions of the image
              const imageAsBuffer = new Promise<Buffer>((resolve, reject) => {
                loaderContext.fs.readFile(sourceImage, (error, data) => {
                  if (error) reject(error);
                  resolve(data);
                });
              });
              const { getImageSize } = await import(
                'next/dist/server/image-optimizer.js'
              );
              const imageSize: { width?: number; height?: number } =
                // @ts-expect-error - next.js version mismatch loads next 12 types but uses next 16 code
                await getImageSize(await imageAsBuffer).catch((error) => {
                  const message = `Process image "${sourceImage}" failed: ${error}`;
                  throw new Error(message);
                });

              const moduleContent = `export default {
                src: '${relativeImport}',
                height: ${imageSize.height},
                width: ${imageSize.width},
                blurDataURL: undefined,
                blurWidth: undefined,
                blurHeight: undefined,
              }`;

              return (
                'data:text/javascript;base64,' +
                Buffer.from(moduleContent).toString('base64')
              );
            }

            return null;
          },
        },
        {
          // avoid module resolution errors by letting turbopack resolve our modules for us
          name: 'vanilla-extract-turbo-resolve',
          // do NOT enforce pre as it breaks builds on some projects (not sure why)
          async resolveId(source: string, importer: string | undefined) {
            if (source.startsWith('/')) return null; // turbopack doesn't support server relative imports
            if (!importer) return null;

            // react is vendored by next, so we need to use the upstream version to avoid errors
            if (source === 'react' || source === 'react-dom') {
              return null;
            }

            const resolver = loaderContext.getResolve({});
            return resolver(path.dirname(importer), source);
          },
        },
      ],
    },
  });

  return sharedCompiler;
};

export default async function turbopackVanillaExtractLoader(
  this: TurboLoaderContext<TurboLoaderOptions>,
) {
  // Check if this is a CSS request via query param
  if (this.resourceQuery?.startsWith('?ve-css=')) {
    const encodedCss = this.resourceQuery.slice(8);
    return await deserializeCss(decodeURIComponent(encodedCss));
  }

  const options = this.getOptions() as TurboLoaderOptions;
  const identifiers =
    options.identifiers ??
    (process.env.NODE_ENV === 'production' ? 'short' : 'debug');
  const outputCss = options.outputCss ?? true;

  const compiler = await getOrMakeCompiler({
    identifiers,
    nextEnv: options.nextEnv,
    loaderContext: this,
  });

  // if turbopack invokes the loader quickly, vite can't invalidate the module fast enough
  // so we disable the internal file watcher and manually invalidate the module instead
  await compiler.invalidateAllModules();

  const { source, watchFiles } = await compiler.processVanillaFile(
    this.resourcePath,
    { outputCss },
  );

  return await injectFontImports(source, watchFiles, this);
}
