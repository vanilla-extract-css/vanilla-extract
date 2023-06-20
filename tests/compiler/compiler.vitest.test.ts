import { describe, beforeAll, afterAll, test, expect } from 'vitest';
import path from 'path';
import { createCompiler } from '@vanilla-extract/integration';

function toPosix(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function getLocalFiles(files: Set<string>) {
  const posixDirname = toPosix(__dirname);

  return [...files]
    .map(toPosix)
    .filter((file) => file.startsWith(posixDirname))
    .map((file) => file.replace(posixDirname, ''));
}

describe('compiler', () => {
  let compilers: Record<
    'default' | 'cssImportSpecifier' | 'shortIdentifiers',
    ReturnType<typeof createCompiler>
  >;

  beforeAll(async () => {
    compilers = {
      default: createCompiler({
        root: __dirname,
      }),

      cssImportSpecifier: createCompiler({
        root: __dirname,
        cssImportSpecifier: (filePath) => filePath + '.custom-extension.css',
      }),

      shortIdentifiers: createCompiler({
        root: __dirname,
        identifiers: 'short',
      }),
    };
  });

  test('absolute paths', async () => {
    const compiler = compilers.default;

    const cssPath = path.join(
      __dirname,
      'fixtures/class-composition/styles.css.ts',
    );
    const sharedCssPath = path.join(
      __dirname,
      'fixtures/class-composition/shared.css.ts',
    );

    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      "import 'fixtures/class-composition/shared.css.ts.vanilla.css';
      import 'fixtures/class-composition/styles.css.ts.vanilla.css';
      export var className = 'styles_className__q7x3ow0 shared_shared__16bmd920';"
    `);
    const localWatchFiles = getLocalFiles(output.watchFiles);
    expect(localWatchFiles).toMatchInlineSnapshot(`
      [
        "/fixtures/class-composition/styles.css.ts",
        "/fixtures/class-composition/shared.css.ts",
      ]
    `);

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        ".styles_className__q7x3ow0 {
          color: red;
        }"
      `);
      expect(toPosix(filePath)).toBe(
        'fixtures/class-composition/styles.css.ts',
      );
    })();

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        ".shared_shared__16bmd920 {
          background: blue;
        }"
      `);
      expect(toPosix(filePath)).toBe(
        'fixtures/class-composition/shared.css.ts',
      );
    })();
  });

  test('root relative paths', async () => {
    const compiler = compilers.default;

    const cssPath = 'fixtures/class-composition/styles.css.ts';
    const sharedCssPath = 'fixtures/class-composition/shared.css.ts';

    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      "import 'fixtures/class-composition/shared.css.ts.vanilla.css';
      import 'fixtures/class-composition/styles.css.ts.vanilla.css';
      export var className = 'styles_className__q7x3ow0 shared_shared__16bmd920';"
    `);

    const localWatchFiles = getLocalFiles(output.watchFiles);
    expect(localWatchFiles).toMatchInlineSnapshot(`
      [
        "/fixtures/class-composition/styles.css.ts",
        "/fixtures/class-composition/shared.css.ts",
      ]
    `);

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        ".styles_className__q7x3ow0 {
          color: red;
        }"
      `);
      expect(toPosix(filePath)).toBe(
        'fixtures/class-composition/styles.css.ts',
      );
    })();

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        ".shared_shared__16bmd920 {
          background: blue;
        }"
      `);
      expect(toPosix(filePath)).toBe(
        'fixtures/class-composition/shared.css.ts',
      );
    })();
  });

  test('root relative paths starting with dot', async () => {
    const compiler = compilers.default;

    const cssPath = './fixtures/class-composition/styles.css.ts';
    const sharedCssPath = './fixtures/class-composition/shared.css.ts';

    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      "import 'fixtures/class-composition/shared.css.ts.vanilla.css';
      import 'fixtures/class-composition/styles.css.ts.vanilla.css';
      export var className = 'styles_className__q7x3ow0 shared_shared__16bmd920';"
    `);

    const localWatchFiles = getLocalFiles(output.watchFiles);
    expect(localWatchFiles).toMatchInlineSnapshot(`
      [
        "/fixtures/class-composition/styles.css.ts",
        "/fixtures/class-composition/shared.css.ts",
      ]
    `);

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        ".styles_className__q7x3ow0 {
          color: red;
        }"
      `);
      expect(toPosix(filePath)).toBe(
        'fixtures/class-composition/styles.css.ts',
      );
    })();

    await (async () => {
      const { css, filePath } = await compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        ".shared_shared__16bmd920 {
          background: blue;
        }"
      `);
      expect(toPosix(filePath)).toBe(
        'fixtures/class-composition/shared.css.ts',
      );
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
      toPosix(error?.message.replace(__dirname, '{{__dirname}}') ?? ''),
    ).toMatchInlineSnapshot(
      `"No CSS for file: {{__dirname}}/does-not-exist.css.ts"`,
    );
  });

  test('short identifiers', async () => {
    const compiler = compilers.shortIdentifiers;

    const cssPath = path.join(
      __dirname,
      'fixtures/class-composition/styles.css.ts',
    );
    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      "import 'fixtures/class-composition/shared.css.ts.vanilla.css';
      import 'fixtures/class-composition/styles.css.ts.vanilla.css';
      export var className = 'q7x3ow0 _16bmd920';"
    `);
    const { css } = await compiler.getCssForFile(cssPath);
    expect(css).toMatchInlineSnapshot(`
      ".q7x3ow0 {
        color: red;
      }"
    `);
  });

  test('custom cssImportSpecifier', async () => {
    const compiler = compilers.cssImportSpecifier;

    const cssPath = path.join(
      __dirname,
      'fixtures/class-composition/styles.css.ts',
    );
    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      "import 'fixtures/class-composition/shared.css.ts.custom-extension.css';
      import 'fixtures/class-composition/styles.css.ts.custom-extension.css';
      export var className = 'styles_className__q7x3ow0 shared_shared__16bmd920';"
    `);
  });

  test('does not remove unused composition classes', async () => {
    const compiler = compilers.default;

    const cssPathA = './fixtures/unused-compositions/styles_a.css.ts';
    const cssPathB = './fixtures/unused-compositions/styles_b.css.ts';
    const sharedCssPath = './fixtures/unused-compositions/shared.css.ts';

    // Process the file multiple times with different args to test caching
    await compiler.processVanillaFile(cssPathA, { outputCss: false });
    const outputA = await compiler.processVanillaFile(cssPathA);

    // The `root` className string should be a composition of multiple classes:
    expect(outputA.source).toMatchInlineSnapshot(`
      "import 'fixtures/unused-compositions/shared.css.ts.vanilla.css';
      export var root = 'styles_a_root__mh4uy80 shared_shared__5i7sy00';"
    `);

    // Process the file multiple times with different args to test caching
    await compiler.processVanillaFile(cssPathB, { outputCss: false });
    const outputB = await compiler.processVanillaFile(cssPathB);

    // The `root` className string should be a composition of multiple classes:
    expect(outputB.source).toMatchInlineSnapshot(`
      "import 'fixtures/unused-compositions/shared.css.ts.vanilla.css';
      export var root = 'styles_b_root__1k6843p0 shared_shared__5i7sy00';"
    `);

    const { css } = await compiler.getCssForFile(sharedCssPath);
    expect(css).toMatchInlineSnapshot(`
      ".shared_shared__5i7sy00 {
        padding: 20px;
        background: peachpuff;
      }"
    `);
  });

  test('getter selector', async () => {
    const compiler = compilers.default;

    const cssPath = path.join(__dirname, 'fixtures/selectors/getter.css.ts');
    const output = await compiler.processVanillaFile(cssPath);
    const { css } = await compiler.getCssForFile(cssPath);

    expect(output.source).toMatchInlineSnapshot(`
      "import 'fixtures/selectors/getter.css.ts.vanilla.css';
      export var child = 'getter_child__ux95kn0';
      export var parent = 'getter_parent__ux95kn1';"
    `);

    expect(css).toMatchInlineSnapshot(`
      ".getter_child__ux95kn0 {
        background: blue;
      }
      .getter_parent__ux95kn1 .getter_child__ux95kn0 {
        color: red;
      }
      .getter_parent__ux95kn1 {
        background: yellow;
      }
      .getter_parent__ux95kn1:has(.getter_child__ux95kn0) {
        padding: 10px;
      }"
    `);
  });

  test('recipes class names', async () => {
    const compiler = compilers.default;

    const cssPath = path.join(
      __dirname,
      'fixtures/recipes/recipeClassNames.css.ts',
    );
    const output = await compiler.processVanillaFile(cssPath);
    const { css } = await compiler.getCssForFile(cssPath);

    expect(output.source).toMatchInlineSnapshot();

    expect(css).toMatchInlineSnapshot();
  });

  afterAll(async () => {
    await Promise.allSettled(
      Object.values(compilers).map((compiler) => compiler.close()),
    );
  });
});
