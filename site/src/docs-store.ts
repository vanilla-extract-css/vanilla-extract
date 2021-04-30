import docsManifest from '../docs-manifest.json';

export default docsManifest.map(({ fileName, route, id, sections }, index) => {
  const { frontMatter, default: component } = require(`../docs/${fileName}`);

  return {
    Component: component as (props: any) => JSX.Element,
    title: frontMatter.title as string,
    route,
    index,
    id,
    sections,
  };
});
