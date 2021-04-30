import lunr from 'lunr';

import docsManifest from '../../docs-manifest.json';

export interface SearchResult {
  name: string;
  route: string;
  hash: string;
  breadcrumbs: Array<string>;
  content: string;
  matches: Array<string>;
}

let resultCounter = 1;
const resultStore = new Map<
  string,
  {
    name: string;
    route: string;
    hash: string;
    breadcrumbs: Array<string>;
    content: string;
  }
>();

const searchIndex = lunr(function () {
  this.ref('id');
  this.field('content');

  docsManifest.forEach(({ route, sections }) => {
    sections.forEach(({ name, hash, breadcrumbs, content }) => {
      const id = String(resultCounter++);

      resultStore.set(id, {
        name,
        route,
        hash,
        breadcrumbs,
        content,
      });

      this.add({
        id,
        content,
      });
    });
  }, this);
});

export const search = (searchTerm: string): Array<SearchResult> => {
  const results = searchIndex.search(`${searchTerm}~1`);

  return results.map(({ ref, matchData }) => {
    const storedResult = resultStore.get(ref);

    if (!storedResult) {
      throw new Error(`No stored result for ref: ${ref}`);
    }

    return {
      ...storedResult,
      matches: Object.keys(matchData.metadata),
    };
  });
};
