import minimist from 'minimist';
import path from 'path';
import { Parcel } from '@parcel/core';

const argv = minimist(process.argv.slice(2));
const port = Number(argv.port) || 4014;
const mode: 'development' | 'production' =
  argv.mode === 'production' ? 'production' : 'development';

const fixtures = [
  'features',
  'layers',
  'low-level',
  'recipes',
  'sprinkles',
  'themed',
  'thirdparty',
];

const entries = [
  path.resolve(import.meta.dirname, 'index.html'),
  ...fixtures.map((f) => path.resolve(import.meta.dirname, f, 'index.html')),
];

const distDir = path.resolve(import.meta.dirname, 'dist');

const bundler = new Parcel({
  entries,
  mode,
  config: path.resolve(import.meta.dirname, '.parcelrc'),
  serveOptions: {
    port,
  },
  defaultTargetOptions: {
    distDir,
    shouldOptimize: false,
  },
  shouldDisableCache: true,
  logLevel: 'verbose',
});

async function main() {
  await bundler.watch((err, buildEvent) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (buildEvent?.type === 'buildFailure') {
      console.error('Build failed:', buildEvent.diagnostics[0]);
      process.exit(1);
    }
    if (buildEvent?.type === 'buildSuccess') {
      console.log(`Parcel server listening on port ${port}`);
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
