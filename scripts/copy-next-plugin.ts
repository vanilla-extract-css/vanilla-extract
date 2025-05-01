import glob from 'fast-glob';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

// We need to use distinct next plugins for each next fixutre
// due to different next versions / mini-css-extract-plugin serializer registration
const nextPluginDistDir = path.join(
  import.meta.dirname,
  '../packages/next-plugin/dist',
);

if (!existsSync(nextPluginDistDir)) {
  throw new Error('packages/next-plugin/dist is missing.');
}

const nextFixtureDirs = await glob('fixtures/next-*', {
  onlyDirectories: true,
  absolute: true,
});

if (nextFixtureDirs.length === 0) {
  throw new Error('No next fixtures found.');
}

for (const dir of nextFixtureDirs) {
  await fs.cp(nextPluginDistDir, path.join(dir, 'next-plugin', 'dist'), {
    recursive: true,
  });
}
