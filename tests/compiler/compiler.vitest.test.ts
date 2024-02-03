import path from 'path';
import { describe, beforeAll, afterAll, test, expect } from 'vitest';
import { createCompiler } from '@vanilla-extract/integration';

// Vitest has trouble with snapshots that don't contain wrapping quotes. See this regex and the functions above/below it:
// https://github.com/vitest-dev/vitest/blob/ae73f2737607a878ba589d548aa6f8ba639dc07c/packages/snapshot/src/port/inlineSnapshot.ts#L96
// We want to replace __dirname in strings, so we need to add a snapshot serializer for strings.
// But we also need to add quotes around the string to make sure Vitest doesn't get confused.
// In fact, just updating the snapshot from now on will mangle the test file ¯\_(ツ)_/¯
expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) => `"${(val as string).replaceAll(__dirname, '{{__dirname}}')}"`,
});

describe('compiler running in Vitest', () => {
  let compilers: Record<
    'default' | 'vitePlugins' | 'viteResolve',
    ReturnType<typeof createCompiler>
  >;

  beforeAll(async () => {
    compilers = {
      default: createCompiler({
        root: __dirname,
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

  test('with no plugins', async () => {
    const compiler = compilers.default;

    const cssPath = path.join(
      __dirname,
      'fixtures/class-composition/styles.css.ts',
    );

    const { source } = await compiler.processVanillaFile(cssPath);
    expect(source).toMatchInlineSnapshot(`
      "import 'fixtures/class-composition/shared.css.ts.vanilla.css';
      import 'fixtures/class-composition/styles.css.ts.vanilla.css';
      export var className = 'styles_className__q7x3ow0 shared_shared__16bmd920';"
    `);

    const { css } = compiler.getCssForFile(cssPath);
    expect(css).toMatchInlineSnapshot(`
      ".styles_className__q7x3ow0 {
        color: red;
      }"
    `);
  });

  test('with Vite plugins', async () => {
    const compiler = compilers.vitePlugins;

    const cssPath = path.join(__dirname, 'fixtures/vite-config/plugin.css.ts');

    const { source } = await compiler.processVanillaFile(cssPath);
    expect(source).toMatchInlineSnapshot(`
      "import 'fixtures/vite-config/plugin.css.ts.vanilla.css';
      export var root = 'plugin_root__1e902gk0';"
    `);

    const { css } = compiler.getCssForFile(cssPath);
    expect(css).toMatchInlineSnapshot(`
      ".plugin_root__1e902gk0 {
        color: green;
      }"
    `);
  });

  test('with Vite resolve', async () => {
    const compiler = compilers.viteResolve;

    const cssPath = path.join(__dirname, 'fixtures/vite-config/alias.css.ts');

    const { source } = await compiler.processVanillaFile(cssPath);
    expect(source).toMatchInlineSnapshot(`
      "import 'fixtures/vite-config/util/vars.css.ts.vanilla.css';
      import 'fixtures/vite-config/alias.css.ts.vanilla.css';
      export var root = 'alias_root__ez4dr20';"
    `);

    const { css } = compiler.getCssForFile(cssPath);
    expect(css).toMatchInlineSnapshot(`
      ".alias_root__ez4dr20 {
        --border__13z1r1g0: 1px solid black;
        border: var(--border__13z1r1g0);
      }"
    `);
  });
});
