import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterAll, describe, expect, test } from 'vitest';
import { build } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { normalizePath } from '@vanilla-extract/integration';

describe('vite-plugin lib build', () => {
  const fixtureRoot = path.join(__dirname, 'fixtures/lib-build');
  let outDir: string;

  expect.addSnapshotSerializer({
    test: (val) => typeof val === 'string',
    print: (val) =>
      (val as string).replaceAll(normalizePath(fixtureRoot), '{{fixtureRoot}}'),
  });

  afterAll(async () => {
    if (outDir) {
      await fs.rm(outDir, { recursive: true, force: true });
    }
  });

  test('does not emit empty entry CSS chunk with cssCodeSplit', async () => {
    outDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 've-lib-build-empty-chunk-'),
    );

    const entryA = path.join(fixtureRoot, 'src/a.css.ts');
    const entryB = path.join(fixtureRoot, 'src/b.css.ts');

    await build({
      root: fixtureRoot,
      configFile: false,
      plugins: [vanillaExtractPlugin()],
      build: {
        outDir,
        lib: {
          entry: [entryA, entryB],
          formats: ['es'],
        },
      },
      logLevel: 'silent',
    });

    const files = (await fs.readdir(outDir)).sort();
    expect(files).toMatchInlineSnapshot(`
      [
        a.css.mjs,
        b.css.mjs,
        tests.css,
      ]
    `);

    expect(await fs.readFile(path.join(outDir, 'a.css.mjs'), 'utf-8'))
      .toMatchInlineSnapshot(`
      /* empty css                           */
      //#region tests/vite-plugin/fixtures/lib-build/src/a.css.ts
      var e = { color: { primary: "var(--component-token)" } }, t = "_158fg7h0";
      //#endregion
      export { t as a, e as componentContract };
    `);
    expect(await fs.readFile(path.join(outDir, 'b.css.mjs'), 'utf-8'))
      .toMatchInlineSnapshot(`
      /* empty css                           */
      //#region tests/vite-plugin/fixtures/lib-build/src/b.css.ts
      var e = "xbgeyk0";
      //#endregion
      export { e as b };
    `);
    expect(await fs.readFile(path.join(outDir, 'tests.css'), 'utf-8'))
      .toMatchInlineSnapshot(`
      ._158fg7h0{--component-token:var(--global-token)}.xbgeyk0{--component-token:red}
      /*$vite$:1*/
    `);
  });
});
