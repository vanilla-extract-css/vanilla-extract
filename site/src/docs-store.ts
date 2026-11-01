import { getEntry, type CollectionEntry } from 'astro:content';
import { contents } from './contents';

export interface DocsPageSummary {
  label: string;
  title: string;
  route: string;
}

export interface DocsPageData extends DocsPageSummary {
  slug: string;
  entry: CollectionEntry<'docs'>;
}

export const getDocsPages = () =>
  Promise.all(
    contents.flatMap(({ group, label, pages }) =>
      pages.map(async (page): Promise<DocsPageData> => {
        const entry = await getEntry('docs', `${group}/${page}`);

        if (!entry) {
          throw new Error(`Missing docs page: docs/${group}/${page}.mdx`);
        }

        const { title, parent } = entry.data;
        const slug = parent ? `${parent}/${page}` : page;

        return {
          label,
          title,
          slug,
          route: `/documentation/${slug}/`,
          entry,
        };
      }),
    ),
  );

export const groups = contents.map(({ label }) => label);

export const toSummary = ({
  label,
  title,
  route,
}: DocsPageData): DocsPageSummary => ({ label, title, route });
