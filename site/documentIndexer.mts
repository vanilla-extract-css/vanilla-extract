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
  const headingsMatch = content.match(/#{1,}( [ -\w().]*)/g);

  if (!headingsMatch) {
    throw new Error('No headings found in the document. Something went wrong.');
  }

  const headings = headingsMatch.map((heading) => {
    const split = heading.split('#');

    return {
      raw: heading,
      level: split.length - 1,
      name: split[split.length - 1].trim(),
    };
  });

  const breadcrumbs = headings.map((heading, index) => ({
    ...heading,
    breadcrumbs: getBreadcrumbs(headings, index),
  }));

  const sections = breadcrumbs.map((heading) => {
    return {
      ...heading,
      page: data.title,
      hash: slugger.slug(heading.name),
    };
  });

  return {
    sections,
    parent: data.parent,
  };
};
