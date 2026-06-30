import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';

type Heading = {
  raw: string;
  level: number;
  name: string;
  breadcrumbs?: string[];
};

const getBreadcrumbs = (
  headings: Heading[],
  index: number,
  level = Infinity,
  defaultValue: string[] = [],
): string[] => {
  const target = headings[index];
  const newValue =
    target.level < level ? [target.name, ...defaultValue] : defaultValue;

  return target.level === 1 || index === 0
    ? newValue
    : getBreadcrumbs(headings, index - 1, target.level, newValue);
};

export const parseContents = (rawContent: any) => {
  const slugger = new GithubSlugger();

  const { content, data } = matter(rawContent);
  const headings = [...content.matchAll(/^(#{1,6}) +(.+?)\s*$/gm)].map(
    (match) => ({
      raw: match[0],
      level: match[1].length,
      name: match[2],
    }),
  );

  if (headings.length === 0) {
    throw new Error('No headings found in the document. Something went wrong.');
  }

  const breadcrumbs = headings.map((heading, index) => ({
    ...heading,
    breadcrumbs: getBreadcrumbs(headings, index),
  }));

  const sections = breadcrumbs.map((heading) => {
    const hash = slugger.slug(heading.name);

    if (!hash) {
      throw new Error(
        `Failed to generate a slug for heading "${heading.raw}". Headings must contain slug-able characters.`,
      );
    }

    return {
      ...heading,
      page: data.title,
      hash,
    };
  });

  return {
    sections,
    parent: data.parent,
  };
};
