import path from 'path';
import { createCompiler } from '@vanilla-extract/compiler';
import { normalizePath } from '@vanilla-extract/integration';

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) =>
    (val as string).replaceAll(normalizePath(__dirname), '{{__dirname}}'),
});

function getLocalFiles(files: Set<string>) {
  const posixDirname = normalizePath(__dirname);

  return [...files]
    .map(normalizePath)
    .filter((file) => file.startsWith(posixDirname));
}

describe('compiler', () => {
  let compilers: Record<
    | 'default'
    | 'cssImportSpecifier'
    | 'shortIdentifiers'
    | 'viteResolve'
    | 'vitePlugins'
    | 'tsconfigPaths',
    ReturnType<typeof createCompiler>
  >;

  beforeAll(async () => {
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default;

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
      viteResolve: createCompiler({
        root: __dirname,
        viteResolve: {
          alias: {
            '@util': path.resolve(__dirname, 'fixtures/vite-config/util'),
          },
        },
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
      tsconfigPaths: createCompiler({
        root: __dirname,
        vitePlugins: [tsconfigPaths()],
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
      import '{{__dirname}}/fixtures/class-composition/shared.css.ts.vanilla.css';
      import '{{__dirname}}/fixtures/class-composition/styles.css.ts.vanilla.css';
      export var className = 'styles_className__q7x3ow0 shared_shared__16bmd920';
    `);

    const localWatchFiles = getLocalFiles(output.watchFiles);
    expect(localWatchFiles).toMatchInlineSnapshot(`
      [
        {{__dirname}}/fixtures/class-composition/shared.css.ts,
        {{__dirname}}/fixtures/class-composition/styles.css.ts,
      ]
    `);

    {
      const { css, filePath } = compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        .styles_className__q7x3ow0 {
          color: red;
        }
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `{{__dirname}}/fixtures/class-composition/styles.css.ts`,
      );
    }

    {
      const { css, filePath } = compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        .shared_shared__16bmd920 {
          background: blue;
        }
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `{{__dirname}}/fixtures/class-composition/shared.css.ts`,
      );
    }
  });

  test('root relative paths', async () => {
    const compiler = compilers.default;

    const cssPath = 'fixtures/class-composition/styles.css.ts';
    const sharedCssPath = 'fixtures/class-composition/shared.css.ts';

    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/class-composition/shared.css.ts.vanilla.css';
      import '{{__dirname}}/fixtures/class-composition/styles.css.ts.vanilla.css';
      export var className = 'styles_className__q7x3ow0 shared_shared__16bmd920';
    `);

    const localWatchFiles = getLocalFiles(output.watchFiles);
    expect(localWatchFiles).toMatchInlineSnapshot(`
      [
        {{__dirname}}/fixtures/class-composition/shared.css.ts,
        {{__dirname}}/fixtures/class-composition/styles.css.ts,
      ]
    `);

    {
      const { css, filePath } = compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        .styles_className__q7x3ow0 {
          color: red;
        }
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `{{__dirname}}/fixtures/class-composition/styles.css.ts`,
      );
    }

    {
      const { css, filePath } = compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        .shared_shared__16bmd920 {
          background: blue;
        }
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `{{__dirname}}/fixtures/class-composition/shared.css.ts`,
      );
    }
  });

  test('root relative paths starting with dot', async () => {
    const compiler = compilers.default;

    const cssPath = './fixtures/class-composition/styles.css.ts';
    const sharedCssPath = './fixtures/class-composition/shared.css.ts';

    const output = await compiler.processVanillaFile(cssPath);
    expect(output.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/class-composition/shared.css.ts.vanilla.css';
      import '{{__dirname}}/fixtures/class-composition/styles.css.ts.vanilla.css';
      export var className = 'styles_className__q7x3ow0 shared_shared__16bmd920';
    `);

    const localWatchFiles = getLocalFiles(output.watchFiles);
    expect(localWatchFiles).toMatchInlineSnapshot(`
      [
        {{__dirname}}/fixtures/class-composition/shared.css.ts,
        {{__dirname}}/fixtures/class-composition/styles.css.ts,
      ]
    `);

    {
      const { css, filePath } = compiler.getCssForFile(cssPath);
      expect(css).toMatchInlineSnapshot(`
        .styles_className__q7x3ow0 {
          color: red;
        }
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `{{__dirname}}/fixtures/class-composition/styles.css.ts`,
      );
    }

    {
      const { css, filePath } = compiler.getCssForFile(sharedCssPath);
      expect(css).toMatchInlineSnapshot(`
        .shared_shared__16bmd920 {
          background: blue;
        }
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `{{__dirname}}/fixtures/class-composition/shared.css.ts`,
      );
    }
  });

  test('throws on getCssForFile when file does not exist', async () => {
    const compiler = compilers.default;
    let error: Error;

    try {
      compiler.getCssForFile('does-not-exist.css.ts');
    } catch (_error) {
      error = _error as Error;
    }

    expect(
      // We know `error.message` is defined here
      normalizePath(error!.message),
    ).toMatchInlineSnapshot(
      `No CSS for file: {{__dirname}}/does-not-exist.css.ts`,
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
      import '{{__dirname}}/fixtures/class-composition/shared.css.ts.vanilla.css';
      import '{{__dirname}}/fixtures/class-composition/styles.css.ts.vanilla.css';
      export var className = 'q7x3ow0 _16bmd920';
    `);
    const { css } = compiler.getCssForFile(cssPath);
    expect(css).toMatchInlineSnapshot(`
      .q7x3ow0 {
        color: red;
      }
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
      import '{{__dirname}}/fixtures/class-composition/shared.css.ts.custom-extension.css';
      import '{{__dirname}}/fixtures/class-composition/styles.css.ts.custom-extension.css';
      export var className = 'styles_className__q7x3ow0 shared_shared__16bmd920';
    `);
  });

  test('should replace class compositions correctly', async () => {
    const compiler = compilers.default;

    const baseCssPath = './fixtures/class-composition/base.css.ts';
    const buttonCssPath = './fixtures/class-composition/button.css.ts';
    const stepperCssPath = './fixtures/class-composition/stepper.css.ts';

    const baseOutput = await compiler.processVanillaFile(baseCssPath);
    expect(baseOutput.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/class-composition/base.css.ts.vanilla.css';
      export var fontFamilyBase = 'base_fontFamilyBase__1xukjx0';
      export var base = 'base_base__1xukjx1 base_fontFamilyBase__1xukjx0';
    `);

    const buttonOutput = await compiler.processVanillaFile(buttonCssPath);
    expect(buttonOutput.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/class-composition/base.css.ts.vanilla.css';
      import '{{__dirname}}/fixtures/class-composition/button.css.ts.vanilla.css';
      export var button = 'button_button__59rihu0 base_base__1xukjx1 base_fontFamilyBase__1xukjx0';
    `);

    const stepperOutput = await compiler.processVanillaFile(stepperCssPath);
    expect(stepperOutput.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/class-composition/base.css.ts.vanilla.css';
      import '{{__dirname}}/fixtures/class-composition/button.css.ts.vanilla.css';
      import '{{__dirname}}/fixtures/class-composition/stepper.css.ts.vanilla.css';
      export var stepperContainer = 'stepper_stepperContainer__p034sj0 base_base__1xukjx1 base_fontFamilyBase__1xukjx0';
      export var stepperButton = 'stepper_stepperButton__p034sj1';
    `);

    {
      const { css, filePath } = compiler.getCssForFile(baseCssPath);
      expect(css).toMatchInlineSnapshot(`
        .base_fontFamilyBase__1xukjx0 {
          font-family: Arial, sans-serif;
        }
        .base_base__1xukjx1 {
          background: blue;
        }
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `{{__dirname}}/fixtures/class-composition/base.css.ts`,
      );
    }

    {
      const { css, filePath } = compiler.getCssForFile(buttonCssPath);
      expect(css).toMatchInlineSnapshot(`
        .button_button__59rihu0 {
          color: red;
        }
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `{{__dirname}}/fixtures/class-composition/button.css.ts`,
      );
    }

    {
      const { css, filePath } = compiler.getCssForFile(stepperCssPath);
      expect(css).toMatchInlineSnapshot(`
        .stepper_stepperContainer__p034sj0 {
          font-size: 32px;
        }
        .stepper_stepperContainer__p034sj0 .button_button__59rihu0.stepper_stepperButton__p034sj1 {
          border: 1px solid black;
        }
      `);
      expect(normalizePath(filePath)).toMatchInlineSnapshot(
        `{{__dirname}}/fixtures/class-composition/stepper.css.ts`,
      );
    }
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
      import '{{__dirname}}/fixtures/unused-compositions/shared.css.ts.vanilla.css';
      export var root = 'styles_a_root__mh4uy80 shared_shared__5i7sy00';
    `);

    // Process the file multiple times with different args to test caching
    await compiler.processVanillaFile(cssPathB, { outputCss: false });
    const outputB = await compiler.processVanillaFile(cssPathB);

    // The `root` className string should be a composition of multiple classes:
    expect(outputB.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/unused-compositions/shared.css.ts.vanilla.css';
      export var root = 'styles_b_root__1k6843p0 shared_shared__5i7sy00';
    `);

    const { css } = compiler.getCssForFile(sharedCssPath);
    expect(css).toMatchInlineSnapshot(`
      .shared_shared__5i7sy00 {
        padding: 20px;
        background: peachpuff;
      }
    `);
  });

  test('getter selector', async () => {
    const compiler = compilers.default;

    const cssPath = path.join(__dirname, 'fixtures/selectors/getter.css.ts');
    const output = await compiler.processVanillaFile(cssPath);
    const { css } = compiler.getCssForFile(cssPath);

    expect(output.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/selectors/getter.css.ts.vanilla.css';
      export var child = 'getter_child__ux95kn0';
      export var parent = 'getter_parent__ux95kn1';
    `);

    expect(css).toMatchInlineSnapshot(`
      .getter_child__ux95kn0 {
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
      }
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
      import '{{__dirname}}/fixtures/recipes/recipeClassNames.css.ts.vanilla.css';
      import { createRuntimeFn as _7a468 } from '@vanilla-extract/recipes/createRuntimeFn';
      export var recipeWithReferences = _7a468({defaultClassName:'recipeClassNames_recipeWithReferences__129pj258',variantClassNames:{first:{true:'recipeClassNames_recipeWithReferences_first_true__129pj259'}},defaultVariants:{},compoundVariants:[]});
    `);

    expect(css).toMatchInlineSnapshot(`
      .recipeClassNames_basic_rounded_true__129pj257 {
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
      }
    `);
  });

  test('Vite resolve', async () => {
    const compiler = compilers.viteResolve;

    const cssPath = path.join(__dirname, 'fixtures/vite-config/alias.css.ts');
    const output = await compiler.processVanillaFile(cssPath);
    const { css } = compiler.getCssForFile(cssPath);

    expect(output.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/vite-config/util/vars.css.ts.vanilla.css';
      import '{{__dirname}}/fixtures/vite-config/alias.css.ts.vanilla.css';
      export var root = 'alias_root__ez4dr20';
    `);

    expect(css).toMatchInlineSnapshot(`
      .alias_root__ez4dr20 {
        --border__13z1r1g0: 1px solid black;
        border: var(--border__13z1r1g0);
      }
    `);
  });

  test('Vite plugins', async () => {
    const compiler = compilers.vitePlugins;

    const cssPath = path.join(__dirname, 'fixtures/vite-config/plugin.css.ts');
    const output = await compiler.processVanillaFile(cssPath);
    const { css } = compiler.getCssForFile(cssPath);

    expect(output.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/vite-config/plugin.css.ts.vanilla.css';
      export var root = 'plugin_root__1e902gk0';
    `);

    expect(css).toMatchInlineSnapshot(`
      .plugin_root__1e902gk0 {
        color: green;
      }
    `);
  });

  test('vite-tsconfig-paths', async () => {
    const compiler = compilers.tsconfigPaths;

    const cssPath = path.join(
      __dirname,
      'fixtures/tsconfig-paths/src/main.css.ts',
    );
    const output = await compiler.processVanillaFile(cssPath);
    const { css } = compiler.getCssForFile(cssPath);

    expect(output.source).toMatchInlineSnapshot(`
      import '{{__dirname}}/fixtures/tsconfig-paths/src/main.css.ts.vanilla.css';
      export var box = 'main_box__1tm7bbb0';
    `);

    expect(css).toMatchInlineSnapshot(`
      .main_box__1tm7bbb0 {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
    `);
  });
});
