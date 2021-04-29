const path = require('path');
const { existsSync, promises: fs } = require('fs');

const { vanillaExtractPlugin } = require('@vanilla-extract/esbuild-plugin');
const { serve } = require('esbuild');

const entry = './src/index.ts';
const outdir = path.join(__dirname, 'dist');
const port = process.env.PORT || 8080;

async function run() {
  if (existsSync(outdir)) {
    await fs.rm(outdir, { recursive: true });
  }

  await fs.mkdir(outdir);

  await serve(
    { servedir: outdir, port },
    {
      entryPoints: [entry],
      platform: 'browser',
      bundle: true,
      plugins: [vanillaExtractPlugin()],
      outdir,
    },
  );

  await fs.writeFile(
    path.join(outdir, 'index.html'),
    `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>vanilla-extract-esbuild</title>
        <link rel="stylesheet" type="text/css" href="index.css" />
        </head>
      <body>
        <script src="index.js"></script>
      </body>
      </html>
    `,
  );
  console.log(`Demo running on http://localhost:${port}`);
}

run();
