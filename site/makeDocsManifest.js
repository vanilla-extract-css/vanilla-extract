const { resolve, join } = require('path');
const { promises } = require('fs');
const makeDocumentIndex = require('./documentIndexer');
const contents = require('./contents');

(async () => {
  const manifest = await Promise.all(
    contents.map(async ({ fileName, id, root }) => {
      const fileContents = await promises.readFile(
        join(__dirname, './docs', fileName),
      );

      return {
        fileName,
        id,
        route: `/documentation/${id && !root ? `${id}/` : ''}`,
        sections: makeDocumentIndex(fileContents),
      };
    }),
  );

  await promises.writeFile(
    resolve(__dirname, 'docs-manifest.json'),
    JSON.stringify(manifest, null, 2),
  );
})();
