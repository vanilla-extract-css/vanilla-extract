import { resolve, join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { parseContents } from './documentIndexer.mts';
import { contents } from './contents.mts';

const manifest: {
  groups: string[];
  pages: {
    group: string;
    label: string;
    fileName: string;
    route: string;
    sections: {
      raw: string;
      level: number;
      name: string;
      breadcrumbs?: string[];
    }[];
  }[];
} = { groups: [], pages: [] };

for (const { group, label, pages } of contents) {
  manifest.groups.push(label);

  for (const page of pages) {
    console.log('Loading', page);

    const fileName = join(group, `${page}.md`);
    const fileContents = await readFile(
      join(import.meta.dirname, './docs', fileName),
    );

    const { sections, parent } = parseContents(fileContents);

    const route = parent
      ? `/documentation/${parent}/${page}/`
      : `/documentation/${page}/`;

    manifest.pages.push({
      group,
      label,
      fileName,
      route,
      sections,
    });
  }
}

await writeFile(
  resolve(import.meta.dirname, 'docs-manifest.json'),
  JSON.stringify(manifest, null, 2),
);
