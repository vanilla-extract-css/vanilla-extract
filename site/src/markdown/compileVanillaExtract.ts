import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TTLCache } from '@isaacs/ttlcache';
import { createCompiler, type Compiler } from '@vanilla-extract/compiler';
import type { Plugin } from 'vite';

export interface CodeFile {
  fileName: string;
  contents: string;
}

/** Splits a code block into files on `// fileName.ts(x)` comments */
export function extractFiles(code: string): CodeFile[] {
  const matches = Array.from(code.matchAll(/\/\/\s([\w.]+\.tsx?)/g));

  return matches.map(({ 0: comment, 1: fileName, index }, i) => ({
    fileName,
    contents: code.slice(index + comment.length, matches[i + 1]?.index).trim(),
  }));
}

const root = fileURLToPath(new URL('../..', import.meta.url));

// Keyed by fake paths in a directory per block, named by a hash of its files,
// so blocks can't import each other and edits never hit stale modules.
// Expired so that a long dev session doesn't keep every edit of every block.
const virtualFiles = new TTLCache<string, string>({ ttl: 10 * 60 * 1000 });

const codeBlockFilesPlugin: Plugin = {
  name: 'vanilla-extract-code-block-files',
  enforce: 'pre',
  resolveId(source, importer) {
    if (virtualFiles.has(source)) return source;

    if (importer && virtualFiles.has(importer) && source.startsWith('./')) {
      const path = join(dirname(importer), source);
      return [path, `${path}.ts`].find((candidate) =>
        virtualFiles.has(candidate),
      );
    }
  },
  load(id) {
    return virtualFiles.get(id);
  },
};

let compiler: Compiler | undefined;

const getCompiler = () =>
  (compiler ??= createCompiler({
    root,
    identifiers: 'debug',
    enableFileWatcher: false,
    viteConfig: { plugins: [codeBlockFilesPlugin] },
  }));

export async function closeCompiler() {
  const current = compiler;
  compiler = undefined;
  await current?.close();
}

export async function compileVanillaExtract(
  files: CodeFile[],
): Promise<Record<string, string>> {
  const blockDir = join(
    root,
    '__code-blocks__',
    createHash('sha1').update(JSON.stringify(files)).digest('hex').slice(0, 8),
  );
  const styleFiles = files
    .filter(({ fileName }) => fileName.endsWith('.css.ts'))
    .map(({ fileName }) => ({ fileName, path: join(blockDir, fileName) }));

  for (const { fileName, contents } of files) {
    virtualFiles.set(join(blockDir, fileName), contents);
  }

  const compiler = getCompiler();
  for (const { path } of styleFiles) {
    await compiler.processVanillaFile(path);
  }

  // Processing a file also produces the CSS for the `.css.ts` files it imports
  return Object.fromEntries(
    styleFiles.map(({ fileName, path }) => [
      fileName,
      compiler.getCssForFile(path).css,
    ]),
  );
}
