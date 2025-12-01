import path from 'node:path';
import { promisify } from 'node:util';
import type { TurboLoaderContext, TurboLoaderOptions } from '../index';

/**
 * we need to ensure that any next/font/google or next/font/local imports
 * are preserved in the output code, even if they are only used in CSS
 *
 * this is because next needs to see these imports to generate the font files
 */
export async function injectFontImports(
  source: string,
  watchFiles: Set<string>,
  loaderContext: TurboLoaderContext<TurboLoaderOptions>,
): Promise<string> {
  const readFile = promisify(loaderContext.fs.readFile);
  const importsToInject: string[] = [];

  await Promise.all(
    Array.from(watchFiles).map(async (file) => {
      if (file.includes('node_modules')) return;
      if (file === loaderContext.resourcePath) return;
      if (!/\.(m|c)?(js|ts)x?$/.test(file)) return;

      const content = String(await readFile(file).catch(() => null));
      if (/from\s+['"]next\/font\/(google|local)['"]/.test(content)) {
        let relativeImport = path.relative(
          path.dirname(loaderContext.resourcePath),
          file,
        );

        if (!relativeImport.startsWith('.'))
          relativeImport = `./${relativeImport}`;

        importsToInject.push(relativeImport);
      }
    }),
  );

  if (importsToInject.length > 0) {
    return `${importsToInject
      .map((importPath) => `import '${importPath}';`)
      .join('\n')}\n${source}`;
  }

  return source;
}
