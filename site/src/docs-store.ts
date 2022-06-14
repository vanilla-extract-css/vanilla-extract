import docsManifest from '../docs-manifest.json';

export const groups = docsManifest.groups;

export const pages = docsManifest.pages.map(
  ({ group, label, fileName, route, sections }) => {
    const { frontMatter, default: component } = require(`../docs/${fileName}`);

    return {
      group,
      label,
      Component: component as (props: any) => JSX.Element,
      title: frontMatter.title as string,
      route,
      sections,
    };
  },
);
