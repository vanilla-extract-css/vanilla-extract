const { resolve, join } = require('path');
const { promises } = require('fs');
const makeDocumentIndex = require('./documentIndexer');
const contents = require('./contents');

(async () => {
  const manifest = { groups: [], pages: [] };

  for (const { group, pages } of contents) {
    manifest.groups.push(group);

    for (const page of pages) {
      console.log('Loading', page);
      const fileName = join(group, `${page}.md`);
      const fileContents = await promises.readFile(
        join(__dirname, './docs', fileName),
      );

      manifest.pages.push({
        group,
        fileName,
        route: `/documentation/${page}/`,
        sections: makeDocumentIndex(fileContents),
      });
    }
  }

  await promises.writeFile(
    resolve(__dirname, 'docs-manifest.json'),
    JSON.stringify(manifest, null, 2),
  );
})();
