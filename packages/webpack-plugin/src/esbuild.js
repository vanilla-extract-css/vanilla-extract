const esbuild = require('esbuild');

let startTime = Date.now();
let result = esbuild.buildSync({
  entryPoints: [
    '/Users/mjones/projects/vanilla-extract/fixtures/themed/src/styles.css.ts',
  ],
  metafile: true,
  bundle: true,
  external: ['@vanilla-extract'],
  platform: 'node',
  write: false,
});

console.log(Date.now() - startTime);

startTime = Date.now();
result = esbuild.buildSync({
  entryPoints: [
    '/Users/mjones/projects/vanilla-extract/fixtures/themed/src/styles.css.ts',
  ],
  metafile: true,
  bundle: true,
  external: ['@vanilla-extract'],
  platform: 'node',
  write: false,
});

console.log(Date.now() - startTime);

startTime = Date.now();
result = esbuild.buildSync({
  entryPoints: [
    '/Users/mjones/projects/vanilla-extract/fixtures/themed/src/styles.css.ts',
  ],
  metafile: true,
  bundle: true,
  external: ['@vanilla-extract'],
  platform: 'node',
  write: false,
});

console.log(Date.now() - startTime);
