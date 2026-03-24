import { createRequire } from 'module';
import minimist from 'minimist';
import path from 'path';
import { existsSync, promises as fs } from 'fs';

const require = createRequire(import.meta.url);
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { vanillaExtractPlugin as vanillaExtractPluginNext } from '@vanilla-extract/esbuild-plugin-next';
import * as esbuild from 'esbuild';

const argv = minimist(process.argv.slice(2));
const port = Number(argv.port) || 4006;
const mode: 'development' | 'production' =
  argv.mode === 'production' ? 'production' : 'development';
const variant: string = argv.variant || 'esbuild';

const fixtures = [
  'features',
  'layers',
  'low-level',
  'recipes',
  'sprinkles',
  'themed',
  'thirdparty',
];

const plugin = variant.includes('next')
  ? vanillaExtractPluginNext
  : vanillaExtractPlugin;

const outdir = path.resolve(import.meta.dirname, 'dist', variant);

async function main() {
  if (existsSync(outdir)) {
    await fs.rm(outdir, { recursive: true });
  }
  await fs.mkdir(outdir, { recursive: true });

  const ctx = await esbuild.context({
    entryPoints: Object.fromEntries(
      fixtures.map((f) => [f, require.resolve(`@fixtures/${f}/src/index.ts`)]),
    ),
    metafile: true,
    platform: 'browser',
    bundle: true,
    minify: false,
    logLevel: 'error',
    absWorkingDir: path.resolve(import.meta.dirname, '../..'),
    plugins: [
      plugin({
        identifiers: mode === 'production' ? 'short' : 'debug',
        runtime: variant.includes('runtime'),
      }),
    ],
    outdir,
  });

  await ctx.watch();
  await ctx.serve({ servedir: outdir, port });

  const liveReloadScript =
    mode !== 'production'
      ? `<script type="module">new EventSource('/esbuild').addEventListener('change', () => location.reload());</script>`
      : '';

  // Generate per-fixture HTML files
  for (const f of fixtures) {
    const fixtureDir = path.join(outdir, f);
    if (!existsSync(fixtureDir)) {
      await fs.mkdir(fixtureDir, { recursive: true });
    }
    // The entry output goes to outdir/{fixture}.js and outdir/{fixture}.css
    // We put the HTML in outdir/{fixture}/index.html with relative paths going up
    await fs.writeFile(
      path.join(fixtureDir, 'index.html'),
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>esbuild - ${f}</title>
  <link rel="stylesheet" type="text/css" href="/${f}.css" />
  ${liveReloadScript}
</head>
<body>
  <script src="/${f}.js"></script>
</body>
</html>
`,
    );
  }

  // Copy root index.html for convenient navigation
  await fs.copyFile(
    path.resolve(import.meta.dirname, 'index.html'),
    path.join(outdir, 'index.html'),
  );

  console.log(`esbuild (${variant}) server listening on port ${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
