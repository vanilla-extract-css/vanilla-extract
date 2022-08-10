const { resolve, join } = require('path');
const { promises } = require('fs');
const makeDocumentIndex = require('./documentIndexer');
const contents = require('./contents');

(async () => {
  const manifest = { groups: [], pages: [] };

  for (const { group, label, pages } of contents) {
    manifest.groups.push(label);

    for (const page of pages) {
      console.log('Loading', page);
      const fileName = join(group, `${page}.md`);
      const fileContents = await promises.readFile(
        join(__dirname, './docs', fileName),
      );

      const { sections, parent } = makeDocumentIndex(fileContents);

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

  await promises.writeFile(
    resolve(__dirname, 'docs-manifest.json'),
    JSON.stringify(manifest, null, 2),
  );
})();
