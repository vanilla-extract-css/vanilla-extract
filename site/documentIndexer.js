const matter = require('gray-matter');
const GithubSlugger = require('github-slugger');

const getBreadcrumbs = (headings, index, level = Infinity, value = []) => {
  const target = headings[index];
  const newValue = target.level < level ? [target.name, ...value] : value;

  return target.level === 1 || index === 0
    ? newValue
    : getBreadcrumbs(headings, index - 1, target.level, newValue);
};

const parseContents = (rawContent) => {
  const slugger = new GithubSlugger();

  const { content, data } = matter(rawContent);

  const headings = content.match(/#{1,}( [ -\w().]*)/g).map((heading) => {
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

module.exports = parseContents;
