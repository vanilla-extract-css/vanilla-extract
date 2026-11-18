import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterAll, describe, expect, test } from 'vitest';
import { build } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const listFiles = async (dir: string, base = dir): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory()
        ? listFiles(fullPath, base)
        : Promise.resolve([path.relative(base, fullPath)]);
    }),
  );

  return files.flat().sort();
};

describe('vite-plugin extract option', () => {
  const fixtureRoot = path.join(__dirname, 'fixtures/lib-build');

  const outDirs: string[] = [];

  afterAll(async () => {
    await Promise.all(
      outDirs.map((outDir) => fs.rm(outDir, { recursive: true, force: true })),
    );
  });

  const entryA = path.join(fixtureRoot, 'src/a.css.ts');
  const entryB = path.join(fixtureRoot, 'src/b.css.ts');

  const buildLib = async ({
    outDir,
    pluginOptions,
    entries,
    minify = false,
  }: {
    outDir: string;
    pluginOptions?: Parameters<typeof vanillaExtractPlugin>[0];
    entries: string[];
    minify?: boolean;
  }) =>
    build({
      root: fixtureRoot,
      configFile: false,
      plugins: [vanillaExtractPlugin(pluginOptions)],
      build: {
        outDir,
        lib: {
          entry: entries,
          formats: ['es'],
        },
        minify,
        rollupOptions: {
          output: {
            assetFileNames: 'assets/[name][extname]',
          },
        },
      },
      logLevel: 'silent',
    });

  test('extract: false emits per-file CSS assets and rewrites side-effect imports', async () => {
    const outDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 've-extract-per-file-'),
    );
    outDirs.push(outDir);

    await buildLib({
      outDir,
      pluginOptions: { extract: false },
      entries: [entryA],
    });

    expect(await listFiles(outDir)).toMatchInlineSnapshot(`
      [
        "a.css.mjs",
        "assets/a.css.ts.vanilla.css",
      ]
    `);
    expect(await fs.readFile(path.join(outDir, 'a.css.mjs'), 'utf-8'))
      .toMatchInlineSnapshot(`
      "import "./assets/a.css.ts.vanilla.css";
      // tests/vite-plugin/fixtures/lib-build/src/a.css.ts
      var componentContract = { color: { primary: "var(--component-token)" } };
      var a = "_158fg7h0";
      export { a, componentContract };
      "
    `);
    expect(
      await fs.readFile(
        path.join(outDir, 'assets/a.css.ts.vanilla.css'),
        'utf-8',
      ),
    ).toMatchInlineSnapshot(`
      "._158fg7h0 {
        --component-token: var(--global-token);
      }"
    `);
  });

  test('extract: false emits one asset per CSS file with multiple entries', async () => {
    const outDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 've-extract-per-file-multi-'),
    );
    outDirs.push(outDir);

    await buildLib({
      outDir,
      pluginOptions: { extract: false },
      entries: [entryA, entryB],
    });

    expect(await listFiles(outDir)).toMatchInlineSnapshot(`
      [
        "a.css.mjs",
        "assets/a.css.ts.vanilla.css",
        "assets/b.css.ts.vanilla.css",
        "b.css.mjs",
      ]
    `);
    expect(await fs.readFile(path.join(outDir, 'a.css.mjs'), 'utf-8'))
      .toMatchInlineSnapshot(`
      "import "./assets/a.css.ts.vanilla.css";
      // tests/vite-plugin/fixtures/lib-build/src/a.css.ts
      var componentContract = { color: { primary: "var(--component-token)" } };
      var a = "_158fg7h0";
      export { a, componentContract };
      "
    `);
    expect(await fs.readFile(path.join(outDir, 'b.css.mjs'), 'utf-8'))
      .toMatchInlineSnapshot(`
      "import "./assets/a.css.ts.vanilla.css";
      import "./assets/b.css.ts.vanilla.css";
      // tests/vite-plugin/fixtures/lib-build/src/b.css.ts
      var b = "xbgeyk0";
      export { b };
      "
    `);
    expect(
      await fs.readFile(
        path.join(outDir, 'assets/a.css.ts.vanilla.css'),
        'utf-8',
      ),
    ).toMatchInlineSnapshot(`
      "._158fg7h0 {
        --component-token: var(--global-token);
      }"
    `);
    expect(
      await fs.readFile(
        path.join(outDir, 'assets/b.css.ts.vanilla.css'),
        'utf-8',
      ),
    ).toMatchInlineSnapshot(`
      ".xbgeyk0 {
        --component-token: red;
      }"
    `);
  });

  test('extract: { name } emits a single CSS bundle and strips side-effect imports', async () => {
    const outDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 've-extract-bundle-'),
    );
    outDirs.push(outDir);

    await buildLib({
      outDir,
      pluginOptions: { extract: { name: 'bundle.css' } },
      entries: [entryA, entryB],
    });

    expect(await listFiles(outDir)).toMatchInlineSnapshot(`
      [
        "a.css.mjs",
        "assets/bundle.css",
        "b.css.mjs",
      ]
    `);
    expect(await fs.readFile(path.join(outDir, 'assets/bundle.css'), 'utf-8'))
      .toMatchInlineSnapshot(`
      "._158fg7h0 {
        --component-token: var(--global-token);
      }
      .xbgeyk0 {
        --component-token: red;
      }"
    `);
    expect(await fs.readFile(path.join(outDir, 'a.css.mjs'), 'utf-8'))
      .toMatchInlineSnapshot(`
      "// tests/vite-plugin/fixtures/lib-build/src/a.css.ts
      var componentContract = { color: { primary: "var(--component-token)" } };
      var a = "_158fg7h0";
      export { a, componentContract };
      "
    `);
    expect(await fs.readFile(path.join(outDir, 'b.css.mjs'), 'utf-8'))
      .toMatchInlineSnapshot(`
      "// tests/vite-plugin/fixtures/lib-build/src/b.css.ts
      var b = "xbgeyk0";
      export { b };
      "
    `);
  });

  test('extract: { name } strips side-effect imports from minified output', async () => {
    const outDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 've-extract-bundle-minified-'),
    );
    outDirs.push(outDir);

    await buildLib({
      outDir,
      pluginOptions: { extract: { name: 'bundle.css' } },
      entries: [entryA, entryB],
      minify: true,
    });

    expect(await listFiles(outDir)).toMatchInlineSnapshot(`
      [
        "a.css.mjs",
        "assets/bundle.css",
        "b.css.mjs",
      ]
    `);

    const jsA = await fs.readFile(path.join(outDir, 'a.css.mjs'), 'utf-8');
    expect(jsA).not.toContain('.vanilla.css');
    expect(jsA).toMatchInlineSnapshot(`
      "// tests/vite-plugin/fixtures/lib-build/src/a.css.ts
      var e = { color: { primary: "var(--component-token)" } }, t = "_158fg7h0";
      export { t as a, e as componentContract };
      "
    `);

    expect(await fs.readFile(path.join(outDir, 'assets/bundle.css'), 'utf-8'))
      .toMatchInlineSnapshot(`
      "._158fg7h0 {
        --component-token: var(--global-token);
      }
      .xbgeyk0 {
        --component-token: red;
      }"
    `);
  });

  test('extract: { name, sourcemap } emits a CSS sourcemap', async () => {
    const outDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 've-extract-bundle-sourcemap-'),
    );
    outDirs.push(outDir);

    await buildLib({
      outDir,
      pluginOptions: {
        extract: { name: 'bundle.css', sourcemap: true },
      },
      entries: [entryA, entryB],
    });

    expect(await listFiles(outDir)).toMatchInlineSnapshot(`
      [
        "a.css.mjs",
        "assets/bundle.css",
        "assets/bundle.css.map",
        "b.css.mjs",
      ]
    `);

    const sourcemap = JSON.parse(
      await fs.readFile(path.join(outDir, 'assets/bundle.css.map'), 'utf-8'),
    ) as { file: string; sources: string[] };

    expect(sourcemap.file).toBe('bundle.css');
    expect(sourcemap.sources.map((source) => path.basename(source))).toEqual([
      'a.css.ts.vanilla.css',
      'b.css.ts.vanilla.css',
    ]);
  });
});
