import fs from 'fs/promises';
import path from 'path';

import glob from 'fast-glob';
import { outdent } from 'outdent';

const releaseNotesOrder = [
  'css',
  'esbuild-plugin',
  'vite-plugin',
  'webpack-plugin',
  'next-plugin',
  'parcel-transformer',
  'rollup-plugin',
  'dynamic',
  'utils',
  'integration',
  'sprinkles',
  'recipes',
  'babel-plugin-debug-ids',
  'jest-transform',
];

(async () => {
  const changelogs = await glob('packages/*/CHANGELOG.md', {
    cwd: path.join(__dirname, '../'),
    absolute: true,
    ignore: ['packages/private'],
  });

  const changelogByPackage: Record<string, string> = {};

  for (const changelog of changelogs) {
    const packageName = path.dirname(changelog).split(/.*\/packages\//)[1];
    const changelogContents = await fs.readFile(changelog, 'utf-8');

    changelogByPackage[packageName] = changelogContents
      .split('\n')
      .map((line) => {
        if (/^## [\d\.]+/.test(line)) {
          return line.replace('##', '####');
        }

        const isChange = /^### (Patch|Minor|Major) Changes$/.test(line);
        const isMigration = /^[\s]+### Migration Guide$/.test(line);
        if (isChange || isMigration) {
          return line.replace('###', '####');
        }

        if (/^# @vanilla-extract\//.test(line)) {
          return line.replace('#', '##');
        }

        return line;
      })
      .join('\n');
  }

  const sortedNotes = releaseNotesOrder.map(
    (packageName) => changelogByPackage[packageName],
  );
  const otherNotes = Object.keys(changelogByPackage)
    .filter((packageName) => !releaseNotesOrder.includes(packageName))
    .map((packageName) => changelogByPackage[packageName]);

  await fs.writeFile(
    path.join(__dirname, 'docs/overview/release-notes.md'),
    outdent`
      ---
      title: Release Notes
      ---

      # Release Notes

      ${[...sortedNotes, ...otherNotes].join('\n\n')}
    `,
    'utf-8',
  );
})();
