import path from 'path';
import { createCompiler, normalizePath } from '@vanilla-extract/integration';

function getLocalFiles(files: Set<string>) {
  const posixDirname = normalizePath(__dirname);

  return [...files]
    .map(normalizePath)
    .filter((file) => file.startsWith(posixDirname))
    .map((file) => file.replace(posixDirname, ''));
}

describe('compiler', () => {
  let compilers: Record<
    | 'default'
    | 'cssImportSpecifier'
    | 'shortIdentifiers'
    | 'vitePlugins'
    | 'viteResolve',
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
      vitePlugins: createCompiler({
        root: __dirname,
        vitePlugins: [
          {
            name: 'test-plugin',
            resolveId(id) {
              if (id === '~/vars') {
                return '\0resolved-vars';
              }
            },
            load: (id) => {
              if (id === '\0resolved-vars') {
                return `export const color = "green"`;
              }
            },
          },
        ],
      }),
      viteResolve: createCompiler({
        root: __dirname,
        viteResolve: {
          alias: {
            '@util': path.resolve(__dirname, 'fixtures/vite-config/util'),
          },
        },
      }),
    };
  });

  afterAll(async () => {
    await Promise.allSettled(
      Object.values(compilers).map((compiler) => compiler.close()),
    );
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

    {
      const { css, filePath } = compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        ".styles_className__q7x3ow0 {
          color: red;
        }"
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `"fixtures/class-composition/styles.css.ts"`,
      );
    }

    {
      const { css, filePath } = compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        ".shared_shared__16bmd920 {
          background: blue;
        }"
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `"fixtures/class-composition/shared.css.ts"`,
      );
    }
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

    {
      const { css, filePath } = compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        ".styles_className__q7x3ow0 {
          color: red;
        }"
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `"fixtures/class-composition/styles.css.ts"`,
      );
    }

    {
      const { css, filePath } = compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        ".shared_shared__16bmd920 {
          background: blue;
        }"
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `"fixtures/class-composition/shared.css.ts"`,
      );
    }
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

    {
      const { css, filePath } = compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        ".styles_className__q7x3ow0 {
          color: red;
        }"
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `"fixtures/class-composition/styles.css.ts"`,
      );
    }

    {
      const { css, filePath } = compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        ".shared_shared__16bmd920 {
          background: blue;
        }"
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `"fixtures/class-composition/shared.css.ts"`,
      );
    }
  });

  test('throws on getCssForFile when file does not exist', async () => {
    const compiler = compilers.default;
    let error: Error | undefined;

    try {
      compiler.getCssForFile('does-not-exist.css.ts');
    } catch (_error) {
      error = _error as Error;
    }

    expect(
      // We know `error.message` is defined, and we want make the snapshot consistent across machines
      normalizePath(error!.message!.replace(__dirname, '{{__dirname}}')),
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
    const { css } = compiler.getCssForFile(cssPath);
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

    const { css } = compiler.getCssForFile(sharedCssPath);
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
    const { css } = compiler.getCssForFile(cssPath);

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
    const { css } = compiler.getCssForFile(cssPath);

    expect(output.source).toMatchInlineSnapshot(`
      "import 'fixtures/recipes/recipeClassNames.css.ts.vanilla.css';
      import { createRuntimeFn as _7a468 } from '@vanilla-extract/recipes/createRuntimeFn';
      export var recipeWithReferences = _7a468({defaultClassName:'recipeClassNames_recipeWithReferences__129pj258',variantClassNames:{first:{true:'recipeClassNames_recipeWithReferences_first_true__129pj259'}},defaultVariants:{},compoundVariants:[]});"
    `);

    expect(css).toMatchInlineSnapshot(`
      ".recipeClassNames_basic_rounded_true__129pj257 {
        border-radius: 999px;
      }
      .recipeClassNames_recipeWithReferences__129pj258 {
        color: red;
      }
      .recipeClassNames__129pj250 .recipeClassNames_recipeWithReferences__129pj258 {
        color: blue;
      }
      .recipeClassNames_basic_spaceWithDefault_large__129pj252 .recipeClassNames_recipeWithReferences__129pj258 {
        color: yellow;
      }
      .recipeClassNames_basic_spaceWithoutDefault_small__129pj253 .recipeClassNames_recipeWithReferences__129pj258 {
        color: green;
      }
      .recipeClassNames_basic_color_red__129pj255 .recipeClassNames_recipeWithReferences_first_true__129pj259 {
        color: black;
      }
      .recipeClassNames_basic_spaceWithDefault_large__129pj252.recipeClassNames_basic_rounded_true__129pj257 .recipeClassNames_recipeWithReferences_first_true__129pj259 {
        color: white;
      }"
    `);
  });

  test('Vite plugins', async () => {
    const compiler = compilers.vitePlugins;

    const cssPath = path.join(__dirname, 'fixtures/vite-config/plugin.css.ts');
    const output = await compiler.processVanillaFile(cssPath);
    const { css } = compiler.getCssForFile(cssPath);

    expect(output.source).toMatchInlineSnapshot(`
      "import 'fixtures/vite-config/plugin.css.ts.vanilla.css';
      export var root = 'plugin_root__1e902gk0';"
    `);

    expect(css).toMatchInlineSnapshot(`
      ".plugin_root__1e902gk0 {
        color: green;
      }"
    `);
  });

  test('Vite resolve', async () => {
    const compiler = compilers.viteResolve;

    const cssPath = path.join(__dirname, 'fixtures/vite-config/alias.css.ts');
    const output = await compiler.processVanillaFile(cssPath);
    const { css } = compiler.getCssForFile(cssPath);

    expect(output.source).toMatchInlineSnapshot(`
      "import 'fixtures/vite-config/util/vars.css.ts.vanilla.css';
      import 'fixtures/vite-config/alias.css.ts.vanilla.css';
      export var root = 'alias_root__ez4dr20';"
    `);

    expect(css).toMatchInlineSnapshot(`
      ".alias_root__ez4dr20 {
        --border__13z1r1g0: 1px solid black;
        border: var(--border__13z1r1g0);
      }"
    `);
  });
});
