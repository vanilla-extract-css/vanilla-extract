const { vanillaExtractPlugin } = require('@vanilla-extract/esbuild-plugin');

require('esbuild')
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    plugins: [vanillaExtractPlugin()],
    outfile: 'out.js',
  })
  .then(() => console.log('success'))
  .catch((e) => {
    console.error(e);
  });
