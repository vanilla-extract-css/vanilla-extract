import path from 'path';
import { unstable_createCompiler as createCompiler } from '@vanilla-extract/integration';

function toPosix(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function getLocalFiles(files: Set<string>) {
  return [...files]
    .filter((file) => file.startsWith(__dirname))
    .map((file) => file.replace(__dirname, ''))
    .map(toPosix);
}

describe('compiler', () => {
  let compilers: Record<
    'default' | 'toCssImport' | 'shortIdentifiers',
    ReturnType<typeof createCompiler>
  >;

  beforeAll(async () => {
    // We get a segfault if we split these into separate describe blocks, so we
    // need to run them in the same top-level block. Not sure why but it seems
    // to be related to the way tests are run in parallel.
    compilers = {
      default: createCompiler({
        root: __dirname,
      }),

      toCssImport: createCompiler({
        root: __dirname,
        toCssImport: (filePath) => filePath + '.custom-extension.css',
      }),

      shortIdentifiers: createCompiler({
        root: __dirname,
        identifiers: 'short',
      }),
    };
  });

  test('absolute paths', async () => {
    const compiler = compilers.default;

    const cssPath = path.join(__dirname, 'compiler-test.css.ts');
    const sharedCssPath = path.join(__dirname, 'shared.css.ts');

    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      "import 'shared.css.ts.vanilla.css';
      import 'compiler-test.css.ts.vanilla.css';
      export var className = 'compiler-test_className__1m63wmr0 shared_shared__1mh0cm10';"
    `);
    const localWatchFiles = getLocalFiles(output.watchFiles);
    expect(localWatchFiles).toMatchInlineSnapshot(`
      [
        "/compiler-test.css.ts",
        "/shared.css.ts",
      ]
    `);

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        ".compiler-test_className__1m63wmr0 {
          color: red;
        }"
      `);
      expect(filePath).toBe('compiler-test.css.ts');
    })();

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        ".shared_shared__1mh0cm10 {
          background: blue;
        }"
      `);
      expect(filePath).toBe('shared.css.ts');
    })();
  });

  test('root relative paths', async () => {
    const compiler = compilers.default;

    const cssPath = 'compiler-test.css.ts';
    const sharedCssPath = 'shared.css.ts';

    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      "import 'shared.css.ts.vanilla.css';
      import 'compiler-test.css.ts.vanilla.css';
      export var className = 'compiler-test_className__1m63wmr0 shared_shared__1mh0cm10';"
    `);

    const localWatchFiles = getLocalFiles(output.watchFiles);
    expect(localWatchFiles).toMatchInlineSnapshot(`
      [
        "/compiler-test.css.ts",
        "/shared.css.ts",
      ]
    `);

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        ".compiler-test_className__1m63wmr0 {
          color: red;
        }"
      `);
      expect(filePath).toBe('compiler-test.css.ts');
    })();

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        ".shared_shared__1mh0cm10 {
          background: blue;
        }"
      `);
      expect(filePath).toBe('shared.css.ts');
    })();
  });

  test('root relative paths starting with dot', async () => {
    const compiler = compilers.default;

    const cssPath = './compiler-test.css.ts';
    const sharedCssPath = './shared.css.ts';

    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      "import 'shared.css.ts.vanilla.css';
      import 'compiler-test.css.ts.vanilla.css';
      export var className = 'compiler-test_className__1m63wmr0 shared_shared__1mh0cm10';"
    `);

    const localWatchFiles = getLocalFiles(output.watchFiles);
    expect(localWatchFiles).toMatchInlineSnapshot(`
      [
        "/compiler-test.css.ts",
        "/shared.css.ts",
      ]
    `);

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        ".compiler-test_className__1m63wmr0 {
          color: red;
        }"
      `);
      expect(filePath).toBe('compiler-test.css.ts');
    })();

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        ".shared_shared__1mh0cm10 {
          background: blue;
        }"
      `);
      expect(filePath).toBe('shared.css.ts');
    })();
  });

  test('throws on getCssForFile when file does not exist', async () => {
    const compiler = compilers.default;
    let error: Error | undefined;

    try {
      await compiler.getCssForFile('does-not-exist.css.ts');
    } catch (_error) {
      error = _error as Error;
    }

    expect(
      error?.message.replace(__dirname, '{{__dirname}}'),
    ).toMatchInlineSnapshot(
      `"No CSS for file: {{__dirname}}/does-not-exist.css.ts"`,
    );
  });

  test('short identifiers', async () => {
    const compiler = compilers.shortIdentifiers;

    const cssPath = path.join(__dirname, 'compiler-test.css.ts');
    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      "import 'shared.css.ts.vanilla.css';
      import 'compiler-test.css.ts.vanilla.css';
      export var className = '_1m63wmr0 _1mh0cm10';"
    `);
    const { css } = await compiler.getCssForFile(cssPath);
    expect(css).toMatchInlineSnapshot(`
      "._1m63wmr0 {
        color: red;
      }"
    `);
  });

  test('custom toCssImport', async () => {
    const compiler = compilers.toCssImport;

    const cssPath = path.join(__dirname, 'compiler-test.css.ts');
    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
          "import 'shared.css.ts.custom-extension.css';
          import 'compiler-test.css.ts.custom-extension.css';
          export var className = 'compiler-test_className__1m63wmr0 shared_shared__1mh0cm10';"
        `);
  });

  afterAll(async () => {
    await Promise.allSettled(
      Object.values(compilers).map((compiler) => compiler.close()),
    );
  });
});
